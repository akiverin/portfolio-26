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
    icon: <Briefcase width={18} height={18} />,
    period: 'ноябрь 2025 – сейчас',
    title: 'ООО «Студия КТС»',
    subtitle: 'Младший фронтенд разработчик',
  },
];

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
          <FadeIn direction="left" delay={0.1}>
            <div className={styles.about__photoWrap}>
              <img
                src={photo}
                alt="Фотография Андрея Киверина"
                className={styles.about__photo}
                loading="lazy"
              />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className={styles.about__bio}>
              <Text tag="p" view="p-20" weight="medium">
                Привет, я Андрей Киверин!
              </Text>
              <Text tag="p" view="p-16">
                Мне 22 года, и я занимаюсь веб-разработкой с акцентом на дизайн и
                пользовательский опыт. Ещё в школе увлёкся вёрсткой — более шести лет создавал
                школьную газету и с тех пор полюбил превращать идеи в красивые интерфейсы.
              </Text>
              <Text tag="p" view="p-16">
                Сейчас разрабатываю корпоративные продукты, создаю дизайн-макеты, сайты и мобильные
                приложения. Окончил бакалавриат с красным дипломом и получил дополнительную
                квалификацию в области нейросетей.
              </Text>
              <Text tag="p" view="p-16">
                Помимо разработки, увлекаюсь наукой — участвую в конференциях, публикую статьи и
                стараюсь привносить исследовательский подход в каждый проект.
              </Text>
            </div>
          </FadeIn>
        </div>

        <div className={styles.about__bottom}>
          <FadeIn delay={0.1}>
            <div className={styles.about__block}>
              <Text tag="h3" view="p-24" weight="bold">
                Образование
              </Text>
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

          <FadeIn delay={0.2}>
            <div className={styles.about__block}>
              <Text tag="h3" view="p-24" weight="bold">
                Работа
              </Text>
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
