"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "default" | "ghost";
  className?: string;
  label?: string;
};

export default function GoogleLoginButton({
  variant = "default",
  className = "",
  label = "Start for Free",
}: Props) {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={signInWithGoogle} variant={variant} className={className}>
      {label}
    </Button>
  );
}
