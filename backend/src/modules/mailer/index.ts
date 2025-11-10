export {
  type EmailOptions,
  type EmailResponse,
  sendEmail,
  sendEmailVerificationEmail,
  sendEmailVerificationOTP,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendPasswordResetOTP,
  sendSigninOTP,
  sendWelcomeEmail,
} from "./service/mailer.service";

export {
  type EmailVerificationEmailData,
  type EmailVerificationOTPData,
  emailVerificationEmailTemplate,
  emailVerificationOTPTemplate,
  type OrderConfirmationEmailData,
  orderConfirmationEmailTemplate,
  type PasswordResetEmailData,
  type PasswordResetOTPData,
  passwordResetEmailTemplate,
  passwordResetOTPTemplate,
  type SigninOTPData,
  signinOTPTemplate,
  type WelcomeEmailData,
  welcomeEmailTemplate,
} from "./templates";
