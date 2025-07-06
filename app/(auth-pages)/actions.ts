"use server";

import { createClient } from "@/utils/supabase/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpWithEmailAndPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  callbackUrl: z.string().optional(),
});

const signInWithEmailAndPasswordSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    callbackUrl: z.string().optional(),
});

const sendPasswordResetEmailSchema = z.object({
    email: z.string().email(),
});

const updateUserPasswordSchema = z.object({
    password: z.string().min(6),
});

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

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
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
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
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
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
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
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
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  await supabase.auth.signOut();
  return redirect("/");
};

export async function forgotPasswordAction(prevState: any, formData: FormData) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
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

export async function signUpWithEmailAndPassword(
  values: z.infer<typeof signUpWithEmailAndPasswordSchema>
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: values.callbackUrl ?? `${location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing up:', error);
    return {
      error: error.message,
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (signInError) {
    return {
      error: signInError.message,
    };
  }

  return redirect(values.callbackUrl ?? "/");
}

export async function signInWithEmailAndPassword(
  values: z.infer<typeof signInWithEmailAndPasswordSchema>
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return {
      error: error.message,
    };
  }

  return redirect(values.callbackUrl ?? "/");
}

export async function continueWithGoogle(provider: "google") {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return redirect(`/sign-in?message=${error.message}&type=error`);
  }

  return redirect(data.url);
}

export async function continueWithGithub(provider: "github") {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in with GitHub:', error);
    return redirect(`/sign-in?message=${error.message}&type=error`);
  }

  return redirect(data.url);
}

export async function sendPasswordResetEmail(
  values: z.infer<typeof sendPasswordResetEmailSchema>
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo: `${location.origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    return {
      error: error.message,
    };
  }

  return redirect("/sign-in?message=Password reset email sent. Check your inbox.");
}

export async function updateUserPassword(
  values: z.infer<typeof updateUserPasswordSchema>
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  });

  if (error) {
    console.error('Error updating password:', error);
    return {
      error: error.message,
    };
  }

  return redirect('/dashboard');
} 