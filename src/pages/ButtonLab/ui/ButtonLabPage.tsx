import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { LightningIcon } from '@phosphor-icons/react/dist/csr/Lightning';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';
import ActionButton, { type ActionButtonSize, type ButtonDesign } from 'shared/ui/ActionButton';
import { ROUTES } from 'shared/configs/routes';
import logo from 'assets/brand/logo-07-blue.svg';
import styles from './ButtonLabPage.module.scss';

const DIRECTIONS: {
  id: ButtonDesign;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  radius: number;
}[] = [
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Чистая форма',
    description: 'Яркий оранжевый акцент, глубокий синий и спокойная геометрия.',
    color: '#ff7900',
    radius: 10,
  },
  {
    id: 'cobalt',
    title: 'Cobalt',
    subtitle: 'Синий в главной роли',
    description: 'Насыщенная заливка и чёткий контур. Самый сдержанный вариант.',
    color: '#1246ce',
    radius: 8,
  },
  {
    id: 'press',
    title: 'Press',
    subtitle: 'Ощутимое нажатие',
    description: 'Жёсткая нижняя грань. При нажатии кнопка мягко уходит в основание.',
    color: '#ff8d28',
    radius: 6,
  },
  {
    id: 'circuit',
    title: 'Circuit',
    subtitle: 'Инженерный характер',
    description: 'Двойной контур, моноширинный шрифт и почти прямые углы.',
    color: '#ff8a1c',
    radius: 4,
  },
  {
    id: 'film',
    title: 'Film',
    subtitle: 'Кинематографичный свет',
    description: 'Эмалевый свет и один плавный блик при наведении. В ритме Hero.',
    color: '#ff8120',
    radius: 12,
  },
];

const ICONS = {
  arrow: ArrowRightIcon,
  diagonal: ArrowUpRightIcon,
  lightning: LightningIcon,
  plus: PlusIcon,
};
type IconName = keyof typeof ICONS;
type Placement = 'start' | 'end' | 'both' | 'none';

