"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";

const models = [
  { id: "Kwai-Kolors/Kolors", apiId: "Kwai-Kolors/Kolors", name: "FLUX.1-schnell", access: ["free"], creditCost: 0 },
  { id: "flux-1-kontext", apiId: "flux-1-kontext", name: "flux.1 kontext", access: ["pro", "credits"], creditCost: 20 },
  { id: "dall-e-3", apiId: "dall-e-3", name: "DALL-E 3", access: ["pro", "credits"], creditCost: 10 },
  { id: "flux-schnell", apiId: "flux-schnell", name: "FLUX.1-schnell", access: ["pro", "credits"], creditCost: 5 },
  { id: "flux-1-dev", apiId: "Kwai-Kolors/Kolors", name: "FLUX.1 [dev] Flexible", access: ["pro", "credits"], creditCost: 1 },
  { id: "stable-diffusion-3", apiId: "stable-diffusion-3", name: "Stable Diffusion 3", access: ["pro", "credits"], creditCost: 2 },
];

export async function getUserStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isPro: false, credits: 0 };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .in("status", ["trialing", "active"])
    .single();

  const { data: customer } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", user.id)
    .single();
    
  return {
    isPro: !!subscription,
    credits: customer?.credits ?? 0,
  };
}

export async function generateImageAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Action Error: 请先登录后再进行操作。",
      errors: null,
      imageUrl: null,
    };
  }

  const validatedFields = generateSchema.safeParse({
    prompt: formData.get("prompt"),
    model: formData.get("model"),
    width: Number(formData.get("width")),
    height: Number(formData.get("height")),
    steps: Number(formData.get("steps")),
    cfg: Number(formData.get("cfg")),
    num_images: Number(formData.get("num_images")),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
      imageUrl: null,
    };
  }
  
  const inputs = validatedFields.data;
  const selectedModel = models.find(m => m.id === inputs.model);

  if (!selectedModel) {
    return { message: "Action Error: 无效的模型选择。", errors: null, imageUrl: null };
  }

  // --- Authorization and Credit Check ---
  const { data: customerData } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", user.id)
    .single();

  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("status")
    .in("status", ["trialing", "active"])
    .single();

  const isPro = !!subscriptionData;
  const userCredits = customerData?.credits ?? 0;
  const cost = selectedModel.creditCost;

  if (!selectedModel.access.includes("free")) {
    if (isPro) {
      console.log(`>>> [ACTION LOG] Pro user ${user.id} generating with model ${inputs.model}.`);
    } else if (selectedModel.access.includes("credits")) {
      if (userCredits < cost) {
        return { message: "Action Error: 积分不足。", errors: null, imageUrl: null };
      }
      const { error: creditError } = await supabase
        .from("customers")
        .update({ credits: userCredits - cost })
        .eq("id", user.id);

      if (creditError) {
        console.error('[DB_ERROR] Failed to deduct credits:', creditError);
        return { message: "Action Error: 数据库操作失败，无法扣除积分。", errors: null, imageUrl: null };
      }
      
      const { error: logError } = await supabase.from('credits_history').insert({
        user_id: user.id,
        change: -cost,
        reason: `Image generation with ${selectedModel.name}`,
      });
      if (logError) {
         console.error('[DB_ERROR] Failed to log credit history:', logError);
      }
    } else {
      return { message: "Action Error: 您没有权限使用此模型。", errors: null, imageUrl: null };
    }
  }

  console.log(">>> [ACTION LOG] Attempting to generate image with inputs:", inputs);

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        prompt: inputs.prompt,
        model: selectedModel.apiId,
        image_size: `${inputs.width}x${inputs.height}`,
        batch_size: 1,
        num_inference_steps: inputs.steps,
        guidance_scale: inputs.cfg,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SiliconFlow API Error:", errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    if (!result.images || result.images.length === 0 || !result.images[0].url) {
      console.error("SiliconFlow API did not return a valid image:", result);
      throw new Error("API did not return a valid image.");
    }
    
    return {
      message: "",
      errors: null,
      imageUrl: result.images[0].url,
    };

  } catch (error) {
    console.error('[GENERATE_ACTION_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `Action Error: ${errorMessage}`,
      errors: null,
      imageUrl: null,
    };
  }
}
