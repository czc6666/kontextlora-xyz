"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { fal } from '@fal-ai/client';
import { z } from "zod";
import { FAL_MODELS } from '@/config/models';

const falSchema = z.object({
  prompt: z.string().min(1),
  image_size: z.string(),
  model: z.string(),
});

export async function getUserStatus() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Action Error: Please log in to generate images.",
      errors: null,
      imageUrls: null,
    };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .in("status", ["trialing", "active"])
    .single();

  if (!subscription) {
    return {
      message: "Action Error: You must be a Pro user to generate images.",
      errors: null,
      imageUrls: null,
    };
  }

  const validatedFields = falSchema.safeParse({
    prompt: formData.get("prompt"),
    image_size: formData.get("image_size"),
    model: formData.get("model"),
  });
  
  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
      imageUrls: null,
    };
  }
  
  const { prompt, image_size, model: modelId } = validatedFields.data;
  
  if (!FAL_MODELS[modelId as keyof typeof FAL_MODELS]) {
      return { message: "Invalid model selected.", errors: null, imageUrls: null };
  }
  
  try {
    const result: any = await fal.subscribe(modelId, {
      input: {
        prompt,
        image_size,
      },
      logs: true,
    });

    if (!result?.data?.images) {
      console.error('[FAL_API_ERROR] API response did not contain images:', result);
      return {
          message: `API Error: The API response from fal.ai was malformed.`,
          errors: null,
          imageUrls: null,
      };
    }

    const imageUrls = result.data.images
      .map((image: { url: string }) => image.url)
      .filter(Boolean);

    if (imageUrls.length === 0) {
      return {
        message: "API Error: Generation was successful but returned no valid images.",
        errors: null,
        imageUrls: null,
      };
    }

    return {
      message: "Success",
      errors: null,
      imageUrls,
    };
    
  } catch (error: any) {
    console.error('[FAL_API_ERROR]', error);
    return {
      message: `API Error: ${error.message || 'Failed to generate image.'}`,
      errors: null,
      imageUrls: null,
    };
  }
}
