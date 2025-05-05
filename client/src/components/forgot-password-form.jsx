import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import request from "@/utils/request";
import { SHA256 } from "crypto-js";
import { toast } from "sonner";

// Zod schema for form validation
const formSchema = z.object({
  code: z
    .string()
    .length(8, "Verification code must be exactly 8 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Hide default password eye icons
const hideDefaultPasswordEye = `
  input[type="password"]::-ms-reveal,
  input[type="password"]::-ms-clear {
    display: none;
  }
  input[type="password"]::-webkit-contacts-auto-fill-button,
  input[type="password"]::-webkit-credentials-auto-fill-button {
    display: none;
  }
`;

const ForgotPasswordForm = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const navigate = useNavigate();
  const { email: encryptedEmail } = useParams(); // Get the encrypted email from URL params

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const emailParam = decodeURIComponent(encryptedEmail);
      
      // Encrypt the new password
      const encryptedPassword = SHA256(values.password).toString();

      await request({
        route: "/auth/reset-password",
        type: "POST",
        body: {
          email: emailParam, // Already encrypted from previous step
          code: values.code,
          password: encryptedPassword,
        },
      });

      toast.success("Password reset successful!");
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.message || "Password reset failed. Please check your code and try again."
      );
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle success dialog countdown
  useEffect(() => {
    let timer;
    if (successDialogOpen && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [successDialogOpen, redirectCountdown]);

  // Handle redirect when countdown completes
  useEffect(() => {
    if (redirectCountdown === 0) {
      navigate("/");
    }
  }, [redirectCountdown]);

  const resendVerificationCode = async () => {
    try {
      setIsLoading(true);
      const emailParam = decodeURIComponent(encryptedEmail);

      await request({
        type: 'POST',
        route: '/auth/send-reset-password-code',
        body: {
          email: emailParam, // Already encrypted
        }
      });

      toast.success("Verification code sent successfully", {
        description: "Check your inbox for the new code"
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.message || "Failed to resend verification code.");
      setErrorDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{hideDefaultPasswordEye}</style>

      {/* Loading Modal */}
      <Dialog open={isLoading}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Processing...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600">
              Password Reset Successful!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your password has been reset. You will be redirected to the login page in {redirectCountdown} seconds...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/")}
              >
                Go to Login Page Now
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Something went wrong
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter the 8-digit verification code sent to your email, then create a new password
            </p>
          </div>

          <div className="grid gap-6">
            {/* Verification Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Verification Code</FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center justify-between">
                      <InputOTP
                        maxLength={8}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>

                      <Button
                        variant="outline"
                        className="text-xs text-primary hover:text-primary/90 h-10 w-30 cursor-pointer"
                        onClick={resendVerificationCode}
                        disabled={isLoading}
                      >
                        Resend Code
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters and include uppercase, lowercase, 
                    number, and special character.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing..." : "Reset Password"}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Button
                variant="link"
                className="text-sm font-medium cursor-pointer"
                onClick={() => navigate("/")}
              >
                Return to Login
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export { ForgotPasswordForm };