import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, language, promptTarget, sceneStyle, wordCount } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // 构建元提示词
    const metaPrompt = `Please act as a prompt engineering expert. Analyze the provided image in detail, paying close attention to the subject, environment, lighting, and overall mood. Based on this analysis, generate a highly descriptive, ${sceneStyle} text prompt suitable for the ${promptTarget} image generation platform. The final prompt should be in ${language} and approximately ${wordCount} words long.`;

    const response = await fetch('https://fal.run/fal-ai/llava-next', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: metaPrompt,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Fal.ai API error:', errorBody);
      return NextResponse.json({ error: 'Failed to generate prompt from fal.ai', details: errorBody }, { status: response.status });
    }

    const result = await response.json();

    // LLaVA模型通常在 output 字段中直接返回一个字符串
    const generatedPrompt = result.output;

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error in image-to-prompt API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
} 