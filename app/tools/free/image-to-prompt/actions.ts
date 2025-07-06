"use server";

import { z } from "zod";

const imageToPromptSchema = z.object({
  imageUrl: z.string().url({ message: "请输入有效的图片URL。" }),
  language: z.string().min(1),
  promptTarget: z.string().min(1),
  sceneStyle: z.string().min(1),
  wordCount: z.coerce.number().min(10),
});

export async function imageToPromptAction(prevState: any, formData: FormData) {
  const validatedFields = imageToPromptSchema.safeParse({
    imageUrl: formData.get("imageUrl"),
    language: formData.get("language"),
    promptTarget: formData.get("promptTarget"),
    sceneStyle: formData.get("sceneStyle"),
    wordCount: formData.get("wordCount"),
  });

  if (!validatedFields.success) {
    return {
      message: "输入验证失败",
      errors: validatedFields.error.flatten().fieldErrors,
      result: null,
    };
  }

  const { imageUrl, language, promptTarget, sceneStyle, wordCount } = validatedFields.data;
  const falKey = process.env.FAL_KEY;

  if (!falKey) {
    console.error("[ACTION_ERROR] FAL_KEY environment variable not set");
    return {
      message: "服务器配置错误，无法处理请求。",
      errors: null,
      result: null,
    };
  }

  const metaPrompt = `Please act as a prompt engineering expert. Analyze the provided image in detail, paying close attention to the subject, environment, lighting, and overall mood. Based on this analysis, generate a highly descriptive, ${sceneStyle} text prompt suitable for the ${promptTarget} image generation platform. The final prompt should be in ${language} and approximately ${wordCount} words long.`;

  try {
    const response = await fetch('https://fal.run/fal-ai/llava-next', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${falKey}`,
        },
        body: JSON.stringify({
            image_url: imageUrl,
            prompt: metaPrompt,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Fal.ai API error:', errorBody);
        throw new Error(`API请求失败: ${errorBody}`);
    }

    const result = await response.json();
    const generatedPrompt = result.output;

    if (typeof generatedPrompt !== 'string') {
        throw new Error("从API返回的响应结构无效。");
    }

    return {
      message: "提示词生成成功！",
      errors: null,
      result: { prompt: generatedPrompt },
    };

  } catch (error) {
    console.error('[IMG_TO_PROMPT_ACTION_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : "发生未知错误。";
    return {
      message: `操作失败: ${errorMessage}`,
      errors: null,
      result: null,
    };
  }
} 