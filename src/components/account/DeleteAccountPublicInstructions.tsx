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
            <Link href={buildLoginUrl(loginNextPath)} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              Войдите в аккаунт
            </Link>
          </li>
          <li>Откройте страницу удаления аккаунта в кабинете</li>
          <li>Отправьте запрос на удаление и дождитесь подтверждения от поддержки</li>
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
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Срок обработки</h2>
        <p>
          Запросы обрабатываются вручную, обычно в течение нескольких рабочих дней. Полное
          автоматическое удаление всех связанных данных может быть добавлено в следующих версиях
          сервиса.
        </p>
      </section>
    </div>
  );
}
