# Управление состоянием

## Обзор

Проект использует **MobX** для управления состоянием. Архитектура сторов выстроена по принципам FSD.

## Диаграмма сторов

```
StoreProvider (React Context)
└── RootStore
    └── UserStore (глобальный, живёт всё время жизни приложения)

useLocalStore(factory)
├── ProjectListStore (страница проектов, секция проектов)
├── AchievementListStore (страница достижений, секция достижений)
├── GrantListStore (секция грантов)
├── ContactFormStore (форма обратной связи)
├── LoginFormStore (форма входа)
├── RegisterFormStore (форма регистрации)
└── ProfileFormStore (форма профиля)
```

## Глобальные сторы

### RootStore

```
shared/stores/RootStore.ts
```

- Синглтон (создаётся один раз через `initRootStore()`)
- Содержит `UserStore`
- Доступен через `useRootStore()` / `useUserStore()`

### UserStore

```
entities/User/stores/UserStore.ts
```

**Наследует:** `BaseStore`
**Реализует:** `ILocalStore`

**Состояние:**
- `currentUser: User | null` — текущий аутентифицированный пользователь
- `isInitialized: boolean` — завершена ли проверка auth-состояния
- `meta: Meta` — состояние последней операции
- `error: string | null` — текст последней ошибки

**Вычисляемые:**
- `isAuth` — есть ли текущий пользователь
- `isAdmin` — является ли текущий пользователь администратором

**Действия:**
- `signIn(email, password)` — вход по email
- `signUp(email, password, displayName?)` — регистрация
- `signInWithGoogle()` — вход через Google
- `signOut()` — выход
- `resetPassword(email)` — сброс пароля
- `updateProfile(patch)` — обновление данных профиля
- `deleteAccount()` — удаление аккаунта (Firestore + Firebase Auth)
- `initAuthListener()` — подписка на `onAuthStateChanged`

**Жизненный цикл:**
1. `StoreProvider` вызывает `initAuthListener()` при монтировании
2. Firebase callback вызывает `_bootstrapUser()` при наличии пользователя
3. `_bootstrapUser()` загружает/создаёт документ в Firestore
4. При размонтировании вызывается `destroy()` → отписка от auth

## Локальные сторы

### Паттерн использования

```tsx
const store = useLocalStore(() => new SomeStore());

useEffect(() => {
  store.fetchData();
}, [store]);
```

Хук `useLocalStore`:
1. Создаёт инстанс стора один раз (через `useRef`)
2. При размонтировании компонента вызывает `store.destroy()`
3. Стор не пересоздаётся при ре-рендерах

### ProjectListStore

```
entities/Project/stores/ProjectListStore.ts
```

- Загружает все проекты из Firestore (`fetchAllProjects`)
- Сортировка по дате (desc) задаётся на уровне запроса
- Используется и на главной (slice первых 5), и на странице всех проектов

### AchievementListStore

```
entities/Achievement/stores/AchievementListStore.ts
```

- Курсорная пагинация через `Cursors` + `fetchPaginatedCollection`
- Поддержка сортировки: `date-desc`, `date-asc`, `title-asc`, `title-desc`
- Управление через `setSortValue(value)`
- Пагинация через `PaginationStore`

### GrantListStore

```
entities/Grant/stores/GrantListStore.ts
```

- Загружает все гранты (`fetchAllGrants`)
- Аналогичная структура с `ProjectListStore`

### ContactFormStore

```
features/contact/model/ContactFormStore.ts
```

- Поля: `name`, `email`, `message`
- Валидация: обязательность, длина имени (≥ 2), длина сообщения (≥ 10), формат email
- Отправка через `sendContactMessage`
- Состояния: initial → loading → success/error

### LoginFormStore / RegisterFormStore

```
features/auth/model/LoginFormStore.ts
features/auth/model/RegisterFormStore.ts
```

- Управление полями формы
- Локальная валидация
- Мета-состояние наследуется от UserStore (глобальный)

### ProfileFormStore

```
features/profile/model/ProfileFormStore.ts
```

- Заполняется из `UserStore.currentUser`
- Отслеживает `isDirty` для кнопки сохранения
- Валидация имени

## Паттерн BaseStore

```typescript
abstract class BaseStore {
  meta: Meta = Meta.initial;
  error: string | null = null;

  protected setLoading(): void  // meta → loading, error → null
  protected setSuccess(): void  // meta → success
  protected setError(e): void   // meta → error, error → message
  protected reset(): void       // meta → initial, error → null
}
```

Все сторы с async-операциями наследуют `BaseStore` для единообразной обработки состояний загрузки.

## Meta-состояния

```typescript
const Meta = {
  initial: 'initial',
  loading: 'loading',
  error: 'error',
  success: 'success',
} as const;
```

Используется для условного рендеринга: скелетоны (loading), ошибки (error), контент (success).

## Курсорная пагинация

```
shared/lib/cursors.ts
```

Класс `Cursors` управляет Firestore-курсорами для пагинации:
- Хранит ID последнего документа каждой страницы в `sessionStorage`
- Позволяет эффективно переходить между страницами без повторной загрузки предыдущих
- Автоматически сбрасывается при смене сортировки

## Рекомендации

1. **Всегда оборачивайте MobX-компоненты в `observer()`**
2. **Мутации observable внутри async-функций — в `runInAction()`**
3. **Проверяйте `isError` у API-ответов**
4. **Реализуйте `destroy()` для очистки подписок и таймеров**
5. **Используйте `useLocalStore` вместо `useLocalObservable` из `mobx-react-lite`**
