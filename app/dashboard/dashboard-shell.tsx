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

  return (
    <div className="flex min-h-screen">
      <Sidebar onOpenUploadModal={() => setOpenUpload(true)} />

      <main className="flex-1 p-6">{children}</main>

      <UploadQuizModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={() => {
          console.log("upload clicked");
          setOpenUpload(false);
        }}
      />
    </div>
  );
}
