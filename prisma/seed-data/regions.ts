export const REGIONS = [
  { name: "Бишкек", slug: "bishkek", sort_order: 1 },
  { name: "Ош", slug: "osh", sort_order: 2 },
  { name: "Чуйская область", slug: "chuy", sort_order: 3 },
  { name: "Ошская область", slug: "osh-oblast", sort_order: 4 },
  { name: "Джалал-Абадская область", slug: "jalal-abad", sort_order: 5 },
  { name: "Нарынская область", slug: "naryn", sort_order: 6 },
  { name: "Иссык-Кульская область", slug: "issyk-kul", sort_order: 7 },
  { name: "Таласская область", slug: "talas", sort_order: 8 },
  { name: "Баткенская область", slug: "batken", sort_order: 9 },
] as const;

export type CitySeed = {
  name: string;
  slug: string;
  regionSlug: string;
  sort_order: number;
};

export const CITIES: CitySeed[] = [
  { name: "Бишкек", slug: "bishkek-city", regionSlug: "bishkek", sort_order: 1 },
  { name: "Ош", slug: "osh-city", regionSlug: "osh", sort_order: 1 },
  { name: "Токмок", slug: "tokmok", regionSlug: "chuy", sort_order: 2 },
  { name: "Кант", slug: "kant", regionSlug: "chuy", sort_order: 3 },
  { name: "Кара-Балта", slug: "kara-balta", regionSlug: "chuy", sort_order: 4 },
  { name: "Каракол", slug: "karakol", regionSlug: "issyk-kul", sort_order: 1 },
  { name: "Балыкчы", slug: "balykchy", regionSlug: "issyk-kul", sort_order: 2 },
  { name: "Джалал-Абад", slug: "jalal-abad-city", regionSlug: "jalal-abad", sort_order: 1 },
  { name: "Кара-Куль", slug: "kara-kul", regionSlug: "jalal-abad", sort_order: 2 },
  { name: "Нарын", slug: "naryn-city", regionSlug: "naryn", sort_order: 1 },
  { name: "Талас", slug: "talas-city", regionSlug: "talas", sort_order: 1 },
  { name: "Баткен", slug: "batken-city", regionSlug: "batken", sort_order: 1 },
  { name: "Исфана", slug: "isfana", regionSlug: "batken", sort_order: 2 },
  { name: "Узген", slug: "uzgen", regionSlug: "osh-oblast", sort_order: 1 },
  { name: "Кара-Суу", slug: "kara-suu", regionSlug: "osh-oblast", sort_order: 2 },
];
