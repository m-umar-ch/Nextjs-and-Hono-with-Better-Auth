"use client";
import { cn } from "@/lib/utils/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import EmailLoginForm from "./email-login-form";
import SingInWithGoogle from "./SignInWithGoogle";
import { useState } from "react";

export function AuthCard({ className, ...props }: React.ComponentProps<"div">) {
  const [isOTPView, setIsOTPView] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {!isOTPView ? "Welcome back" : "Check You Email for OTP"}
          </CardTitle>
          <CardDescription>
            {!isOTPView
              ? "Login with your Google account"
              : "Or Continue With Google"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <SingInWithGoogle />
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              {!isOTPView ? "Or continue with" : "Enter OTP"}
            </FieldSeparator>

            {/* form */}
            <EmailLoginForm isOTPView={isOTPView} setIsOTPView={setIsOTPView} />
          </FieldGroup>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
