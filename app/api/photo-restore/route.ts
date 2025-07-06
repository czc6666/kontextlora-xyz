"use server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, aspectRatio } = await req.json();

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

    const requestBody: { image_url: string; aspect_ratio?: string } = {
      image_url: imageUrl,
    };

    if (aspectRatio) {
      requestBody.aspect_ratio = aspectRatio;
    }

    console.log(">>> [API_PROXY] Calling fal.ai with body:", requestBody);

    const response = await fetch(
      "https://fal.run/fal-ai/image-editing/photo-restoration",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify(requestBody),
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
    
    console.log(">>> [API_PROXY] Successfully received response from fal.ai.");
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("[PHOTO_RESTORE_API_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 