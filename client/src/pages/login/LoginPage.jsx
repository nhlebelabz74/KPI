import { LoginForm } from "@/components/login-form";

import logo_light from "/logo-light.png";
import logo_dark from "/logo-dark.png";
import background from "/background.jpg";

export default function LoginPage() {
  return (
    (<div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src={logo_light} alt="logo-light" className="w-60 h-55 mt-[-50px] mb-[-35px] dark:hidden" />
            <img src={logo_dark} alt="logo-dark" className="w-60 h-55 mt-[-50px] mb-[-35px] hidden dark:block" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={background}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:grayscale" />
      </div>
    </div>)
  );
}