export const ButtonLabPage = () => {
  const [size, setSize] = useState<ActionButtonSize>('md');
  const [placement, setPlacement] = useState<Placement>('end');
  const [icon, setIcon] = useState<IconName>('arrow');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState<ButtonDesign | null>('film');
  const [pressed, setPressed] = useState<Partial<Record<ButtonDesign, boolean>>>({});
  const [busy, setBusy] = useState<ButtonDesign | null>(null);
  const [status, setStatus] = useState('Нажмите на кнопку, чтобы проверить её в действии.');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CurrentIcon = ICONS[icon];
  const leading = placement === 'start' || placement === 'both' ? <CurrentIcon /> : undefined;
  const trailing = placement === 'end' || placement === 'both' ? <CurrentIcon /> : undefined;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const simulateRequest = (design: ButtonDesign) => {
    if (timer.current) clearTimeout(timer.current);
    setBusy(design);
    setStatus(`${design}: выполняется тестовый запрос…`);
    timer.current = setTimeout(() => {
      setBusy(null);
      setStatus(`${design}: готово. Тестовый запрос завершён.`);
      timer.current = null;
    }, 1100);
  };

  return (
    <main className={styles.lab} data-button-lab="">
      <div className={styles.lab__wrapper}>
        <header className={styles.lab__header}>
          <Link to={ROUTES.HOME} aria-label="andkiv — на главную">
            <img src={logo} width={142} height={40} alt="andkiv" />
          </Link>
          <span className={styles.lab__edition}>
            INTERFACE STUDIES <span>/</span> 01
          </span>
          <Link to={ROUTES.HOME} className={styles.lab__back}>
            На сайт <ArrowUpRightIcon size={16} />
          </Link>
        </header>

        <div className={styles.lab__intro}>
          <div>
            <p className={styles.lab__eyebrow}>andkiv / Button playground</p>
            <h1>
              Характер —<br />в деталях<span>.</span>
            </h1>
          </div>
          <div className={styles.lab__introCopy}>
            <p>Пять направлений. Один компонент.</p>
            <p>
              Контрастные синие и оранжевые цвета, углы от 4 до 12 px. Попробуйте наведение, нажатие
              и фокус через Tab.
            </p>
            <span>Film — текущий стиль сайта · остальные варианты для сравнения</span>
          </div>
        </div>

        <form
          className={styles.lab__controls}
          onSubmit={(event) => event.preventDefault()}
          aria-label="Настройки примеров"
        >
          <label>
            Размер
            <select
              aria-label="Размер"
              value={size}
              onChange={(e) => setSize(e.target.value as ActionButtonSize)}
            >
              <option value="sm">Small · 38 px</option>
              <option value="md">Medium · 46 px</option>
              <option value="lg">Large · 54 px</option>
            </select>
          </label>
          <label>
            Иконка
            <select
              aria-label="Иконка"
              value={icon}
              onChange={(e) => setIcon(e.target.value as IconName)}
            >
              <option value="arrow">Стрелка</option>
              <option value="diagonal">По диагонали</option>
              <option value="lightning">Молния</option>
              <option value="plus">Плюс</option>
            </select>
          </label>
          <label>
            Положение
            <select
              aria-label="Положение"
              value={placement}
              onChange={(e) => setPlacement(e.target.value as Placement)}
            >
              <option value="end">В конце</option>
              <option value="start">В начале</option>
              <option value="both">С двух сторон</option>
              <option value="none">Без иконки</option>
            </select>
          </label>
          <div className={styles.lab__switches}>
            <label>
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              Disabled
            </label>
            <label>
              <input
                type="checkbox"
                checked={loading}
                onChange={(e) => setLoading(e.target.checked)}
              />
              Loading
            </label>
            <label>
              <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
              Тёмный фон
            </label>
          </div>
        </form>

        <p className={styles.lab__status} role="status" aria-live="polite">
          <span aria-hidden="true" />
          {status}
        </p>

        <div className={styles.lab__directions}>
          {DIRECTIONS.map((direction, index) => (
            <section
              key={direction.id}
              className={styles.direction}
              aria-labelledby={`direction-${direction.id}`}
              data-direction={direction.id}
              data-selected={selected === direction.id || undefined}
            >
              <div className={styles.direction__heading}>
                <span className={styles.direction__number}>0{index + 1}</span>
                <div>
                  <h2 id={`direction-${direction.id}`}>
                    {direction.title}
                    <span>{direction.subtitle}</span>
                  </h2>
                  <p>{direction.description}</p>
                </div>
                <div className={styles.direction__meta}>
                  <span>
                    <i style={{ backgroundColor: direction.color }} />
                    {direction.color.toUpperCase()}
                  </span>
                  <span>R {direction.radius} px</span>
                  <button
                    type="button"
                    className={styles.direction__pick}
                    aria-pressed={selected === direction.id}
                    onClick={() => {
                      setSelected(direction.id);
                      setStatus(`Выбран ${direction.title}. Это только выбор в макете.`);
                    }}
                  >
                    {selected === direction.id ? (
                      <>
                        <CheckIcon size={14} /> Выбран
                      </>
                    ) : (
                      'Выбрать'
                    )}
                  </button>
                </div>
              </div>

              <div
                className={styles.direction__surface}
                data-dark={dark || direction.id === 'circuit' || undefined}
              >
                <div className={styles.direction__labels}>
                  <span>Состояние</span>
                  <span>Primary</span>
                  <span>Secondary</span>
                  <span>Icon button</span>
                </div>
                {(['default', 'disabled', 'loading'] as const).map((state) => {
                  const isDefault = state === 'default';
                  const isDisabled = state === 'disabled' || (isDefault && disabled);
                  const isLoading =
                    state === 'loading' || (isDefault && (loading || busy === direction.id));
                  const common = {
                    design: direction.id,
                    size,
                    disabled: isDisabled,
                    loading: isLoading,
                  };
                  return (
                    <div key={state} className={styles.direction__row} data-state={state}>
                      <span className={styles.direction__state}>
                        {isDefault ? (
                          <>
                            <b />
                            Попробуйте
                          </>
                        ) : state === 'disabled' ? (
                          'Disabled'
                        ) : (
                          'Loading'
                        )}
                      </span>
                      <div>
                        <ActionButton
                          {...common}
                          variant="primary"
                          startIcon={leading}
                          endIcon={trailing}
                          onClick={() => simulateRequest(direction.id)}
                        >
                          Смотреть проекты
                        </ActionButton>
                      </div>
                      <div>
                        <ActionButton
                          {...common}
                          variant="secondary"
                          startIcon={leading}
                          endIcon={trailing}
                          onClick={() =>
                            setStatus(`${direction.title}: secondary — клик зарегистрирован.`)
                          }
                        >
                          Обсудить проект
                        </ActionButton>
                      </div>
                      <div>
                        <ActionButton
                          {...common}
                          variant="icon"
                          aria-label={`Отметить ${direction.title}`}
                          aria-pressed={Boolean(pressed[direction.id])}
                          title={`Отметить ${direction.title}`}
                          onClick={() => {
                            setPressed((value) => ({
                              ...value,
                              [direction.id]: !value[direction.id],
                            }));
                            setStatus(`${direction.title}: icon button — состояние переключено.`);
                          }}
                        >
                          {pressed[direction.id] ? <CheckIcon /> : <CurrentIcon />}
                        </ActionButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section className={styles.lab__usage} aria-labelledby="usage-title">
          <div>
            <p className={styles.lab__eyebrow}>Один API / любая иконка</p>
            <h2 id="usage-title">Готовы к настоящему интерфейсу.</h2>
            <p>
              Иконки принимаются как ReactNode. Поддерживаются нативные атрибуты кнопки, ref, type,
              form, aria-pressed, размеры и ширина контейнера.
            </p>
          </div>
          <pre>
            <code>{`<ActionButton\n  design="${selected ?? 'studio'}"\n  variant="primary"\n  startIcon={<PlusIcon />}\n  endIcon={<ArrowRightIcon />}\n  loading={isPending}\n  disabled={!isValid}\n>\n  Смотреть проекты\n</ActionButton>`}</code>
          </pre>
        </section>

        <form
          className={styles.lab__formTest}
          onSubmit={(event) => {
            event.preventDefault();
            setStatus('Форма отправлена локально. Нативный type="submit" работает.');
          }}
        >
          <div>
            <h2>Проверка формы</h2>
            <p>Введите текст и нажмите Enter. Данные никуда не отправляются.</p>
          </div>
          <label>
            <span className={styles.lab__srOnly}>Тестовое сообщение</span>
            <input name="message" required placeholder="Тестовое сообщение" />
          </label>
          <ActionButton design={selected ?? 'studio'} type="submit" endIcon={<ArrowRightIcon />}>
            Проверить
          </ActionButton>
        </form>
        <footer className={styles.lab__footer}>
          <span>andkiv · UI explorations</span>
          <span>01—05 / choose your character</span>
        </footer>
      </div>
    </main>
  );
};
