"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import UploadQuizModal from "@/components/ui/upload-kuis-modal";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadDone(false);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/quiz/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload gagal");
      }

      setDocumentId(data.documentId);
      setUploadDone(true); // 🔥 INI KUNCI
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

      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          mcq: 5,
          essay: 2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal generate quiz");
      }

      console.log("Quiz generated:", data);

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
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      // router.push(`/quiz/${data.quizId}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenUploadModal={() => setOpenUpload(true)} />

      <main className="flex-1 p-6">{children}</main>
      {/* {uploadDone && (
        <div className="mt-4">
          <button
            onClick={handleGenerateQuiz}
            disabled={generating}
            className="rounded bg-orange-500 px-4 py-2 text-white"
          >
            {generating ? "Generating quiz..." : "Continue"}
          </button>
        </div>
      )} */}

      <UploadQuizModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={handleUpload}
        onContinue={handleContinue}
        loading={loading}
        uploadDone={uploadDone}
      />
    </div>
  );
}
