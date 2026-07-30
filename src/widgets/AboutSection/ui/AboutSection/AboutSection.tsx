import { motion } from 'framer-motion';
import { IconArrowUpRight, IconRoute, IconSparkles } from '@tabler/icons-react';
import styles from './AboutSection.module.scss';
import Text from 'shared/ui/Text';
import photo from 'assets/photo-optimized.jpg';
import Student from 'shared/ui/icons/Student';
import Code from 'shared/ui/icons/Code';
import Briefcase from 'shared/ui/icons/Briefcase';
import FadeIn from 'shared/ui/FadeIn';

type JourneyEntry = {
  icon: React.ReactNode;
  period: string;
  title: string;
  subtitle: string;
};

const EDUCATION: JourneyEntry[] = [
  {
    icon: <Student width={18} height={18} />,
    period: '2015 — 2021',
    title: 'Лицей информационных технологий №28 г. Киров',
    subtitle: 'Инженерно-технический профиль',
  },
  {
    icon: <Student width={18} height={18} />,
    period: '2021 — 2025',
    title: 'Московский политехнический университет',
    subtitle: 'Бакалавриат с отличием · Информатика и вычислительная техника',
  },
  {
    icon: <Code width={18} height={18} />,
    period: '2024',
    title: 'Московский политех и Иннополис',
    subtitle: 'Профессиональная переподготовка · Нейросетевые технологии',
  },
  {
    icon: <Student width={18} height={18} />,
    period: '2025 — 2027',
    title: 'Московский политехнический университет',
    subtitle: 'Магистратура · Информационные системы и технологии',
  },
];

const WORK: JourneyEntry[] = [
  {
    icon: <Code width={18} height={18} />,
    period: '2021 — сейчас',
    title: 'Проектная практика',
    subtitle: 'Веб-продукты, интерфейсы и мобильные приложения — от идеи до запуска',
  },
  {
    icon: <Briefcase width={18} height={18} />,
    period: '2025 — сейчас',
    title: 'Студия КТС',
    subtitle: 'Младший frontend-разработчик · Коммерческие веб-продукты',
  },
];

const FOCUS_AREAS = [
  { title: 'Frontend', caption: 'React · TypeScript · архитектура' },
  { title: 'Product design', caption: 'UX-сценарии · UI-системы' },
  { title: 'AI workflows', caption: 'Инструменты · автоматизация' },
  { title: 'Research', caption: 'Гипотезы · данные · выводы' },
] as const;

const stepVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 24,
      stiffness: 115,
      delay: index * 0.07,
    },
  }),
};

