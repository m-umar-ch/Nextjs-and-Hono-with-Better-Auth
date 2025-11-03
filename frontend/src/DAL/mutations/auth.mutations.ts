import { authClient } from "@/auth/auth-client";

async function signinWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await authClient.emailOtp.sendVerificationOtp({
    email: "fads",
    type: "sign-in",
  });
}
