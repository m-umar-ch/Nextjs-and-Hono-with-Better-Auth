"use client";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useAppForm } from "@/components/common/form/hooks";
import { authClient } from "@/auth/auth-client";
import { env } from "@/env";
import { useSearchParams } from "next/navigation";

export const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password cannot exceed 32 characters" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});
type FormData = z.infer<typeof formSchema>;

const EmailLoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // const res = await createProject(value);
      // if (res.success) {
      //   form.reset();
      //   toast.success("Project created successfully!", {
      //     description: JSON.stringify(value, null, 2),
      //     className: "whitespace-pre-wrap font-mono",
      //   });
      // } else {
      //   toast.error("Failed to create project.");
      // }
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
          {/* 
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            Login with Apple
          </Button> 
            */}
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: `${env.NEXT_PUBLIC_FRONTEND_BASE_URL}/falana`,
              })
            }
            className="cursor-pointer"
          >
            {/* prettier-ignore */}
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
               <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
               <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
               <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
               <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
               <path fill="none" d="M0 0h48v48H0z"></path>
             </svg>
            Login with Google
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <form.AppField name="email">
          {(field) => (
            <field.Input label="Email" type="email" placeHolder="Enter Email" />
          )}
        </form.AppField>

        <Field>
          <form.Field name="password">
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
                      Password
                    </FieldLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-destructive"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter Password"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </>
              );
            }}
          </form.Field>
        </Field>

        <Field>
          <Button type="submit">Login</Button>
          {/* <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription> */}
        </Field>
      </FieldGroup>
    </form>
  );
};

export default EmailLoginForm;
