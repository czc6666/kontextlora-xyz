"use client";

import Image from "next/image";

const images = [
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/4.webp",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_28_55.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_28_57.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_30_00.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_30_47.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_33_59.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_35_20.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_35_42.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_57_35.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_58_10.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_59_00.png",
  "https://pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev/ChatGPT%20Image%202025%E5%B9%B47%E6%9C%883%E6%97%A5%2017_59_01.png",
];

export default function ScrollingGallery() {
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex animate-scroll group-hover:pause">
        {duplicatedImages.map((src, index) => (
          <div key={index} className="relative w-64 h-64 flex-shrink-0 mx-2">
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
} 