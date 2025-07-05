"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user&type=error");
  }

  return redirect("/dashboard");
};

export const signUp = async (prevState: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return {
      message: "Could not authenticate user",
    };
  }

  return {
    message: "Check email to continue sign in process",
    type: "success",
  };
};

export const signUpWithGoogle = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/sign-up?message=${error.message}&type=error`);
  }

  return redirect(data.url);
};

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/sign-in?message=${error.message}&type=error`);
  }

  return redirect(data.url);
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export async function forgotPasswordAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get('origin');
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/dashboard/reset-password`,
    });

    if (error) {
        console.error('Error sending password reset email:', error);
        return {
            message: 'Error: Could not send password reset email.',
        };
    }

    return {
        message: 'Password reset email sent. Check your inbox.',
    };
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        console.error('Error updating password:', error);
        return {
            message: 'Error: Could not update password.',
        };
    }

    return redirect('/dashboard');
} 