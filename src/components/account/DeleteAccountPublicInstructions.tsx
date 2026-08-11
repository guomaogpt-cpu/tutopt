import Link from "next/link";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getSupportEmail, getSupportMailtoHref } from "@/shared/config/support";

type DeleteAccountPublicInstructionsProps = {
  loginNextPath?: string;
};

export function DeleteAccountPublicInstructions({
  loginNextPath = "/account/delete",
}: DeleteAccountPublicInstructionsProps) {
  const supportEmail = getSupportEmail();

  return (
    <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Если у вас есть аккаунт
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <Link
              href={buildLoginUrl(loginNextPath)}
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Войдите в аккаунт
            </Link>
          </li>
          <li>Откройте страницу удаления в кабинете</li>
          <li>Нажмите «Запросить удаление аккаунта» и подтвердите запрос</li>
        </ol>
        <p>
          <Link
            href="/account/delete"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Перейти к удалению аккаунта (требуется вход)
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Если вы не можете войти
        </h2>
        <p>
          Напишите на{" "}
          <a
            href={getSupportMailtoHref(
              "ВсеТут — запрос удаления аккаунта",
              "Прошу удалить мой аккаунт ВсеТут.\n\nТелефон или email аккаунта:\n\nКомментарий:\n",
            )}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {supportEmail}
          </a>{" "}
          с номером телефона или email, указанными при регистрации.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Что может быть удалено или скрыто
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>профиль и контактные данные аккаунта;</li>
          <li>объявления пользователя — скрыты или удалены согласно правилам платформы;</li>
          <li>заявки и связанные данные — обработаны или обезличены, где это возможно;</li>
          <li>данные, которые необходимо сохранить по закону или для разрешения споров.</li>
        </ul>
        <p>
          Аккаунт <strong>не удаляется автоматически</strong> — запрос проверяется поддержкой.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Срок обработки</h2>
        <p>
          Запрос будет рассмотрен поддержкой. Обычно это занимает несколько рабочих дней. Мы
          свяжемся с вами при необходимости по контактным данным аккаунта.
        </p>
      </section>
    </div>
  );
}
