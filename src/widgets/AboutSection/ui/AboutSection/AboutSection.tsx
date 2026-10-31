import { useState } from 'react';
import { SegmentedControl } from 'shared/ui/ActionButton';
import photo from 'assets/about/andrey-sunset.webp';
import styles from './AboutSection.module.scss';

type JourneyEntry = { period: string; title: string; subtitle: string };

const EDUCATION: JourneyEntry[] = [
  {
    period: '2015 — 2021',
    title: 'Лицей информационных технологий №28 г. Киров',
    subtitle: 'Инженерно-технический профиль',
  },
  {
    period: '2021 — 2025',
    title: 'Московский политехнический университет',
    subtitle: 'Бакалавриат с отличием · Информатика и вычислительная техника',
  },
  {
    period: '2024',
    title: 'Московский политех и Иннополис',
    subtitle: 'Профессиональная переподготовка · Нейросетевые технологии',
  },
  {
    period: '2025 — 2027',
    title: 'Московский политехнический университет',
    subtitle: 'Магистратура · Информационные системы и технологии',
  },
];

const WORK: JourneyEntry[] = [
  {
    period: '2021 — сейчас',
    title: 'Проектная практика',
    subtitle: 'Веб-продукты, интерфейсы и мобильные приложения — от идеи до запуска',
  },
  {
    period: '2025 — сейчас',
    title: 'Студия КТС',
    subtitle: 'Младший frontend-разработчик · Коммерческие веб-продукты',
  },
];

const ROLES = ['UI/UX дизайнер', 'Full-stack разработчик', 'Начинающий аналитик'] as const;

const AboutSection = () => {
  const [journey, setJourney] = useState('education');
  const entries = journey === 'education' ? [...EDUCATION].reverse() : [...WORK].reverse();
  return (
    <section className={styles.about} id="about" aria-labelledby="about-title">
      <header className={styles.about__header}>
        <h2 id="about-title">Обо мне</h2>
      </header>
      <div className={styles.about__top}>
        <div className={styles.about__photoWrap}>
          <img
            src={photo}
            alt="Андрей Киверин на фоне гор и подсолнухов на закате"
            width={940}
            height={940}
            decoding="async"
            loading="lazy"
            className={styles.about__photo}
          />
          <span className={styles.about__photoCaption}>Frontend developer, Moscow</span>
        </div>
        <div className={styles.about__intro}>
          <h3 className={styles.about__statement}>Frontend-разработчик</h3>
          <p className={styles.about__bio}>
            Работаю с React и TypeScript. Занимаюсь разработкой сайтов и интерфейсов, изучаю
            технологии ИИ. Работаю в студии КТС, учусь в магистратуре Московского политеха.
          </p>
          <ul className={styles.about__roles} aria-label="Другие навыки">
            {ROLES.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.about__journey}>
        <div className={styles.about__journeyHeader}>
          <h3>Образование и опыт</h3>
          <SegmentedControl
            label="Образование и опыт"
            value={journey}
            onChange={setJourney}
            options={[
              { value: 'education', label: 'Образование' },
              { value: 'experience', label: 'Опыт' },
            ]}
            compact
          />
        </div>
        <ul
          className={styles.about__journeyList}
          aria-label={journey === 'education' ? 'Образование' : 'Опыт работы'}
        >
          {entries.map((entry) => (
            <li key={entry.period + entry.title}>
              <span className={styles.about__period}>{entry.period}</span>
              <div>
                <h4>{entry.title}</h4>
                <p>{entry.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default AboutSection;
