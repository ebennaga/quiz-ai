'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finishLogin = async () => {
      const code = searchParams.get('code');

      if (!code) {
        router.replace('/auth');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error(error);
        router.replace('/auth');
        return;
      }

      router.replace('/dashboard');
    };

    finishLogin();
  }, [router, searchParams]);

  return <p>Signing you in...</p>;
}
