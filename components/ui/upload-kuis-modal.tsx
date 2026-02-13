'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  loading?: boolean;
  onContinue: () => void;
  uploadDone?: boolean;
  uploadLoading?: boolean;
  generateLoading?: boolean;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

export default function UploadQuizModal({
  open,
  onClose,
  onUpload,
  loading = false,
  onContinue,
  uploadDone = false,
  uploadLoading = false,
  generateLoading = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const isLoading = uploadLoading || generateLoading;

  if (!open) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file maksimal 50MB');
      return;
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format file harus PDF, PPT, DOC, atau TXT');
      return;
    }

    setFileName(file.name);
    onUpload(file);
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setFileName(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            {loading || isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>

          {/* Text */}
          <h2 className="text-base font-semibold sm:text-lg">
            {uploadLoading
              ? 'Mengupload file...'
              : generateLoading
                ? 'Membuat soal...'
                : 'Unggah file untuk menghasilkan soal'}
          </h2>

          <p className="text-xs text-gray-500">
            Format: PDF, PPT, DOC, TXT · Maks. 50MB
          </p>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />

          {/* Button */}
          <Button
            onClick={() => inputRef.current?.click()}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {uploadLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Upload'
            )}
          </Button>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            disabled={!uploadDone || loading || isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
          >
            {generateLoading
              ? 'Memproses...'
              : uploadDone
                ? 'Continue'
                : 'Generate Kuis'}
          </Button>

          {/* File name */}
          {fileName && !loading && (
            <p className="text-sm text-green-600 truncate max-w-full">
              ✓ {fileName}
            </p>
          )}

          {/* Loading status */}
          {uploadLoading && fileName && (
            <p className="text-sm text-blue-600 truncate max-w-full">
              Mengekstrak teks dari {fileName}...
            </p>
          )}
          {/* Generating kuis */}
          {generateLoading && (
            <p className="text-sm text-blue-600">
              sedang membuat soal dari dokumen...
            </p>
          )}
          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
