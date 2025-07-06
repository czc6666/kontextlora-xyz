import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ImageGeneratorClient } from "./client";
import { generateImageAction, getUserStatus } from "./actions";

export default async function ImageGeneratorPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { isPro, credits } = await getUserStatus();

  return (
    <ImageGeneratorClient
      user={user}
      generateImageAction={generateImageAction}
      initialIsPro={isPro}
      initialCredits={credits}
    />
  );
}
