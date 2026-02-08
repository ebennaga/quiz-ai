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

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError("");

      console.log("Uploading file:", file.name, file.type, file.size);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/quiz/upload", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || data.details || "Upload gagal");
      }

      console.log("PDF processed successfully:", data);

      // 👉 Optional: redirect ke halaman quiz
      // if (data.quizId) {
      //   router.push(`/quiz/${data.quizId}`);
      // }

      alert("PDF berhasil diproses!");
      setOpenUpload(false);
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMsg = err.message || "Gagal memproses file";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenUploadModal={() => setOpenUpload(true)} />

      <main className="flex-1 p-6">{children}</main>

      <UploadQuizModal
        open={openUpload}
        onClose={() => {
          setOpenUpload(false);
          setError("");
        }}
        onUpload={handleUpload}
        loading={loading}
      />
    </div>
  );
}
