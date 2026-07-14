# Каталог компонентов

## Shared UI

### Button

**Путь:** `shared/ui/Button/Button.tsx`

Универсальная кнопка с поддержкой ссылок, загрузки, тем.

| Проп | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Содержимое кнопки |
| `theme` | `'primary' \| 'dark' \| 'accent'` | `'primary'` | Визуальная тема |
| `href` | `string` | — | Превращает в ссылку (Link/a) |
| `loading` | `boolean` | `false` | Показывает лоадер |
| `disabled` | `boolean` | `false` | Блокирует взаимодействие |
| `onClick` | `MouseEventHandler` | — | Обработчик клика |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Тип HTML-кнопки |

Анимации:
- Плавный подъём при наведении (`translateY(-1px)`)
- Тень при наведении
- Стилизованное disabled-состояние (прозрачность + grayscale)

---

### Input

**Путь:** `shared/ui/Input/Input.tsx`

Текстовый ввод с поддержкой иконки справа.

| Проп | Тип | Описание |
| --- | --- | --- |
| `value` | `string` | Значение |
| `onChange` | `(value: string) => void` | Обработчик изменения |
| `afterSlot` | `ReactNode` | Иконка/элемент после поля |
| `showTitle` | `boolean` | Показать placeholder как заголовок |

Стилизация: рамка при фокусе (бирюзовый акцент), CSS-переменные для цветов.

---

### Textarea

**Путь:** `shared/ui/Textarea/Textarea.tsx`

Многострочное текстовое поле. Аналогичная стилизация с Input.

---

### Select

**Путь:** `shared/ui/Select/Select.tsx`

Кастомный выпадающий список с анимациями (Framer Motion).

| Проп | Тип | Описание |
| --- | --- | --- |
| `value` | `string` | Текущее выбранное значение |
| `options` | `{ value: string; label: string }[]` | Список опций |
| `onChange` | `(value: string) => void` | Обработчик выбора |

Анимации: раскрытие/закрытие через AnimatePresence, вращение стрелки, галочка у выбранной опции.

---

### AnimatedCheckbox

**Путь:** `shared/ui/AnimatedCheckbox/AnimatedCheckbox.tsx`

Кастомный чекбокс с SVG-анимацией галочки.

| Проп | Тип | Описание |
| --- | --- | --- |
| `checked` | `boolean` | Состояние |
| `onChange` | `(checked: boolean) => void` | Обработчик |
| `label` | `ReactNode` | Текст метки |
| `disabled` | `boolean` | Блокировка |

---

### Text

**Путь:** `shared/ui/Text/Text.tsx`

Типографика с поддержкой различных размеров, весов, цветов.

| Проп | Описание |
| --- | --- |
| `view` | Размер: `p-10`, `p-12`, `p-14`, `p-16`, `p-18`, `p-20`, `p-24`, `p-28`, `p-32`, `title` |
| `weight` | Вес: `light`, `regular`, `medium`, `bold`, `black` |
| `color` | Цвет: `primary`, `secondary`, `accent` |
| `tag` | HTML-тег: `p`, `h1`–`h6`, `span`, `label` |
| `maxLines` | Ограничение строк (CSS line-clamp) |
| `font` | Шрифт: `pretendard` (по умолчанию), `caveat` |

---

### Skeleton

**Путь:** `shared/ui/Skeleton/Skeleton.tsx`

Анимированный плейсхолдер для загрузки.

---

### FadeIn

**Путь:** `shared/ui/FadeIn/FadeIn.tsx`

Обёртка для анимации появления элемента при попадании в viewport.

---

### VideoWithFallback

**Путь:** `shared/ui/VideoWithFallback/VideoWithFallback.tsx`

Видео с автоматической заглушкой при ошибке загрузки.

---

### ImageWithFallback

**Путь:** `shared/ui/ImageWithFallback/ImageWithFallback.tsx`

Изображение с заглушкой при ошибке загрузки.

---

### ScrollToTop

**Путь:** `shared/ui/ScrollToTop/ScrollToTop.tsx`

Невидимый компонент, прокручивающий страницу вверх при смене маршрута.

---

### NotificationProvider

**Путь:** `shared/ui/Notifications/NotificationProvider.tsx`

Контекст-провайдер для toast-уведомлений.

Использование:
```tsx
const notify = useNotification();
notify('Успешно!', 'success');
notify('Ошибка!', 'error');
notify('Информация', 'info');
```

Типы: `success` (зелёный), `error` (красный), `info` (голубой).
Автоматически исчезают через 3.5 секунды.

---

### Loader

**Путь:** `shared/ui/Loader/Loader.tsx`

Анимированный индикатор загрузки.

---

### Badge

**Путь:** `shared/ui/Badge/Badge.tsx`

Компактная метка для категорий достижений.

---

### Pagination

**Путь:** `shared/ui/Pagination/Pagination.tsx`

Компонент пагинации с номерами страниц.

## Entity-компоненты

### ProjectCard

**Путь:** `entities/Project/ui/ProjectCard/ProjectCard.tsx`

Карточка проекта с обложкой (видео/изображение), описанием и кнопками действий.

### AchievementCard

**Путь:** `entities/Achievement/ui/AchievementCard/AchievementCard.tsx`

Карточка достижения с обложкой, бейджами, датой и описанием.

| Проп | Тип | Описание |
| --- | --- | --- |
| `achievement` | `Achievement` | Данные достижения |
| `showDate` | `boolean` | Показать дату |
| `fullDescription` | `boolean` | Полное описание без обрезки |

## Виджеты (секции лендинга)

| Виджет | Описание |
| --- | --- |
| `HeroSection` | Главный экран с анимированным именем |
| `AboutSection` | Секция «Обо мне» с таймлайном |
| `ProjectsSection` | Последние 5 проектов + кнопка «Все проекты» |
| `AchievementsSection` | Последние 6 достижений + кнопка «Все достижения» |
| `GrantsSection` | Таблица грантов |
| `ContactSection` | Форма обратной связи + социальные ссылки |
| `Header` | Навигация с якорными ссылками |
| `Footer` | Подвал с ссылками на площадки |
