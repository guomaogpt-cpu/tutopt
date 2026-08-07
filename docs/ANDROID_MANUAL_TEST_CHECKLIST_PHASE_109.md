# Android Manual Test Checklist — Phase 109

> Пройти на **реальном Android-устройстве** после установки debug APK.
> Отмечать: ✅ pass / ❌ fail / ⏭ skip / 📝 note

**APK:** debug (`app-debug.apk`)  
**App:** ВсеТут (`kg.vsetut.app`)  
**URL:** https://tutopt-production.up.railway.app  
**Tester:** _______________  
**Device:** _______________  
**Android version:** _______________  
**Date:** _______________

---

## Запуск

- [ ] Приложение открывается без crash
- [ ] Splash отображается нормально (не зависает >5 сек)
- [ ] Открывается главная `/`
- [ ] Нет белого пустого экрана после splash
- [ ] Нет бесконечной загрузки

## Навигация

- [ ] Bottom nav: **Главная** → `/`
- [ ] Bottom nav: **Поиск** → `/listings`
- [ ] Bottom nav: **Подать** → `/listings/new`
- [ ] Bottom nav: **Уведомления** → `/notifications` (или login)
- [ ] Bottom nav: **Кабинет** → `/account` (или login)
- [ ] Active state корректный на каждой вкладке
- [ ] Android **Back** — назад по истории
- [ ] Android **Back** на главной — exit app (не crash)
- [ ] Back на modal/bottom sheet закрывает modal (cargo request)
- [ ] Нет случайного закрытия приложения в середине формы
- [ ] Нет горизонтального скролла на главных экранах

## Auth

- [ ] `/login` открывается
- [ ] `/register` открывается
- [ ] Login email/password работает
- [ ] Session сохраняется после перезапуска приложения
- [ ] Logout работает
- [ ] Google OAuth (если тестируете): _______________
  - 📝 note: может не работать в WebView — expected risk

## Объявления — просмотр

- [ ] `/market` открывается
- [ ] `/listings` открывается
- [ ] Фильтры/категории не ломают layout
- [ ] Карточка объявления `/listings/[id]` открывается
- [ ] Фото на detail page отображаются
- [ ] Sticky CTA (связаться) видна, не перекрыта bottom nav
- [ ] Характеристики отображаются (если есть)

## Объявления — создание

- [ ] `/listings/new` открывается
- [ ] Выбор vertical (market/services/opt/cargo) работает
- [ ] Поиск категории работает
- [ ] **Оборудование и станки** видно в категориях
- [ ] Подкатегории оборудования видны (упаковка, станки, HoReCa и т.д.)
- [ ] **Phase 110:** после выбора subcategory ранее введённые характеристики не слетают
- [ ] **Phase 110:** title/price/city не слетают при заполнении characteristics
- [ ] Характеристики меняются от категории/подкатегории
- [ ] AI description / mock fallback работает (кнопка не ломает форму)
- [ ] **Phase 110:** AI не перезаписывает уже введённое описание
- [ ] Preview перед публикацией показывает данные
- [ ] Submit не перекрыт bottom nav
- [ ] Submit успешно создаёт объявление
- [ ] **Phase 110:** после закрытия app и reopen — banner «Найден черновик»

## Фото

- [ ] Кнопка выбора фото открывает gallery/camera picker
- [ ] Можно выбрать 1+ фото
- [ ] Upload завершается без ошибки
- [ ] Фото видно в preview формы
- [ ] Фото видно на опубликованном объявлении

## Кабинет

- [ ] `/account` открывается (авторизованный пользователь)
- [ ] **Мои объявления** `/account/listings` открывается
- [ ] **Заявки** `/account/requests` открывается
- [ ] **Компания** `/account/company` открывается
- [ ] Install app card в кабинете не мешает (PWA prompt)

## Карго

- [ ] `/cargo` открывается
- [ ] Hero не слишком большой
- [ ] «Создать заявку» открывает modal/bottom sheet
- [ ] Форма заявки не перекрыта bottom nav
- [ ] Можно отправить заявку (если авторизован)
- [ ] Список карго-компаний читается

## Offline

- [ ] Включить airplane mode
- [ ] Показывается `/offline` или понятная ошибка (не белый экран)
- [ ] Кнопка «Повторить» работает после восстановления сети

## UX / ошибки

- [ ] **Phase 111:** sticky submit/CTA не перекрыты клавиатурой
- [ ] **Phase 111:** Android Back закрывает modal/keyboard перед exit
- [ ] **Phase 111:** confirm при выходе из формы с несохранёнными данными
- [ ] Длинные списки категорий скроллятся нормально
- [ ] Нет crash при rotation (portrait locked — expected)
- [ ] External links (если есть) открываются в browser

---

## Summary

| Section | Pass | Fail | Skip |
|---|---|---|---|
| Запуск | | | |
| Навигация | | | |
| Auth | | | |
| Объявления просмотр | | | |
| Обявления создание | | | |
| Фото | | | |
| Кабинет | | | |
| Карго | | | |
| Offline | | | |
| UX | | | |

**Critical bugs found:**

1. _______________
2. _______________
3. _______________

**Recommendation:**

- [ ] Ready for release AAB prep
- [ ] Needs Android UX fixes first
- [ ] Needs web app fixes first

## Связанные документы

- `docs/ANDROID_APK_TEST_INSTALL_PHASE_109.md`
- `docs/ANDROID_FORM_STABILITY_PHASE_110.md`
- `docs/ANDROID_MANUAL_QA_POLISH_PHASE_111.md`
