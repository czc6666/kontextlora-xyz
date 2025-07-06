import { createClient } from "@/utils/supabase/server";
import HeaderClient from "./header-client";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let credits = 0;
  if (user) {
    const { data } = await supabase
      .from("customers")
      .select("credits")
      .eq("id", user.id)
      .single();
    credits = data?.credits || 0;
  }

  return <HeaderClient user={user} credits={credits} />;
} 