"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/dashboard");
};

export const signUp = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = await headers().get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return {
      message: "Could not authenticate user",
    };
  }

  return {
    message: "Check email to continue sign in process",
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

// ------------------- 文生图 Server Action -------------------

export async function generateImageAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Action Error: 请先登录后再进行操作。",
      errors: null,
      imageUrls: null,
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  const validatedFields = generateSchema.safeParse({
    prompt: formData.get("prompt"),
    width: Number(formData.get("width")),
    height: Number(formData.get("height")),
    steps: Number(formData.get("steps")),
    cfg: Number(formData.get("cfg")),
  });

  const rawInputs = Object.fromEntries(formData.entries());

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
      imageUrls: null,
      inputs: rawInputs,
    };
  }
  
  const inputs = validatedFields.data;

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICON_FLOW_API_KEY}`
      },
      body: JSON.stringify({
        prompt: inputs.prompt,
        n: 4,
        model: "black-forest-labs/FLUX.1-schnell",
        width: inputs.width,
        height: inputs.height,
        num_inference_steps: inputs.steps,
        guidance_scale: inputs.cfg,
        response_format: "b64_json",
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("SiliconFlow API Error:", errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const imageUrls = result.data.map((image: { b64_json: string; }) => `data:image/jpeg;base64,${image.b64_json}`);
    
    return {
      message: "",
      errors: null,
      imageUrls: imageUrls,
      inputs: inputs,
    };

  } catch (error) {
    console.error('[GENERATE_ACTION_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      message: `Action Error: ${errorMessage}`,
      errors: null,
      imageUrls: null,
      inputs: inputs,
    };
  }
}
