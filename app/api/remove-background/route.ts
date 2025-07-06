"use server";

import { NextResponse } from "next/server";

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

    console.log(">>> [API_PROXY] Calling fal.ai for background removal...");
    
    // Note the different endpoint for this model
    const response = await fetch(
      "https://fal.run/smoretalk-ai/rembg-enhance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({
          image_url: imageUrl,
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
    
    // According to the docs, the result is in result.image.url
    if (!result.image || !result.image.url) {
        console.error("fal.ai API did not return a valid image object:", result);
        return NextResponse.json({ error: "Invalid response structure from API." }, { status: 500 });
    }

    console.log(">>> [API_PROXY] Successfully received response from fal.ai.");
    return NextResponse.json({ imageUrl: result.image.url });

  } catch (error) {
    console.error("[REMOVE_BG_API_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 