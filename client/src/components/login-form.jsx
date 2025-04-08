import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
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
  DialogHeader,
  DialogContent, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import request from "@/utils/request";
import { SHA256, AES } from "crypto-js"; // Added AES encryption
import { useAuth } from '@/context/authContext';
import { toast } from "sonner";

// Zod schema for form validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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

const LoginForm = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");

  const handleResetPasswordEmailOnChange = (e) => {
    setResetPasswordEmail(e.target.value);
  }

  const sendResetPasswordLink = async () => {
    // try to send the email
    setErrorMessage("Functionality does not exist yet");
    setErrorDialogOpen(true);
    // try {
    //   await request({
    //     type: 'POST',
    //     route: '/auth/forgot-password',
    //     body: {
    //       email: resetPasswordEmail
    //     }
    //   });

    //   toast("Email sent successfully", {
    //     description: "Check your inbox and click on the link"
    //   });

    //   navigate(`/reset-password/:${resetPasswordEmail}`);
    // }
    // catch (error) {
    //   console.error(error);

    //   setErrorMessage(error?.message || "Something went wrong when we tried to email you");
    //   setErrorDialogOpen(true);
    // }
  }

  const navigate = useNavigate();
  const { login } = useAuth();

  // Encryption secret key (store in .env in production)
  const SECRET_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY || "default-secret-key";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      // const encryptedPassword = SHA256(values.password).toString();

      const response = await request({
        route: "/auth/login",
        type: "POST",
        body: {
          email: values.email,
          password: values.password // encryptedPassword,
        },
      });

      // Store email securely before showing success dialog
      const encryptedEmail = AES.encrypt(values.email, SECRET_KEY).toString();
      localStorage.setItem("user-position", response.data.user.position);
      login(encryptedEmail, response.data.accessToken);
      
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.message || "Login failed. Please check your credentials."
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
      navigate("/home");
    }
  }, [redirectCountdown]);

  return (
    <>
      <style>{hideDefaultPasswordEye}</style>

      {/* Loading Modal */}
      <Dialog open={isLoading}>
        <DialogTitle className="sr-only">Log In</DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Signing in...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Alert Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600">
              Login Successful!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You're being redirected to your home page in {redirectCountdown} seconds...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate("/home")}
              >
                Go to Home Page Now
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

      {/* Login Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="grid gap-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <p className="ml-auto text-sm underline-offset-4 hover:underline hover:text-primary/90 cursor-pointer">
                          Forgot your password?
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Password Reset</DialogTitle>
                          <DialogDescription>
                            Enter your email so we can send you a password reset link.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex flex-row gap-4 items-center">
                            <Label htmlFor="email" className="">
                              Email
                            </Label>
                            <Input 
                              id="name"
                              value={resetPasswordEmail}
                              onChange={handleResetPasswordEmailOnChange}
                              placeholder="m@example.com" 
                              className="w-full" 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={sendResetPasswordLink}>Send link</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
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
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export { LoginForm };