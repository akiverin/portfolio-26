import { motion } from 'framer-motion';
import styles from './AboutSection.module.scss';
import Text from 'shared/ui/Text';
import photo from 'assets/photo.jpg';
import Student from 'shared/ui/icons/Student';
import Code from 'shared/ui/icons/Code';
import Briefcase from 'shared/ui/icons/Briefcase';
import FadeIn from 'shared/ui/FadeIn';

type TimelineEntry = {
  icon: React.ReactNode;
  period: string;
  title: string;
  subtitle?: string;
};

const EDUCATION: TimelineEntry[] = [
  {
    icon: <Student width={18} height={18} />,
    period: '2015 – 2021',
    title: 'Лицей информационных технологий №28 г. Киров',
  },
  {
    icon: <Student width={18} height={18} />,
    period: '2021 – 2025',
    title: 'Московский политехнический университет',
    subtitle: 'Бакалавр с отличием: Информатика и вычислительная техника',
  },
  {
    icon: <Code width={18} height={18} />,
    period: '2024',
    title: 'Московский политех и Иннополис',
    subtitle: 'Профессиональная переподготовка: Нейросетевые технологии',
  },
  {
    icon: <Student width={18} height={18} />,
    period: '2025 – 2027',
    title: 'Московский политехнический университет',
    subtitle: 'Магистратура: Информационные системы и технологии',
  },
];

const WORK: TimelineEntry[] = [
  {
    icon: <Code width={18} height={18} />,
    period: 'с 2021 года',
    title: 'Проектная практика',
    subtitle: 'Веб-продукты, дизайн интерфейсов и мобильные приложения',
  },
  {
    icon: <Briefcase width={18} height={18} />,
    period: 'ноябрь 2025 – сейчас',
    title: 'ООО «Студия КТС»',
    subtitle: 'Младший фронтенд разработчик',
  },
];

const FOCUS_AREAS = ['Frontend', 'UI/UX', 'AI-инструменты', 'Исследования'] as const;

const FACTS = [
  { value: '4+', label: 'года в цифровых проектах' },
  { value: '2', label: 'профильные квалификации' },
  { value: '360°', label: 'от идеи до интерфейса' },
] as const;

const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const TimelineItem: React.FC<{ entry: TimelineEntry; isLast?: boolean; index: number }> = ({
  entry,
  isLast = false,
  index,
}) => (
  <motion.div
    className={styles.timeline__item}
    variants={timelineItemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    custom={index}
    whileHover={{ x: 4 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    <div className={styles.timeline__marker}>
      <div className={styles.timeline__icon}>{entry.icon}</div>
      {!isLast && <div className={styles.timeline__line} />}
    </div>
    <div className={styles.timeline__content}>
      <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
        {entry.period}
      </Text>
      <Text tag="p" view="p-16" weight="medium">
        {entry.title}
      </Text>
      {entry.subtitle && (
        <Text tag="p" view="p-14" color="secondary">
          {entry.subtitle}
        </Text>
      )}
    </div>
  </motion.div>
);

const AboutSection: React.FC = () => {
  return (
    <section className={styles.about} id="about">
      <FadeIn>
        <div className={styles.about__header}>
          <Text
            font="caveat"
            view="p-24"
            weight="medium"
            color="secondary"
            className={styles.about__subtitle}
          >
            немного о себе
          </Text>
          <Text tag="h2" view="title" weight="black" uppercase>
            Обо мне
          </Text>
        </div>
      </FadeIn>

      <div className={styles.about__container}>
        <div className={styles.about__top}>
          <FadeIn direction="left" delay={0.1} className={styles.about__profileColumn}>
            <motion.div
              className={styles.about__profileCard}
              whileHover={{ y: -6, rotate: -0.4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className={styles.about__photoWrap}>
                <img
                  src={photo}
                  alt="Фотография Андрея Киверина"
                  className={styles.about__photo}
                  loading="lazy"
                />
                <div className={styles.about__photoShade} />
                <div className={styles.about__photoCaption}>
                  <span className={styles.about__statusDot} />
                  <Text tag="span" view="p-12" weight="medium">
                    Frontend developer · UI designer
                  </Text>
                </div>
              </div>
              <div className={styles.about__profileFooter}>
                <Text tag="span" view="p-12" color="secondary">
                  Moscow, RU
                </Text>
                <Text tag="span" view="p-12" weight="medium">
                  Создаю понятные продукты
                </Text>
              </div>
              <span className={styles.about__profileGlow} aria-hidden="true" />
            </motion.div>
          </FadeIn>

          <FadeIn direction="right" delay={0.16} className={styles.about__introColumn}>
            <div className={styles.about__intro}>
              <div className={styles.about__introLead}>
                <span className={styles.about__kicker}>Коротко обо мне</span>
                <Text tag="h3" view="p-32" weight="bold" className={styles.about__statement}>
                  Соединяю разработку, дизайн и исследовательский подход.
                </Text>
              </div>

              <div className={styles.about__bio}>
                <Text tag="p" view="p-16">
                  Я frontend-разработчик и дизайнер интерфейсов. Проектирую корпоративные продукты,
                  сайты и мобильные приложения — от структуры и прототипа до аккуратной реализации.
                </Text>
                <Text tag="p" view="p-16" color="secondary">
                  Окончил Московский Политех с красным дипломом и изучал нейросетевые технологии.
                  Научный опыт помогает проверять идеи, а не просто украшать их.
                </Text>
              </div>

              <ul className={styles.about__focusList} aria-label="Основные направления">
                {FOCUS_AREAS.map((area, index) => (
                  <motion.li
                    key={area}
                    className={styles.about__focusItem}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.24 + index * 0.06 }}
                  >
                    {area}
                  </motion.li>
                ))}
              </ul>

              <div className={styles.about__facts}>
                {FACTS.map((fact) => (
                  <div key={fact.value} className={styles.about__fact}>
                    <Text tag="span" view="p-24" weight="bold">
                      {fact.value}
                    </Text>
                    <Text tag="span" view="p-12" color="secondary">
                      {fact.label}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className={styles.about__bottom}>
          <FadeIn delay={0.1} className={styles.about__timelineColumn}>
            <div className={styles.about__block}>
              <div className={styles.about__blockHeader}>
                <span className={styles.about__blockIndex}>01</span>
                <Text tag="h3" view="p-24" weight="bold">
                  Образование
                </Text>
              </div>
              <div className={styles.timeline}>
                {EDUCATION.map((entry, i) => (
                  <TimelineItem
                    key={entry.period}
                    entry={entry}
                    isLast={i === EDUCATION.length - 1}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className={styles.about__timelineColumn}>
            <div className={styles.about__block}>
              <div className={styles.about__blockHeader}>
                <span className={styles.about__blockIndex}>02</span>
                <Text tag="h3" view="p-24" weight="bold">
                  Опыт
                </Text>
              </div>
              <div className={styles.timeline}>
                {WORK.map((entry, i) => (
                  <TimelineItem
                    key={entry.period}
                    entry={entry}
                    isLast={i === WORK.length - 1}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
