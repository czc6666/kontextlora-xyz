"use server";

import { NextResponse } from "next/server";

const CAPTION_PROMPT = "Generate a short, descriptive caption for this image.";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json(
        { error: "FAL_KEY environment variable not set" },
        { status: 500 }
      );
    }

    console.log(">>> [API_PROXY] Calling fal.ai for image captioning...");

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
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    if (typeof result.output !== 'string') {
        console.error("fal.ai API did not return a valid output string:", result);
        return NextResponse.json({ error: "Invalid response structure from API." }, { status: 500 });
    }

    console.log(">>> [API_PROXY] Successfully received response from fal.ai.");
    return NextResponse.json({ caption: result.output });

  } catch (error) {
    console.error("[IMAGE_TO_CAPTION_API_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 