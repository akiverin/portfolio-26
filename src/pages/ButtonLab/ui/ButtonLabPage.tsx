import { useEffect, useRef, useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import ActionButton, {
  ActionLink,
  SegmentedControl,
  type ActionVariant,
} from 'shared/ui/ActionButton';
import styles from './ButtonLabPage.module.scss';

const VARIANTS: { variant: Exclude<ActionVariant, 'icon'>; label: string; description: string }[] =
  [
    {
      variant: 'primary',
      label: 'Основное действие',
      description: 'Одно главное действие на блок. Спокойная сплошная заливка.',
    },
    {
      variant: 'secondary',
      label: 'Второе действие',
      description: 'Тонкий контур. Для альтернативного действия рядом с основным.',
    },
    {
      variant: 'tertiary',
      label: 'Дополнительно',
      description: 'Мягкая нейтральная подложка. Для вспомогательных инструментов.',
    },
    {
      variant: 'text',
      label: 'Узнать больше',
      description: 'Текстовая ссылка с шевроном. Подчёркивание при наведении.',
    },
  ];

export const ButtonLabPage = () => {
  const [surface, setSurface] = useState('light');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Нажмите основную кнопку, чтобы проверить загрузку.');
  const [placement, setPlacement] = useState('none');
  const [plan, setPlan] = useState('design');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const testAction = () => {
    setBusy(true);
    setStatus('Выполняется тестовый запрос…');
    timer.current = setTimeout(() => {
      setBusy(false);
      setStatus('Готово. Данные никуда не отправлялись.');
    }, 900);
  };
  const icon = <IconPlus size={17} aria-hidden="true" />;
  return (
    <main className={styles.lab} data-button-lab="" data-surface={surface}>
      <div className={styles.lab__wrapper}>
        <header className={styles.lab__header}>
          <span>andkiv / Interface</span>
          <ActionLink href="/" variant="text" chevron>
            На сайт
          </ActionLink>
        </header>
        <div className={styles.lab__intro}>
          <p>Компоненты интерфейса</p>
          <h1>
            Меньше шума.
            <br />
            Больше ясности.
          </h1>
          <p>
            Единая чёрно-белая система кнопок и ссылок. Размер, иерархия и состояние — без
            декоративных эффектов.
          </p>
        </div>
        <div className={styles.lab__toolbar}>
          <SegmentedControl
            label="Поверхность"
            value={surface}
            onChange={setSurface}
            options={[
              { value: 'light', label: 'Светлая' },
              { value: 'dark', label: 'Тёмная' },
            ]}
          />
          <label>
            Иконка
            <select
              aria-label="Положение иконки"
              value={placement}
              onChange={(event) => setPlacement(event.target.value)}
            >
              <option value="none">Без иконки</option>
              <option value="start">В начале</option>
              <option value="end">В конце</option>
              <option value="both">С двух сторон</option>
            </select>
          </label>
        </div>
        <div className={styles.lab__grid}>
          {VARIANTS.map(({ variant, label, description }) => (
            <section key={variant} className={styles.lab__card} data-example={variant}>
              <h2>{label}</h2>
              <p>{description}</p>
              <div className={styles.lab__states}>
                {(['default', 'disabled', 'loading'] as const).map((state) => (
                  <div key={state} data-state={state}>
                    <span>
                      {state === 'default'
                        ? 'Обычное'
                        : state === 'disabled'
                          ? 'Недоступно'
                          : 'Загрузка'}
                    </span>
                    <ActionButton
                      variant={variant}
                      chevron={variant === 'text'}
                      disabled={state === 'disabled'}
                      loading={
                        state === 'loading' ||
                        (variant === 'primary' && state === 'default' && busy)
                      }
                      onClick={testAction}
                      startIcon={placement === 'start' || placement === 'both' ? icon : undefined}
                      endIcon={placement === 'end' || placement === 'both' ? icon : undefined}
                    >
                      {label}
                    </ActionButton>
                  </div>
                ))}
              </div>
            </section>
          ))}
          <section className={styles.lab__card} data-example="icon">
            <h2>Круглые действия</h2>
            <p>Для закрытия, раскрытия и управления. У каждой кнопки есть доступное имя.</p>
            <div className={styles.lab__row}>
              <ActionButton
                variant="icon"
                aria-label="Добавить"
                onClick={() => setStatus('Добавление — тестовое действие.')}
              >
                <IconPlus size={20} />
              </ActionButton>
              <ActionButton
                variant="icon"
                aria-label="Закрыть пример"
                onClick={() => setStatus('Закрытие — тестовое действие.')}
              >
                <IconX size={20} />
              </ActionButton>
              <ActionButton variant="icon" aria-label="Недоступное действие" disabled>
                <IconPlus size={20} />
              </ActionButton>
              <ActionButton variant="icon" aria-label="Ожидание" loading>
                <IconPlus size={20} />
              </ActionButton>
            </div>
          </section>
          <section className={styles.lab__card}>
            <h2>Размеры</h2>
            <p>Компактные действия, стандартные CTA и крупные кнопки.</p>
            <div className={styles.lab__row}>
              {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                <ActionButton key={size} size={size} onClick={testAction}>
                  {size.toUpperCase()}
                </ActionButton>
              ))}
            </div>
          </section>
          <section className={styles.lab__card}>
            <h2>Сегментированный выбор</h2>
            <p>Нативная группа переключателей: Tab и стрелки на клавиатуре.</p>
            <SegmentedControl
              label="Направление"
              value={plan}
              onChange={setPlan}
              options={[
                { value: 'design', label: 'Дизайн' },
                { value: 'code', label: 'Разработка' },
              ]}
            />
          </section>
          <section className={styles.lab__card}>
            <h2>Раскрытие и ссылки</h2>
            <details className={styles.lab__disclosure}>
              <summary>Как это работает?</summary>
              <p>
                Компоненты сохраняют нативную семантику, клавиатурный фокус и настройку уменьшения
                движения.
              </p>
            </details>
            <div className={styles.lab__row}>
              <ActionLink href="/#projects" variant="text" chevron>
                Проекты
              </ActionLink>
              <ActionLink href="mailto:kiverin03@yandex.ru" variant="text">
                Написать
              </ActionLink>
              <ActionLink href="/auth" variant="secondary" disabled>
                Недоступная ссылка
              </ActionLink>
            </div>
          </section>
        </div>
        <form
          className={styles.lab__form}
          onSubmit={(event) => {
            event.preventDefault();
            setStatus('Форма отправлена локально.');
          }}
        >
          <label>
            Тестовое сообщение
            <input aria-label="Тестовое сообщение" placeholder="Проверить отправку по Enter" />
          </label>
          <ActionButton type="submit">Отправить</ActionButton>
        </form>
        <p className={styles.lab__status} role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </main>
  );
};
