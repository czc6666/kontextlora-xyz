import { signIn } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

type SignInPageProps = {
  searchParams: {
    message: string;
  };
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  const signInWithGoogle = async () => {
    "use server";
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return encodedRedirect("error", "/sign-in", error.message);
    }

    if (data.url) {
      return redirect(data.url);
    }
  };

  const signInWithGitHub = async () => {
    "use server";
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return encodedRedirect("error", "/sign-in", error.message);
    }

    if (data.url) {
      return redirect(data.url);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <div className="grid gap-6">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {searchParams?.message && (
            <div className="p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <p>{searchParams.message}</p>
            </div>
          )}
          <SubmitButton
            className="w-full"
            pendingText="Signing in..."
            formAction={signIn}
          >
            Sign in
          </SubmitButton>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <form action={signInWithGoogle}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </form>
          <form action={signInWithGitHub}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.475 2 2 6.475 2 12c0 4.419 2.862 8.169 6.838 9.494.5.094.687-.219.687-.488 0-.244-.009-.887-.016-1.744-2.781.606-3.369-1.344-3.369-1.344-.456-1.156-1.112-1.463-1.112-1.463-.906-.619.069-.606.069-.606 1.006.075 1.538 1.031 1.538 1.031.894 1.531 2.344 1.087 2.913.831.094-.644.35-1.087.637-1.337-2.225-.25-4.556-1.112-4.556-4.944 0-1.094.394-1.987 1.038-2.687-.1-.25-.45-1.275.1-2.65 0 0 .844-.269 2.75 1.025A9.63 9.63 0 0112 6.813c.85.009 1.706.119 2.513.35 1.9-1.294 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.644.7 1.038 1.594 1.038 2.687 0 3.844-2.337 4.688-4.563 4.938.363.306.688.925.688 1.862 0 1.344-.013 2.438-.013 2.763 0 .269.187.587.687.487C19.137 20.169 22 16.419 22 12c0-5.525-4.475-10-10-10z"
                />
              </svg>
              Sign in with Github
            </Button>
          </form>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
}
