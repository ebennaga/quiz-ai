"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [hasUploaded, setHasUploaded] = useState<boolean | null>(null);

  useEffect(() => {
    checkUpload();
  }, []);

  const checkUpload = async () => {
    const res = await fetch("/api/quiz/check-upload");
    const data = await res.json();
    setHasUploaded(data.hasUploaded);
  };

  if (hasUploaded === null) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-lg bg-orange-500 text-white p-3 text-center font-medium">
        Unlock all the questions and unlimited documents
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions Stats */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Questions stats</h2>
            <button className="border px-3 py-1 rounded">See questions</button>
          </div>

          <div className="flex items-center justify-center h-40 text-gray-400">
            33 Questions
          </div>
        </div>

        {/* Reread */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Reread</h2>
            <button className="border px-3 py-1 rounded">See all</button>
          </div>

          <div className="border rounded p-4 text-sm text-gray-700">
            Bagaimana hubungan antara validitas dan akuntabilitas data Pengelola
            Sistem Elektronik dengan keberhasilan normalisasi situs?
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-gray-500 mb-4">
          0% of questions replied correctly in the last 7 days
        </h3>

        <div className="text-center">
          <p className="mb-3 font-medium">
            Start practicing to see your progress
          </p>

          <a
            href="/questions"
            className="inline-block bg-orange-500 text-white px-4 py-2 rounded"
          >
            Go to questions
          </a>
        </div>
      </div>

      {/* Explanations */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Explanations</h3>

        <div className="flex justify-between items-center border p-4 rounded">
          <p className="text-sm">
            Bagaimana hubungan antara validitas dan akuntabilitas data Pengelola
            Sistem Elektronik dengan keberhasilan normalisasi situs?
          </p>

          <button className="border px-3 py-1 rounded">Read</button>
        </div>
      </div>
    </div>
  );
}