const EducationStep: React.FC<{ entry: JourneyEntry; index: number }> = ({ entry, index }) => (
  <motion.article
    className={styles.education__step}
    variants={stepVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    custom={index}
  >
    <div className={styles.education__stepTop}>
      <Text tag="span" view="p-12" className={styles.education__stepIndex}>
        {String(index + 1).padStart(2, '0')}
      </Text>
      <Text tag="span" view="p-12" className={styles.education__period}>
        {entry.period}
      </Text>
    </div>
    <div className={styles.education__icon}>{entry.icon}</div>
    <div className={styles.education__copy}>
      <Text tag="h4" view="p-18" weight="bold">
        {entry.title}
      </Text>
      <Text tag="p" view="p-12">
        {entry.subtitle}
      </Text>
    </div>
  </motion.article>
);

const AboutSection: React.FC = () => {
  return (
    <section className={styles.about} id="about">
      <div className={styles.about__container}>
        <FadeIn>
          <div className={styles.about__header}>
            <Text tag="span" view="p-12" className={styles.about__headerIndex}>
              01 · Profile
            </Text>
            <Text tag="h2" view="title" weight="black" uppercase>
              Обо мне
            </Text>
          </div>
        </FadeIn>

        <div className={styles.about__top}>
          <FadeIn direction="left" delay={0.1} className={styles.about__profileColumn}>
            <motion.div
              className={styles.about__profileCard}
              whileHover={{ rotate: -0.4 }}
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
              <div className={styles.about__introTopline}>
                <Text tag="span" view="p-12" className={styles.about__kicker}>
                  <IconSparkles size={14} stroke={1.6} /> Разработка × дизайн
                </Text>
                <Text tag="span" view="p-12" className={styles.about__availability}>
                  Открыт новым задачам
                </Text>
              </div>

              <Text tag="h3" view="p-32" weight="bold" className={styles.about__statement}>
                Проектирую интерфейсы, где логика ощущается так же хорошо, как визуальный слой.
              </Text>

              <div className={styles.about__bio}>
                <Text tag="span" view="p-12" className={styles.about__bioIndex}>
                  A/01
                </Text>
                <Text tag="p" view="p-16">
                  Создаю сайты, корпоративные продукты и мобильные интерфейсы — исследую задачу,
                  нахожу ясную структуру и довожу решение до аккуратной реализации. Техническое
                  образование помогает смотреть на продукт как на систему, а дизайн — делать эту
                  систему понятной человеку.
                </Text>
              </div>

              <div className={styles.about__focusGrid} aria-label="Основные компетенции">
                {FOCUS_AREAS.map((area, index) => (
                  <motion.div
                    key={area.title}
                    className={styles.about__focusItem}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.18 + index * 0.06 }}
                  >
                    <Text tag="span" view="p-12" className={styles.about__focusIndex}>
                      0{index + 1}
                    </Text>
                    <div>
                      <Text tag="h4" view="p-16" weight="bold">
                        {area.title}
                      </Text>
                      <Text tag="span" view="p-12">
                        {area.caption}
                      </Text>
                    </div>
                    <IconArrowUpRight size={16} stroke={1.5} />
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className={styles.about__journey}>
          <div className={styles.about__journeyHeader}>
            <div>
              <Text tag="span" view="p-12" className={styles.about__kicker}>
                <IconRoute size={15} stroke={1.6} /> Траектория
              </Text>
              <Text tag="h3" view="p-28" weight="bold">
                Образование и опыт
              </Text>
            </div>
            <Text tag="p" view="p-14">
              Последовательный путь от технической базы к продуктовой разработке.
            </Text>
          </div>

          <div className={styles.about__journeyGrid}>
            <FadeIn delay={0.08} className={styles.about__educationPanel}>
              <div className={styles.about__panelHeader}>
                <span className={styles.about__panelIcon}>
                  <Student width={18} height={18} />
                </span>
                <div>
                  <Text tag="h3" view="p-20" weight="bold">
                    Образование
                  </Text>
                  <Text tag="span" view="p-12">
                    4 последовательных этапа
                  </Text>
                </div>
              </div>

              <div className={styles.education}>
                {EDUCATION.map((entry, index) => (
                  <EducationStep
                    key={`${entry.period}-${entry.title}`}
                    entry={entry}
                    index={index}
                  />
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.16} className={styles.about__experiencePanel}>
              <div className={styles.about__panelHeader}>
                <span className={styles.about__panelIcon}>
                  <Briefcase width={18} height={18} />
                </span>
                <div>
                  <Text tag="h3" view="p-20" weight="bold">
                    Практика
                  </Text>
                  <Text tag="span" view="p-12">
                    Проекты и коммерческий опыт
                  </Text>
                </div>
              </div>

              <div className={styles.experience}>
                {WORK.map((entry, index) => (
                  <motion.article
                    key={`${entry.period}-${entry.title}`}
                    className={styles.experience__item}
                    variants={stepVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    custom={index}
                  >
                    <div className={styles.experience__topline}>
                      <Text tag="span" view="p-12">
                        {entry.period}
                      </Text>
                      {index === WORK.length - 1 && (
                        <Text tag="span" view="p-12">
                          Current
                        </Text>
                      )}
                    </div>
                    <div className={styles.experience__content}>
                      <span className={styles.experience__icon}>{entry.icon}</span>
                      <div>
                        <Text tag="h4" view="p-18" weight="bold">
                          {entry.title}
                        </Text>
                        <Text tag="p" view="p-12">
                          {entry.subtitle}
                        </Text>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
