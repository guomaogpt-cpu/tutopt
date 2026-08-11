"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSupportMailtoHref } from "@/shared/config/support";

type DeleteAccountFormProps = {
  userLabel: string;
};

type RequestState = "idle" | "submitting" | "success" | "error";

export function DeleteAccountForm({ userLabel }: DeleteAccountFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<RequestState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!confirmed) {
      setErrorMessage("Подтвердите, что вы понимаете последствия удаления аккаунта.");
      setState("error");
      return;
    }

    setState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/account/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, confirm: true }),
      });

      const body = (await response.json()) as {
        data?: { message?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        setErrorMessage(body.error?.message ?? "Не удалось отправить запрос. Попробуйте позже.");
        setState("error");
        return;
      }

      setState("success");
      router.refresh();
    } catch {
      setErrorMessage("Не удалось отправить запрос. Проверьте соединение и попробуйте снова.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
        <p className="font-semibold">Запрос на удаление аккаунта отправлен</p>
        <p className="mt-2 leading-relaxed">
          Мы получили ваш запрос. После обработки профиль и связанные данные могут быть удалены или
          обезличены. Обычно это занимает несколько рабочих дней.
        </p>
        <p className="mt-3">
          <Link href="/account" className="font-medium text-emerald-800 underline dark:text-emerald-200">
            Вернуться в кабинет
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Аккаунт: <span className="font-medium text-slate-900 dark:text-slate-100">{userLabel}</span>
      </p>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <p className="font-medium text-slate-900 dark:text-slate-100">Что произойдёт после запроса</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Аккаунт не удаляется автоматически — запрос проверяется вручную.</li>
          <li>После обработки запроса профиль и связанные данные могут быть удалены или обезличены.</li>
          <li>Объявления, заявки и связанные данные обрабатываются согласно правилам платформы.</li>
        </ul>
      </div>

      <div>
        <label htmlFor="deletion-reason" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Комментарий (необязательно)
        </label>
        <Textarea
          id="deletion-reason"
          name="reason"
          rows={3}
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Почему вы хотите удалить аккаунт?"
          className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
          disabled={state === "submitting"}
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          disabled={state === "submitting"}
          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
        />
        <span>
          Я понимаю, что удаление аккаунта необратимо после обработки запроса, и хочу отправить
          запрос на удаление.
        </span>
      </label>

      {errorMessage ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={state === "submitting"}
          className="h-11 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Отправка…
            </>
          ) : (
            "Запросить удаление аккаунта"
          )}
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl" asChild>
          <Link href="/account">Отмена</Link>
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Нужна помощь?{" "}
        <a
          href={getSupportMailtoHref("ВсеТут — запрос удаления аккаунта")}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Написать в поддержку
        </a>
      </p>
    </form>
  );
}
