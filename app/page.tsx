import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 to-green-800">
      <div className="space-y-6 text-center">
        {/* here cn is a wrapper of tailwindmerger and clx with this we can merge two tailwind classes or help resolving conflicts between two same tailwind classes or we can use it as a conditional rendring of tailwind classes of object syntax*/}
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          &#128515;/Auth
        </h1>
        <p className="text-white text-lg">A Simple authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
        <div className="border h-32 w-72 rounded-lg">
          <div>
            <b>Note</b>
            <p>
              Dont Use Credentials login while SigningIn I dont have a domain to
              enable that for public &#128557; .Now it only works for my email
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
