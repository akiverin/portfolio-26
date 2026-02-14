'use client';

import styles from './AboutSection.module.scss';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import photo from 'assets/photo.jpg';
import Image from 'next/image';

const AboutSection: React.FC = () => {
  return (
    <section className={styles.about} id="about">
      <div className={styles.about__header}>
        <Text tag="h2" view="title" weight="black" uppercase>
          Обо мне
        </Text>
        <Text
          tag="span"
          view="p-20"
          font="caveat"
          color="secondary"
          className={styles.about__subtitle}
        >
          Немного о себе
        </Text>
      </div>

      <div className={styles.about__grid}>
        <div className={styles.about__intro}>
          <div className={styles.about__card}>
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
              <Text tag="p" view="p-18" color="primary" weight="medium">
                Привет, я Андрей Киверин.
              </Text>
              <Text tag="p" view="p-16" color="primary">
                Мне {new Date().getFullYear() - 2003} года, я веб-разработчик, увлечённый
                веб-дизайном. С школьных лет я был редактором и верстальщиком школьной газеты — более
                шести лет я создавал её визуальный облик, и именно тогда зародилась моя любовь к
                верстке.
              </Text>
              <Text tag="p" view="p-16" color="primary">
                Сегодня я разрабатываю корпоративные проекты, создаю дизайнерские макеты, сайты и
                мобильные приложения. Недавно получил квалификацию разработчика нейросетей и окончил
                университет с отличием по специальности «Веб-разработка».
              </Text>
              <Text tag="p" view="p-16" color="primary">
                Параллельно увлекаюсь научными исследованиями: участвую в конференциях и форумах, пишу
                и публикую научные статьи. Моя страсть к созданию цифровых пространств проявляется в
                каждом проекте.
              </Text>
            </div>
          </div>

          <div className={styles.about__cta}>
            <Text tag="p" view="p-16" color="secondary">
              Давайте сотрудничать — вместе мы сможем достичь большего.
            </Text>
            <Button href="tel:89531370800">+7 (953) 137-08-00</Button>
          </div>
        </div>

        <div className={styles.about__sidebar}>
          <div className={styles.about__block}>
            <Text tag="h3" view="p-24" weight="bold" uppercase>
              Образование
            </Text>
            <div className={styles.about__timeline}>
              <div className={styles.about__timelineItem}>
                <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
                  2015 – 2021
                </Text>
                <Text tag="p" view="p-16" color="primary" weight="medium">
                  Лицей информационных технологий №28 г.Киров
                </Text>
              </div>

              <div className={styles.about__timelineItem}>
                <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
                  2021 – 2025
                </Text>
                <Text tag="p" view="p-16" color="primary" weight="medium">
                  Московский политехнический университет
                </Text>
                <Text tag="p" view="p-14" color="secondary">
                  Бакалавр с отличием: Информатика и вычислительная техника
                </Text>
              </div>

              <div className={styles.about__timelineItem}>
                <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
                  2024
                </Text>
                <Text tag="p" view="p-16" color="primary" weight="medium">
                  Московский политехнический университет и Иннополис
                </Text>
                <Text tag="p" view="p-14" color="secondary">
                  Профессиональная переподготовка: Нейросетевые технологии
                </Text>
              </div>

              <div className={styles.about__timelineItem}>
                <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
                  2025 – 2027
                </Text>
                <Text tag="p" view="p-16" color="primary" weight="medium">
                  Московский политехнический университет
                </Text>
                <Text tag="p" view="p-14" color="secondary">
                  Магистратура: Информационные системы и технологии
                </Text>
              </div>
            </div>
          </div>

          <div className={styles.about__block}>
            <Text tag="h3" view="p-24" weight="bold" uppercase>
              Работа
            </Text>
            <div className={styles.about__timeline}>
              <div className={styles.about__timelineItem}>
                <Text tag="span" view="p-12" color="accent" weight="medium" noWrap>
                  ноябрь 2025 – сейчас
                </Text>
                <Text tag="p" view="p-16" color="primary" weight="medium">
                  ООО «Студия КТС»
                </Text>
                <Text tag="p" view="p-14" color="secondary">
                  Младший фронтенд разработчик
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
