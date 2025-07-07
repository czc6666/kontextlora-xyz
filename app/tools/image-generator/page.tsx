import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ImageGeneratorClient } from "./client";
import { getUserStatus } from "./actions";

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
      initialIsPro={isPro}
      initialCredits={credits}
    />
  );
}
