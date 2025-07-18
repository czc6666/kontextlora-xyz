"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "../actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const initialState = {
  message: "",
  type: undefined as "error" | "success" | undefined,
};

export default function ForgotPassword() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>
      <div className="grid gap-6">
        <form className="grid gap-4" action={formAction}>
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
          <SubmitButton
            className="w-full"
            pendingText="Sending reset link..."
          >
            Send reset link
          </SubmitButton>
          <FormMessage message={state.message} type={state.type} />
        </form>
        <div className="text-sm text-muted-foreground text-center">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
