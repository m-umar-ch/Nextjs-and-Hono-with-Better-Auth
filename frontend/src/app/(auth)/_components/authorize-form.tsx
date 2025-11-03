"use client";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useAppForm } from "@/components/common/form/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/auth/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { delayIfDev } from "@/lib/utils/development-delay";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

export const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
type FormData = z.infer<typeof formSchema>;

const AuthorizeForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const safeCallback = callback && callback.startsWith("/") ? callback : "/";
  const router = useRouter();

  const VerifyOTP = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      await delayIfDev(2000);
      return await authClient.signIn.emailOtp({ email, otp });
    },
    onSuccess() {
      router.push(`/authorize?callback=${safeCallback}`);
    },
    onError(error) {
      toast.error(error?.message || "Something Went Wrong");
      toast.info("Try Login With Google");
    },
  });

  const form = useAppForm({
    defaultValues: {
      otp: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      VerifyOTP.mutate({ email: "da", otp: value.otp });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className={cn(className)}
      {...props}
    >
      <FieldGroup>
        <Field>
          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <>
                  <div className="flex items-center">
                    <FieldLabel
                      htmlFor={field.name}
                      className={cn(isInvalid && "text-red-500")}
                    >
                      One-Time Password
                    </FieldLabel>
                    <Link
                      href={`/signin?callback=${safeCallback}`}
                      className="ml-auto text-sm underline-offset-4 hover:underline text-destructive"
                    >
                      Resend OTP
                    </Link>
                  </div>

                  <InputOTP
                    maxLength={6}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e)}
                    placeholder="Enter Password"
                    aria-invalid={isInvalid}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-14" />
                      <InputOTPSlot index={1} className="w-14" />
                      <InputOTPSlot index={2} className="w-14" />
                      <InputOTPSlot index={3} className="w-14" />
                      <InputOTPSlot index={4} className="w-14" />
                      <InputOTPSlot index={5} className="w-14" />
                    </InputOTPGroup>
                  </InputOTP>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </>
              );
            }}
          </form.Field>
        </Field>

        <Field>
          <Button
            type="submit"
            disabled={VerifyOTP.isPending}
            className="cursor-pointer"
          >
            {VerifyOTP.isPending && <Spinner />} Verify OTP
          </Button>
          {/* <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription> */}
        </Field>
      </FieldGroup>
    </form>
  );
};

export default AuthorizeForm;
