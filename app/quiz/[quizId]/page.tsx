"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  type: "mcq" | "essay";
  options?: string[];
  correct_answer?: string;
};

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const normalize = (text?: string) => text?.trim().toLowerCase();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch(`/api/quiz/${quizId}`);
    const data = await res.json();
    setQuestions(data.questions);
  };

  const handleSelect = (q: Question, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [q.id]: option,
    }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* 🔙 BACK BUTTON TARUH DI SINI */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Kembali ke Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>

      <div className="space-y-8">
        {questions.map((q, index) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = normalize(selected) === normalize(q.correct_answer);

          return (
            <div
              key={q.id}
              className="border p-6 rounded-lg bg-white shadow-sm"
            >
              <p className="font-semibold mb-4">
                {index + 1}. {q.question}
              </p>

              {q.type === "mcq" && q.options && (
                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === opt;
                    const isRightAnswer =
                      normalize(q.correct_answer) === normalize(opt);

                    let style = "border hover:bg-gray-50";

                    if (selected) {
                      if (isRightAnswer) {
                        style = "border-green-500 bg-green-50";
                      } else if (isSelected && !isCorrect) {
                        style = "border-red-500 bg-red-50";
                      }
                    }

                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${style}`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSelect(q, opt)}
                          disabled={!!selected} // disable setelah pilih
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              {selected && (
                <div className="mt-4 font-medium">
                  {isCorrect ? (
                    <p className="text-green-600">✅ Jawaban Benar</p>
                  ) : (
                    <p className="text-red-600">
                      ❌ Jawaban Salah <br />
                      Jawaban yang benar:{" "}
                      <span className="font-semibold">{q.correct_answer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
