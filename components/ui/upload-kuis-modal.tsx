"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
};

export default function UploadQuizModal({ open, onClose, onUpload }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <Upload className="h-6 w-6" />
          </div>

          {/* Text */}
          <h2 className="text-base font-semibold sm:text-lg">
            Upload a file to generate your questions
          </h2>

          {/* Button */}
          <Button
            onClick={onUpload}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
