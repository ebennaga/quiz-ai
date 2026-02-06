"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold sm:text-2xl">Login ke Kuis</h1>
          <p className="text-sm text-muted-foreground">
            Masuk menggunakan akun Google
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={signInWithGoogle}
            className="w-full text-sm sm:text-base"
            size="lg"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
