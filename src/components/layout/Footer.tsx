import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";

const footerLinks = [
  { label: "О проекте", href: "/about" },
  { label: "Помощь", href: "/help" },
  { label: "Контакты", href: "/contacts" },
  { label: "Политика", href: "/privacy" },
  { label: "Пользовательское соглашение", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              B2B-платформа для размещения и поиска оптовых объявлений в Кыргызстане.
            </p>
          </div>

          <nav className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 transition hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-200 py-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Tutopt. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
}
