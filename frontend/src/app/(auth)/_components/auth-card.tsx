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
import { AuthPageType } from "../types";
import SingInWithGoogle from "./SignInWithGoogle";
import AuthorizeForm from "./authorize-form";

export function AuthCard({
  className,
  type,
  ...props
}: React.ComponentProps<"div"> & AuthPageType) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {type === "login" ? "Welcome back" : "Check You Email for OTP"}
          </CardTitle>
          <CardDescription>
            {type === "login"
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
              {type === "login" ? "Or continue with" : "Enter OTP"}
            </FieldSeparator>

            {/* form */}
            {type === "login" ? <EmailLoginForm /> : <AuthorizeForm />}
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
