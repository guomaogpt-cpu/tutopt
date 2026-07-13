import Link from "next/link";
import { Container } from "./Container";
import { BrandLogo } from "./BrandLogo";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Покупателям",
    links: [
      { label: "Каталог", href: "/listings" },
      { label: "Избранное", href: "/favorites" },
      { label: "Кабинет покупателя", href: "/buyer/dashboard" },
    ],
  },
  {
    title: "Продавцам",
    links: [
      { label: "Подать объявление", href: "/listings/new" },
      { label: "Кабинет продавца", href: "/seller/dashboard" },
      { label: "Заявки", href: "/seller/leads" },
    ],
  },
  {
    title: "Платформа",
    links: [
      { label: "Продавцы", href: "/sellers" },
      { label: "Уведомления", href: "/notifications" },
      { label: "Войти", href: "/login" },
      { label: "Регистрация", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container>
        <div className="grid grid-cols-1 gap-6 py-10 sm:gap-8 lg:grid-cols-4 lg:gap-10 lg:py-14">
          <div className="min-w-0">
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              B2B-платформа оптовых объявлений в Кыргызстане
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
              Покупатели находят поставщиков, продавцы получают заявки.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} className="min-w-0" aria-label={column.title}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{column.title}</h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-slate-200 py-6 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">© 2026 Tutopt. Все права защищены.</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
            Оптовые объявления для бизнеса в Кыргызстане.
          </p>
        </div>
      </Container>
    </footer>
  );
}
