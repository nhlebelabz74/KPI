// TODO: add forgot password function
// TODO: add terms of service and privacy policy links
// TODO: add alert for incorrect email or password

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";

import logo_light from "/logo-light.png";
import logo_dark from "/logo-dark.png";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { dummyData } from "@/constants";

const formSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .refine(value => value.endsWith("@gmail.com"), {
      message: "Email must end with @gmail.com",
    }),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = ({ 
  className, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    const valid = values.email === dummyData.email && 
                 values.password === dummyData.password;

    console.log(valid);
    console.log("form vals: ", values);
    console.log("dummy vals: ", dummyData);
    
    setIsValid(valid);
    setShowAlert(true);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <img src={logo_light} alt="logo-light" className="w-60 h-60 mb-[-80px] dark:hidden" />
              <img src={logo_dark} alt="logo-dark" className="w-60 h-60 mb-[-80px] hidden dark:block" />
            </div>

            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-sm underline-offset-4 hover:underline hover:text-primary/90"
                      >
                        Forgot your password?
                      </a>
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
                          <EyeOff className="h-4 w-4 text-primary dark:text-muted-foreground" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4 text-primary dark:text-muted-foreground" aria-hidden="true" />
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

              <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isValid ? "Welcome! :)" : "Something went wrong :("}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {isValid 
                        ? "You have successfully logged in!" 
                        : "Incorrect email or password. Please try again."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => {
                        if (isValid) {
                          navigate(`/home/${form.getValues("email")}/home`);
                        }
                      }}
                    >
                      Ok
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

export { LoginForm };