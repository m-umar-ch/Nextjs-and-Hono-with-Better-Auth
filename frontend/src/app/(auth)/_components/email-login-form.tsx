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
import { authClient } from "@/auth/auth-client/server";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { delayIfDev } from "@/lib/utils/development-delay";
import { Dispatch, SetStateAction, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { env } from "@/env";

export const formSchema = z.object({
  email: z.email(),
  otp: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

const EmailLoginForm = ({
  className,
  isOTPView,
  setIsOTPView,
  ...props
}: React.ComponentProps<"form"> & {
  isOTPView: string | null;
  setIsOTPView: Dispatch<SetStateAction<string | null>>;
}) => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const safeCallback = callback && callback.startsWith("/") ? callback : "/";
  const router = useRouter();

  const SignInWithEmail = useMutation({
    mutationFn: async (email: string) => {
      await delayIfDev(2000);
      return await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
    },
  });

  const VerifyOTP = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      await delayIfDev(2000);
      return await authClient.signIn.emailOtp({ email, otp });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      otp: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isOTPView) {
        SignInWithEmail.mutate(value.email, {
          onSuccess() {
            setIsOTPView(value.email);
          },
          onError(error) {
            toast.error(error?.message || "Something Went Wrong");
            toast.info("Try Login With Google");
          },
        });
      } else {
        if (!value.otp || value.otp.length < 6) {
          form.setErrorMap({
            onSubmit: {
              fields: {
                otp: {
                  message: "Your one-time password must be 6 characters.",
                },
              },
            },
          });
        } else {
          VerifyOTP.mutate(
            { email: value.email, otp: value.otp },
            {
              onSuccess() {
                toast.success(`Successfully Logged In as ${value.email}`);
                router.push(
                  `${env.NEXT_PUBLIC_FRONTEND_BASE_URL}${safeCallback}` as never,
                );
              },
              onError(error) {
                toast.error(error?.message || "Something Went Wrong");
                toast.info("Try Login With Google");
              },
            },
          );
        }
      }
    },
  });

  if (isOTPView)
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
                      <p
                        className="text-destructive ml-auto cursor-pointer text-sm underline-offset-4 hover:underline"
                        onClick={() => setIsOTPView(null)}
                      >
                        Resend OTP
                      </p>
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

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
          </Field>
        </FieldGroup>
      </form>
    );

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
        <form.AppField name="email">
          {(field) => (
            <field.Input label="Email" type="email" placeHolder="Enter Email" />
          )}
        </form.AppField>

        <Field>
          <Button
            type="submit"
            disabled={SignInWithEmail.isPending}
            className="cursor-pointer"
          >
            {SignInWithEmail.isPending && <Spinner />} Send OTP
          </Button>
          {/* <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription> */}
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EmailLoginForm;
