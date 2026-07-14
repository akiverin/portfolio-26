# Стилевая система

## Технологии

- **SCSS Modules** — изоляция стилей на уровне компонентов
- **BEM** — методология именования классов
- **CSS Custom Properties** — тема инпутов
- **Mixins** — адаптивность, типографика, переходы

## Структура стилевых файлов

```
src/shared/styles/
├── _adaptive.scss    # Медиа-запросы (breakpoints)
├── _colors.scss      # Цветовые переменные
├── _fonts.scss       # Подключение шрифтов
├── _mixins.scss      # Утилитарные миксины
├── _sizes.scss       # Размеры, отступы, радиусы
└── global.scss       # Глобальные стили (reset, body)
```

## Цветовая палитра

### Основные цвета

| Переменная | Значение | Назначение |
| --- | --- | --- |
| `$brand` | `#42bdda` | Основной акцентный (бирюзовый) |
| `$black` | `#1a1a1a` | Основной текст |
| `$white` | `#ffffff` | Фоны, контрастный текст |
| `$project-bg` | `#f0f0f0` | Фон карточек и секций |

### Кнопки

| Переменная | Назначение |
| --- | --- |
| `$button-primary-bg` | Фон основной кнопки (градиент) |
| `$button-accent-bg` | Фон акцентной кнопки (бирюзовый градиент) |
| `$button-dark-bg` | Фон тёмной кнопки |

## Адаптивные точки перелома

```scss
$laptop: 1024px;
$tablet: 768px;
$phone: 480px;
```

### Миксины

```scss
@include smallerThanLaptop  // @media (max-width: 1023px)
@include smallerThanTablet  // @media (max-width: 767px)
@include phone              // @media (max-width: 479px)
```

## Ключевые миксины

### wrapper

```scss
@include wrapper;
```
Устанавливает `max-width`, `padding` и `margin: 0 auto` для контейнера.
На мобильных уменьшает боковые отступы.

### fontSize

```scss
@include fontSize(60px, $min-ratio: 0.6);
```
Генерирует `font-size` с `clamp()` для плавного масштабирования.
- Первый аргумент — базовый размер (desktop)
- `$min-ratio` — коэффициент минимального размера (для мобильных)

### transition

```scss
@include transition(background-image, color, transform);
```
Генерирует `transition` для перечисленных свойств с единой длительностью и easing.

## CSS-переменные для форм

Инпуты и текстовые поля стилизуются через CSS-переменные, которые задаются на уровне формы-контейнера:

```scss
.form {
  --input-bg: rgb(0 0 0 / 4%);
  --input-text: #1a1a1a;
  --input-placeholder: #999;
  --input-bg-disabled: #f0f0f0;
  --input-text-disabled: #aaa;
}
```

Это позволяет переключать тему инпутов в зависимости от фона секции.

## BEM-конвенции

### Корневой класс

```scss
.projectCard {
  // или .root для простых компонентов
}
```

### Элементы

```scss
&__cover { }
&__info { }
&__actions { }
```

### Модификаторы

```scss
&--loading { }
&--accent { }
&--disabled { }
```

### Паттерн `$self`

Для ссылки на корневой класс внутри вложенных правил:

```scss
.button {
  $self: &;

  &--accent {
    &:not(#{$self}--loading):hover {
      // стили
    }
  }
}
```

## Анимации

### CSS-анимации (keyframes)

- `auth-float-1`, `auth-float-2` — плавающие градиентные сферы на страницах авторизации
- `profile-float-1`, `profile-float-2` — аналогично на странице профиля
- `pulse-ring` — пульсация иконок таймлайна в секции «Обо мне»

### Framer Motion

- `FadeIn` — появление при скролле
- `motion.div` с `variants` — анимация карточек при появлении
- `AnimatePresence` — анимация появления/исчезновения (модальные окна, dropdown)

## Рекомендации по стилям

1. **Не использовать inline-стили** — только SCSS Modules
2. **Не использовать !important** без крайней необходимости
3. **Использовать миксины** для адаптивности вместо сырых media-запросов
4. **Импортировать стили через `@use`** вместо `@import`
5. **Проверять stylelint** перед коммитом: `pnpm stylelint`
