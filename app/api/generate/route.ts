import { NextResponse } from 'next/server';

// 注意：由于请求结构变化，我们不再使用 openai SDK，而是直接使用 fetch

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    
    // 直接使用 fetch 调用硅基流动的文生图 API
    const response = await fetch("https://api.ap.siliconflow.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell", // 使用您指定的新模型
        prompt: prompt,
        n: 1,
        // 根据文档，尺寸等参数可能由模型默认或在其他地方配置
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('[SILICONFLOW_API_ERROR_BODY]', errorBody);
        throw new Error(errorBody.message || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const imageUrl = result.images?.[0]?.url;

    if (!imageUrl) {
      console.error('[SILICONFLOW_UNEXPECTED_RESPONSE]', result);
      return NextResponse.json({ error: "Failed to parse image URL from SiliconFlow response" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('[API_ROUTE_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
} 