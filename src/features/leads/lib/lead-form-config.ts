import type { ListingVertical } from "@prisma/client";

export type LeadFormConfig = {
  title: string;
  subtitle: string;
  messageLabel: string;
  messagePlaceholder: string;
  defaultMessage: string;
  submitLabel: string;
  successTitle: string;
  successMessage: (sellerName: string) => string;
  loginPrompt: (sellerName: string) => string;
  sellerLeadTypeLabel: string;
  notificationTitle: string;
  notificationMessage: (listingTitle: string) => string;
  listingLabel: string;
  recipientLabel: string;
  showQuantity: boolean;
  quantityLabel: string;
  quantityHint?: string;
  templates: string[];
  contactCtaLabel: string;
};

export function getLeadFormConfig(vertical: ListingVertical): LeadFormConfig {
  switch (vertical) {
    case "MARKET":
      return {
        title: "Написать продавцу",
        subtitle: "Уточните наличие, состояние товара и условия передачи.",
        messageLabel: "Сообщение продавцу",
        messagePlaceholder:
          "Здравствуйте. Товар ещё в наличии? Можно уточнить детали?",
        defaultMessage:
          "Здравствуйте. Товар ещё в наличии? Можно уточнить детали?",
        submitLabel: "Отправить сообщение",
        successTitle: "Сообщение отправлено",
        successMessage: (sellerName) =>
          `Сообщение отправлено продавцу ${sellerName}.`,
        loginPrompt: (sellerName) =>
          `Войдите, чтобы написать продавцу ${sellerName}.`,
        sellerLeadTypeLabel: "Сообщение по товару",
        notificationTitle: "Новое сообщение по товару",
        notificationMessage: (listingTitle) =>
          `Покупатель написал по объявлению «${listingTitle}»`,
        listingLabel: "Товар",
        recipientLabel: "Продавец",
        showQuantity: true,
        quantityLabel: "Количество",
        templates: [
          "Товар в наличии?",
          "Можно фото/видео?",
          "Цена окончательная?",
        ],
        contactCtaLabel: "Написать продавцу",
      };
    case "SERVICES":
      return {
        title: "Оставить заявку на услугу",
        subtitle: "Опишите задачу, сроки и место выполнения.",
        messageLabel: "Описание задачи",
        messagePlaceholder:
          "Здравствуйте. Нужна услуга. Опишите, пожалуйста, условия, стоимость и ближайшее доступное время.",
        defaultMessage:
          "Здравствуйте. Нужна услуга. Опишите, пожалуйста, условия, стоимость и ближайшее доступное время.",
        submitLabel: "Отправить заявку",
        successTitle: "Заявка отправлена",
        successMessage: (sellerName) =>
          `Заявка отправлена специалисту ${sellerName}.`,
        loginPrompt: (sellerName) =>
          `Войдите, чтобы оставить заявку специалисту ${sellerName}.`,
        sellerLeadTypeLabel: "Заявка на услугу",
        notificationTitle: "Новая заявка на услугу",
        notificationMessage: (listingTitle) =>
          `Клиент оставил заявку по объявлению «${listingTitle}»`,
        listingLabel: "Услуга",
        recipientLabel: "Специалист",
        showQuantity: false,
        quantityLabel: "Количество",
        templates: ["Уточнить стоимость", "Уточнить сроки", "Нужен выезд"],
        contactCtaLabel: "Оставить заявку",
      };
    case "CARGO":
      return {
        title: "Запросить перевозку",
        subtitle: "Опишите маршрут, груз, сроки и объём.",
        messageLabel: "Детали перевозки",
        messagePlaceholder:
          "Здравствуйте. Нужно перевезти груз. Маршрут: ..., вес/объём: ..., сроки: ... . Уточните, пожалуйста, стоимость.",
        defaultMessage:
          "Здравствуйте. Нужно перевезти груз. Маршрут: ..., вес/объём: ..., сроки: ... . Уточните, пожалуйста, стоимость.",
        submitLabel: "Отправить запрос",
        successTitle: "Запрос отправлен",
        successMessage: (sellerName) =>
          `Запрос отправлен перевозчику ${sellerName}.`,
        loginPrompt: (sellerName) =>
          `Войдите, чтобы запросить перевозку у ${sellerName}.`,
        sellerLeadTypeLabel: "Запрос перевозки",
        notificationTitle: "Новый запрос перевозки",
        notificationMessage: (listingTitle) =>
          `Клиент запросил перевозку по объявлению «${listingTitle}»`,
        listingLabel: "Предложение",
        recipientLabel: "Перевозчик",
        showQuantity: true,
        quantityLabel: "Объём / вес",
        quantityHint: "Можно указать ориентировочный объём или вес",
        templates: [
          "Уточнить стоимость перевозки",
          "Есть груз Китай-Кыргызстан",
          "Нужна доставка до склада",
        ],
        contactCtaLabel: "Запросить перевозку",
      };
    case "OPT":
    default:
      return {
        title: "Запросить оптовое предложение",
        subtitle: "Уточните партию, цену, наличие и условия отгрузки.",
        messageLabel: "Сообщение поставщику",
        messagePlaceholder:
          "Здравствуйте. Интересует партия товара. Уточните, пожалуйста, цену, минимальный объём, наличие и условия доставки.",
        defaultMessage:
          "Здравствуйте. Интересует партия товара. Уточните, пожалуйста, цену, минимальный объём, наличие и условия доставки.",
        submitLabel: "Отправить запрос",
        successTitle: "Запрос отправлен",
        successMessage: (sellerName) =>
          `Запрос отправлен поставщику ${sellerName}.`,
        loginPrompt: (sellerName) =>
          `Войдите, чтобы отправить запрос поставщику ${sellerName}.`,
        sellerLeadTypeLabel: "Оптовый запрос",
        notificationTitle: "Новый оптовый запрос",
        notificationMessage: (listingTitle) =>
          `Покупатель отправил оптовый запрос по объявлению «${listingTitle}»`,
        listingLabel: "Товар",
        recipientLabel: "Поставщик",
        showQuantity: true,
        quantityLabel: "Количество",
        quantityHint: undefined,
        templates: [
          "Уточнить цену за партию",
          "Уточнить наличие",
          "Уточнить доставку",
        ],
        contactCtaLabel: "Отправить запрос",
      };
  }
}

export function getLeadTypeLabel(vertical: ListingVertical): string {
  return getLeadFormConfig(vertical).sellerLeadTypeLabel;
}
