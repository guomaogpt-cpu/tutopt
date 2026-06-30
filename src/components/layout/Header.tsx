import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "Категории", href: "/categories" },
  { label: "Продавцы", href: "/sellers" },
];

export function Header() {
  return (
    <header className="relative border-b border-slate-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Регистрация
            </Link>
            <Link
              href="/listings/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Подать объявление
            </Link>
          </div>

          <MobileMenu navLinks={navLinks} />
        </div>
      </Container>
    </header>
  );
}
