"use client";

import { useState } from "react";

const COLLAPSED_LENGTH = 480;

type ListingDescriptionProps = {
  text: string;
};

export function ListingDescription({ text }: ListingDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > COLLAPSED_LENGTH;
  const displayText = !isLong || expanded ? text : `${text.slice(0, COLLAPSED_LENGTH).trimEnd()}…`;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Описание</h2>
      <div className="mt-5">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">{displayText}</p>
        {isLong ? (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-4 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
