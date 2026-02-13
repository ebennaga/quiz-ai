'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/ui/sidebar';
import UploadQuizModal from '@/components/ui/upload-kuis-modal';
import { supabase } from '@/lib/supabase/client';

import { useRouter } from 'next/navigation';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (uploading) return;
    try {
      setUploading(true);
      setUploadDone(false);
      setError('');
      // 🔥 Ambil user login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User belum login');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const res = await fetch('/api/quiz/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      setDocumentId(data.documentId);
      setUploadDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!documentId) return;

    try {
      setGenerating(true);

      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          mcq: 5,
          essay: 2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal generate quiz');
      }

      // 👉 redirect / render quiz
      // router.push(`/quiz/${data.quizId}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleContinue = async () => {
    if (!documentId) return;

    try {
      setGenerating(true);
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          mcq: 5,
          essay: 2,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setOpenUpload(false);

      // optional redirect
      router.push(`/quiz/${data.quizId}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const checkUserDocument = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch(`/api/quiz/check-upload?userId=${user.id}`);

      const data = await res.json();

      if (!data.hasDocument) {
        setOpenUpload(true);
      }
    };

    checkUserDocument();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenUploadModal={() => setOpenUpload(true)} />

      <main className="flex-1 p-6">{children}</main>

      <UploadQuizModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={handleUpload}
        onContinue={handleContinue}
        loading={loading}
        uploadLoading={uploading}
        generateLoading={generating}
        uploadDone={uploadDone}
      />
    </div>
  );
}
