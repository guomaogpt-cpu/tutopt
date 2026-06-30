"use client";

import { useState } from "react";

const QUICK_QUESTIONS = [
  "Есть в наличии?",
  "Какая цена при опте?",
  "Можно получить КП?",
  "Какие условия доставки?",
] as const;

type ListingSellerMessageProps = {
  sellerName: string;
};

export function ListingSellerMessage({ sellerName }: ListingSellerMessageProps) {
  const [message, setMessage] = useState("Здравствуйте! Интересует товар...");

  function applyQuickQuestion(question: string) {
    setMessage((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === "Здравствуйте! Интересует товар...") {
        return question;
      }
      return `${trimmed}\n${question}`;
    });
  }

  return (
    <section
      id="listing-seller-message"
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
    >
      <h2 className="text-xl font-semibold text-slate-900">Спросите поставщика</h2>
      <p className="mt-2 text-sm text-slate-500">
        Напишите сообщение для {sellerName}. Отправка будет доступна после запуска сервиса заявок.
      </p>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
        className="mt-5 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        placeholder="Здравствуйте! Интересует товар..."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => applyQuickQuestion(question)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
          >
            {question}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled
        title="Отправка заявок скоро будет доступна"
        className="mt-5 inline-flex rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
      >
        Отправить сообщение
      </button>
    </section>
  );
}
