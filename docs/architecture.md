# Архитектура проекта

## Обзор

Персональный портфолио-сайт, построенный по методологии **Feature-Sliced Design (FSD)**.
Основной стек: **Vite + React 19 + TypeScript + MobX + Mantine 8 + Firebase + SCSS Modules**.

## Слои FSD

```
src/
├── app/           # Инициализация приложения, глобальные провайдеры, роутер
├── pages/         # Страницы (композиция виджетов и фич)
├── widgets/       # Крупные блоки UI (секции лендинга, хедер, футер)
├── features/      # Бизнес-фичи (формы авторизации, профиля, контакта, админ-панель)
├── entities/      # Бизнес-сущности (User, Project, Achievement, Grant)
├── shared/        # Общие утилиты, UI-компоненты, хуки, API, стили
└── assets/        # Статические ресурсы (шрифты, изображения)
```

### Правило импортов

Импорты идут только **вниз по слоям**:
- `pages` → `widgets`, `features`, `entities`, `shared`
- `widgets` → `features`, `entities`, `shared`
- `features` → `entities`, `shared`
- `entities` → `shared`

**Запрещено** импортировать из слоя выше текущего.

## Управление состоянием

### Глобальное состояние

- **RootStore** (`shared/stores/RootStore.ts`) — корневой контейнер
  - `UserStore` — аутентификация, данные пользователя, роли
- Предоставляется через `StoreProvider` (React Context)

### Локальные сторы

- Создаются с помощью `useLocalStore(factory)` — кастомный хук
- Автоматически вызывают `destroy()` при размонтировании компонента
- Реализуют интерфейс `ILocalStore` с обязательным методом `destroy()`

### BaseStore

Абстрактный класс для управления мета-состоянием:
- `meta: Meta` — initial | loading | error | success
- `error: string | null`
- Методы: `setLoading()`, `setSuccess()`, `setError()`, `reset()`

## Маршрутизация

| Маршрут | Компонент | Описание |
| --- | --- | --- |
| `/` | `HomePage` | Лендинг (Hero, About, Projects, Achievements, Grants, Contact) |
| `/auth` | `AuthPage` | Вход / Сброс пароля |
| `/register` | `RegisterPage` | Регистрация |
| `/profile` | `ProfilePage` | Профиль пользователя |
| `/achievements` | `AchievementsPage` | Все достижения с поиском и сортировкой |
| `/projects` | `ProjectsPage` | Все проекты с поиском и сортировкой |
| `/admin` | `AdminPage` | Панель администратора |
| `/terms` | `TermsPage` | Пользовательское соглашение |
| `/privacy` | `PrivacyPage` | Политика конфиденциальности |

## API и данные

### Firebase

- **Authentication** — email/password, Google OAuth
- **Firestore** — коллекции: `users`, `projects`, `achievements`, `grants`, `contacts`, `badges`

### Паттерн запросов

```
API-функция → fetchCollection / fetchDocument (shared/api/firestoreHelpers.ts)
    ↓
snapshotToEntity mapper
    ↓
BaseResponse<T> | BaseResponse<PaginatedResponse<T>>
```

Каждый API-запрос возвращает `BaseResponse<T>`:
```typescript
type BaseResponse<T> =
  | { isError: false; data: T }
  | { isError: true; data: null; error: unknown };
```

## Стилевая система

### SCSS Modules + BEM

- Каждый компонент имеет `.module.scss` файл
- Корневой класс: `.root` или название компонента
- Элементы: `&__element`
- Модификаторы: `&--modifier`

### CSS-переменные для тем

Инпуты и формы используют CSS-переменные:
```scss
--input-bg
--input-text
--input-placeholder
--input-bg-disabled
--input-text-disabled
```

### Адаптивные миксины

```scss
@include smallerThanLaptop  // < 1024px
@include smallerThanTablet  // < 768px
@include phone              // < 480px
```

### Типографика

Миксин `fontSize($size, $min-ratio)` — `clamp()` для адаптивного масштабирования.

## Анимации

- **Framer Motion** — анимации компонентов, модальные окна, выпадающие списки
- **FadeIn** — обёртка для анимации появления при скролле (IntersectionObserver)
- **DotLottie** — иллюстрации у заголовков секций
- **CSS-анимации** — пульсация иконок, плавающие градиенты на фонах

## Сборка

### Vite + Rollup

- `manualChunks` — разделение на вендорные чанки (react, mantine, firebase, motion, mobx, icons, lottie)
- `resolve.dedupe` — предотвращение дублирования React
- Path aliases через `tsconfig.json` и `vite.config.ts`

### Команды

```bash
pnpm dev          # Запуск dev-сервера
pnpm build        # Продакшн-сборка
pnpm preview      # Превью продакшн-сборки
pnpm ts-check     # Проверка типов
pnpm lint         # ESLint
pnpm stylelint    # Stylelint
pnpm check-quality # Все проверки
pnpm format       # Prettier
```
