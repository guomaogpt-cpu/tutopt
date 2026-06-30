import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function AboutPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="О платформе"
          title="О проекте"
          description="Tutopt — B2B classified-платформа для оптовых объявлений в Кыргызстане."
        />

        <div className="prose prose-slate mt-10 max-w-3xl space-y-6 text-slate-600">
          <p className="text-base leading-relaxed">
            Мы помогаем оптовым продавцам и покупателям находить друг друга: производители,
            дистрибьюторы, импортёры и розничные компании размещают предложения и связываются
            напрямую.
          </p>
          <p className="text-base leading-relaxed">
            Tutopt — это не интернет-магазин. На платформе нет корзины, онлайн-оплаты и доставки.
            Сделки совершаются между сторонами вне сервиса.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base">
            <li>Поиск оптовых предложений по категориям и регионам</li>
            <li>Профили компаний-продавцов</li>
            <li>Заявки и прямой контакт с поставщиком</li>
            <li>Модерация объявлений для качества каталога</li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
