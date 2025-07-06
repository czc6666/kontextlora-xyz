"use server";

import { z } from "zod";

const photoRestoreSchema = z.object({
  imageUrl: z.string().url({ message: "请输入有效的图片URL。" }),
});

export async function restorePhotoAction(prevState: any, formData: FormData) {
  const validatedFields = photoRestoreSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
  });

  if (!validatedFields.success) {
    return {
      message: "输入验证失败",
      errors: validatedFields.error.flatten().fieldErrors,
      result: null,
    };
  }

  const { imageUrl } = validatedFields.data;
  const falKey = process.env.FAL_KEY;

  if (!falKey) {
    console.error("[ACTION_ERROR] FAL_KEY environment variable not set");
    return {
      message: "服务器配置错误，无法处理请求。",
      errors: null,
      result: null,
    };
  }

  try {
    console.log(">>> [RESTORE_ACTION] Calling fal.ai with image URL:", imageUrl);

    const response = await fetch(
      "https://fal.run/fal-ai/image-editing/photo-restoration",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({ image_url: imageUrl }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai API Error:", errorText);
      throw new Error(`API请求失败: ${errorText}`);
    }

    const result = await response.json();
    console.log(">>> [RESTORE_ACTION] Successfully received response from fal.ai.");
    
    return {
      message: "图片修复成功！",
      errors: null,
      result,
    };

  } catch (error) {
    console.error("[RESTORE_ACTION_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "发生未知错误。";
    return {
      message: `操作失败: ${errorMessage}`,
      errors: null,
      result: null,
    };
  }
} 