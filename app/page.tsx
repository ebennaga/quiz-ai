import GoogleLoginButton from "@/components/auth/google-login-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Sparkles, Brain, BarChart3 } from "lucide-react";

export default function Home() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">QuizGen</div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#" className="hover:text-indigo-600">
              How it works
            </a>
            <a href="#" className="hover:text-indigo-600">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <GoogleLoginButton
              variant="ghost"
              className="hidden sm:inline-flex"
              label="Login"
            />
            <Button className="rounded-xl px-5">Start for Free</Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Kuis Generator <span className="text-indigo-600">Interaktif</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Ubah materi belajarmu menjadi sesuatu yang benar-benar ingin kamu
          pelajari. Dapatkan 100+ kuis ujian, flashcard, dan rencana belajar
          untuk menaklukkan ujianmu berikutnya 💪📚
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button className="rounded-2xl px-8 py-4 text-base">
            Mulai Buat Kuis
          </Button>
          <Button variant="outline" className="rounded-2xl px-8 py-4 text-base">
            Lihat Demo
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          Cara Kerja AI Quiz Generator
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-indigo-600" />
              <h3 className="mt-6 text-xl font-semibold">
                Upload Materi (PDF)
              </h3>
              <p className="mt-3 text-gray-600">
                Upload file PDF berisi materi belajar atau catatan yang ingin
                dijadikan kuis.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center">
              <Brain className="mx-auto h-10 w-10 text-indigo-600" />
              <h3 className="mt-6 text-xl font-semibold">
                Generate Otomatis dengan AI
              </h3>
              <p className="mt-3 text-gray-600">
                AI menganalisis materi PDF lalu menghasilkan soal kuis dan
                jawaban secara otomatis.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-indigo-600" />
              <h3 className="mt-6 text-xl font-semibold">Kuis Dimulai</h3>
              <p className="mt-3 text-gray-600">
                Mulai kerjakan kuis secara langsung dan uji pemahamanmu dari
                materi yang diupload.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Siap Membuat Kuis Pertamamu?
          </h2>
          <p className="mt-4 text-indigo-100 max-w-xl mx-auto">
            Mulai sekarang dan buat pengalaman interaktif yang menarik untuk
            audiensmu.
          </p>
          <Button className="mt-8 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl px-8 py-4">
            Mulai Gratis
          </Button>
        </div>
      </section>
    </main>
  );
}
