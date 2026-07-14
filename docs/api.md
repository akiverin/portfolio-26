# API и интеграции

## Firebase

### Конфигурация

Файл: `shared/api/firebase.ts`

Переменные окружения (`.env.local`):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Firestore — структура коллекций

#### `users`
```
{
  id: string          // Firebase Auth UID
  email: string
  displayName: string
  photoURL: string | null
  role: 'user' | 'admin'
  createdAt: Timestamp
}
```

#### `projects`
```
{
  id: string          // auto-generated
  title: string
  desc: string
  date: Timestamp
  coverType: 'image' | 'video'
  cover: string       // имя файла (относительный путь)
  link?: string       // URL проекта
  github?: string     // URL репозитория
  behance?: string    // URL Behance
  disabled?: boolean  // неактивная ссылка
}
```

#### `achievements`
```
{
  id: string
  title: string
  desc: string
  date: Timestamp
  cover: string
  link?: string
  badges: DocumentReference[]  // ссылки на документы в коллекции badges
}
```

#### `badges`
```
{
  id: string
  title: string
  color?: string
  icon?: string
}
```

#### `grants`
```
{
  id: string
  title: string
  desc: string
  year: string
  amount: string
  link?: string
}
```

#### `contacts`
```
{
  id: string
  name: string
  email: string
  message: string
  createdAt: Timestamp
}
```

## API-функции

### Общие хелперы

**Файл:** `shared/api/firestoreHelpers.ts`

| Функция | Описание |
| --- | --- |
| `fetchCollection(name, constraints, mapper)` | Получить все документы коллекции |
| `fetchDocument(name, docId, mapper)` | Получить один документ по ID |
| `fetchPaginatedCollection(name, page, pageSize, cursors, mapper, constraints)` | Курсорная пагинация |

Все функции возвращают `BaseResponse<T>` — обёртку с флагом `isError`.

### Проекты

| Функция | Файл | Описание |
| --- | --- | --- |
| `getAllProjects()` | `entities/Project/api/getAllProjects.ts` | Все проекты, сортировка по дате desc |
| `getProjectById(id)` | `entities/Project/api/getProjectById.ts` | Проект по ID |
| `snapshotToProject(snap)` | `entities/Project/api/snapshotToProject.ts` | Маппер Firestore → Project |

### Достижения

| Функция | Файл | Описание |
| --- | --- | --- |
| `getAllAchievements(field, dir)` | `entities/Achievement/api/getAllAchievements.ts` | Все достижения с сортировкой |
| `getAchievementById(id)` | `entities/Achievement/api/getAchievementById.ts` | Достижение по ID |
| `snapshotToAchievement(snap)` | `entities/Achievement/api/snapshotToAchievement.ts` | Маппер с resolve бейджей |
| `resolveBadges(refs)` | `entities/Achievement/api/resolveBadges.ts` | Разрешение ссылок на бейджи |

Бейджи кэшируются в памяти (`badgeCache: Map<string, Badge>`) для избежания N+1 запросов.

### Пользователи

| Функция | Файл | Описание |
| --- | --- | --- |
| `signInWithEmail(email, pass)` | `entities/User/api/authApi.ts` | Вход |
| `signUpWithEmail(email, pass, name)` | `entities/User/api/authApi.ts` | Регистрация |
| `signInWithGooglePopup()` | `entities/User/api/authApi.ts` | Google OAuth |
| `signOutFirebase()` | `entities/User/api/authApi.ts` | Выход |
| `resetPasswordEmail(email)` | `entities/User/api/authApi.ts` | Сброс пароля |
| `deleteAccountFromFirebase()` | `entities/User/api/authApi.ts` | Удаление аккаунта |
| `ensureUserDoc(uid, defaults)` | `entities/User/api/userProfileApi.ts` | Создание/получение профиля |
| `getUserProfileFromFirestore(uid)` | `entities/User/api/userProfileApi.ts` | Получение профиля |
| `updateUserProfileInFirestore(uid, data)` | `entities/User/api/userProfileApi.ts` | Обновление профиля |
| `deleteUserProfileFromFirestore(uid)` | `entities/User/api/userProfileApi.ts` | Удаление документа профиля |

### Контакты

| Функция | Файл | Описание |
| --- | --- | --- |
| `sendContactMessage(data)` | `features/contact/api/sendContactMessage.ts` | Отправка формы обратной связи |

## Экспорт данных

**Файл:** `shared/lib/exportAchievements.ts`

Поддерживаемые форматы:
- **TXT** — список достижений в текстовом формате
- **CSV** — таблица с заголовками (UTF-8 BOM для корректного открытия в Excel)
- **Excel** — XLSX через библиотеку `xlsx`
- **ZIP** — текстовый файл + папка с изображениями обложек

Фильтрация по дате:
- `year` — за последний год (скользящее окно от текущей даты)
- `2years` — за последние 2 года (скользящее окно)
- `all` — все достижения

## Обработка ошибок

Все API-функции возвращают `BaseResponse<T>`:

```typescript
const response = await getAllProjects();
if (response.isError) {
  // обработка ошибки
  return;
}
// response.data доступен
```

Сторы обрабатывают ошибки через `BaseStore.setError()` и отображают через `store.error`.
