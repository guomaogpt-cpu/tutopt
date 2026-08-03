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
  showEmail: boolean;
  templates: string[];
  contactCtaLabel: string;
};

export function getLeadFormConfig(vertical: ListingVertical): LeadFormConfig {
  switch (vertical) {
    case "MARKET":
      return {
        title: "Связаться",
        subtitle: "Напишите сообщение и оставьте телефон для связи.",
        messageLabel: "Ваше сообщение",
        messagePlaceholder:
          "Здравствуйте. Товар ещё в наличии? Можно уточнить детали?",
        defaultMessage:
          "Здравствуйте. Товар ещё в наличии? Можно уточнить детали?",
        submitLabel: "Отправить",
        successTitle: "Запрос отправлен.",
        successMessage: () =>
          "Запрос отправлен. Автор объявления получит ваши контакты и сообщение.",
        loginPrompt: (sellerName) =>
          `Войдите, чтобы связаться с автором ${sellerName}.`,
        sellerLeadTypeLabel: "Сообщение по товару",
        notificationTitle: "Новое сообщение по товару",
        notificationMessage: (listingTitle) =>
          `Покупатель написал по объявлению «${listingTitle}»`,
        listingLabel: "Товар",
        recipientLabel: "Продавец",
        showQuantity: false,
        quantityLabel: "Количество",
        showEmail: false,
        templates: [
          "Товар в наличии?",
          "Можно фото/видео?",
          "Цена окончательная?",
        ],
        contactCtaLabel: "Связаться",
      };
    case "SERVICES":
      return {
        title: "Связаться",
        subtitle: "Опишите задачу и оставьте телефон для связи.",
        messageLabel: "Ваше сообщение",
        messagePlaceholder:
          "Здравствуйте. Интересует ваша услуга. Подскажите, пожалуйста, условия и стоимость.",
        defaultMessage:
          "Здравствуйте. Интересует ваша услуга. Подскажите, пожалуйста, условия и стоимость.",
        submitLabel: "Отправить",
        successTitle: "Запрос отправлен.",
        successMessage: () =>
          "Запрос отправлен. Исполнитель получит ваши контакты и сообщение.",
        loginPrompt: (sellerName) =>
          `Войдите, чтобы связаться с исполнителем ${sellerName}.`,
        sellerLeadTypeLabel: "Заявка на услугу",
        notificationTitle: "Новая заявка на услугу",
        notificationMessage: (listingTitle) =>
          `Клиент оставил заявку по услуге «${listingTitle}»`,
        listingLabel: "Услуга",
        recipientLabel: "Исполнитель",
        showQuantity: false,
        quantityLabel: "Количество",
        showEmail: false,
        templates: ["Уточнить стоимость", "Уточнить сроки", "Нужен выезд"],
        contactCtaLabel: "Связаться",
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
        showEmail: true,
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
        title: "Связаться с поставщиком",
        subtitle: "Уточните партию, наличие и условия поставки.",
        messageLabel: "Ваше сообщение",
        messagePlaceholder:
          "Здравствуйте. Интересует оптовое предложение. Подскажите, пожалуйста, минимальную партию, наличие и условия.",
        defaultMessage:
          "Здравствуйте. Интересует оптовое предложение. Подскажите, пожалуйста, минимальную партию, наличие и условия.",
        submitLabel: "Отправить",
        successTitle: "Запрос отправлен.",
        successMessage: () =>
          "Запрос отправлен. Поставщик получит ваши контакты и сообщение.",
        loginPrompt: (sellerName) =>
          `Войдите, чтобы связаться с поставщиком ${sellerName}.`,
        sellerLeadTypeLabel: "Оптовый запрос",
        notificationTitle: "Новый оптовый запрос",
        notificationMessage: (listingTitle) =>
          `Покупатель отправил оптовый запрос по предложению «${listingTitle}»`,
        listingLabel: "Товар",
        recipientLabel: "Поставщик",
        showQuantity: true,
        quantityLabel: "Количество",
        quantityHint: undefined,
        showEmail: false,
        templates: [
          "Уточнить цену за партию",
          "Уточнить наличие",
          "Уточнить доставку",
        ],
        contactCtaLabel: "Связаться с поставщиком",
      };
  }
}

export function getLeadTypeLabel(vertical: ListingVertical): string {
  return getLeadFormConfig(vertical).sellerLeadTypeLabel;
}
