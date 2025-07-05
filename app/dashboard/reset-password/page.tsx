"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/(auth-pages)/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  message: "",
  type: undefined as "error" | "success" | undefined,
};

export default function ResetPassword() {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);
  
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4" action={formAction}>
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton>
        Reset password
      </SubmitButton>
      <FormMessage message={state.message} type={state.type} />
    </form>
  );
}
