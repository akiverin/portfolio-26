'use client';

import styles from './AboutSection.module.scss';
import Text from 'shared/ui/Text';
import photo from 'assets/photo.jpg';
import Image from 'next/image';
import Student from 'shared/ui/icons/Student';
import Code from 'shared/ui/icons/Code';
import Briefcase from 'shared/ui/icons/Briefcase';

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
    title: 'Лицей информационных технологий №28 г.Киров',
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
    title: 'Московский политехнический университет и Иннополис',
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

const TimelineItem: React.FC<{ entry: TimelineEntry; isLast?: boolean }> = ({
  entry,
  isLast = false,
}) => (
  <div className={styles.timeline__item}>
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
  </div>
);

const AboutSection: React.FC = () => {
  return (
    <section className={styles.about} id="about">
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

      <div className={styles.about__container}>
        <div className={styles.about__top}>
          <div className={styles.about__photoWrap}>
            <Image
              width={280}
              height={360}
              src={photo}
              alt="Фотография Андрея Киверина"
              className={styles.about__photo}
            />
          </div>

          <div className={styles.about__bio}>
            <Text tag="p" view="p-20" weight="medium">
              Привет, я Андрей Киверин.
            </Text>
            <Text tag="p" view="p-16">
              Мне 22 года, я веб-разработчик, увлечённый
              веб-дизайном. С школьных лет я был редактором и верстальщиком школьной газеты — более
              шести лет я создавал её визуальный облик, и именно тогда зародилась моя любовь к
              верстке.
            </Text>
            <Text tag="p" view="p-16">
              Сегодня я разрабатываю корпоративные проекты, создаю дизайнерские макеты, сайты и
              мобильные приложения. Недавно получил квалификацию разработчика нейросетей и окончил
              университет с отличием по специальности «Веб-разработка».
            </Text>
            <Text tag="p" view="p-16">
              Параллельно увлекаюсь научными исследованиями: участвую в конференциях и форумах, пишу
              и публикую научные статьи. Моя страсть к созданию цифровых пространств проявляется в
              каждом проекте.
            </Text>
          </div>
        </div>

        <div className={styles.about__bottom}>
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
                />
              ))}
            </div>
          </div>

          <div className={styles.about__block}>
            <Text tag="h3" view="p-24" weight="bold">
              Работа
            </Text>
            <div className={styles.timeline}>
              {WORK.map((entry, i) => (
                <TimelineItem key={entry.period} entry={entry} isLast={i === WORK.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
