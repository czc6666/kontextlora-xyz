"use server";

import { z } from "zod";

const imageToCaptionSchema = z.object({
  imageUrl: z.string().url({ message: "请输入有效的图片URL。" }),
});

const CAPTION_PROMPT = "Generate a short, descriptive caption for this image.";

export async function imageToCaptionAction(prevState: any, formData: FormData) {
  const validatedFields = imageToCaptionSchema.safeParse({
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
    console.log(">>> [IMG_TO_CAPTION_ACTION] Calling fal.ai for captioning...");

    const response = await fetch(
      "https://fal.run/fal-ai/llava-next",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: CAPTION_PROMPT,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai API Error:", errorText);
      throw new Error(`API请求失败: ${errorText}`);
    }

    const result = await response.json();

    if (typeof result.output !== 'string') {
      console.error("fal.ai API did not return a valid output string:", result);
      throw new Error("从API返回的响应结构无效。");
    }
    
    console.log(">>> [IMG_TO_CAPTION_ACTION] Successfully received response from fal.ai.");
    
    return {
      message: "图片描述生成成功！",
      errors: null,
      result: { caption: result.output },
    };

  } catch (error) {
    console.error("[IMG_TO_CAPTION_ACTION_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "发生未知错误。";
    return {
      message: `操作失败: ${errorMessage}`,
      errors: null,
      result: null,
    };
  }
} 