"use client";

import styles from "./About.module.scss";
import Text from "components/Text";
import { useSearchParams } from "next/navigation";
import { useUrlParams } from "hooks/useUrlParams";
import React, { useCallback, useState } from "react";
import { SearchParams } from "entities/searchParams/model";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GrantListStore } from "entities/grants/stores/GrantListStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import GovScience from "components/icons/GovScience";
import Polytech from "components/icons/Polytech";
import Moscow from "components/icons/Moscow";
import Button from "components/Button";
import classNames from "classnames";
import photo from "@/assets/photo.jpg";
import Image from "next/image";

const AboutSection: React.FC = observer(() => {
  return (
    <section className={styles.about}>
      <div className={styles.about__info}>
        <Text tag="h2" view="title" weight="black" uppercase>
          Обо мне
        </Text>
        <div className={styles.about__content}>
          <Image width={150} height={200} src={photo} alt="Фотография" />
          <div className={styles.about__desc}>
            <Text tag="span">Привет, я Андрей Киверин.</Text>
            <Text tag="span">
              Мне {new Date().getFullYear() - 2003} года, я веб-разработчик,
              увлечённый веб-дизайном. С школьных лет я был редактором и
              верстальщиком школьной газеты — более шести лет я создавал её
              визуальный облик, и именно тогда зародилась моя любовь к верстке.
              Сегодня я разрабатываю корпоративные проекты, создаю дизайнерские
              макеты, сайты и мобильные приложения.
            </Text>{" "}
            <Text tag="span">
              Недавно я получил квалификацию разработчика нейросетей, а также
              окончил университет с отличием по специальности «Веб-разработка».
              Параллельно увлекаюсь научными исследованиями: участвую в
              конференциях и форумах, пишу и публикую научные статьи.
            </Text>{" "}
            <Text tag="span">
              Моя увлечение создавать новые цифровые пространства проявляется в
              каждом проекте. Я постоянно стремлюсь учиться, расти и расширять
              свои горизонты.
            </Text>{" "}
            <Text tag="span">
              Давайте сотрудничать — вместе мы сможем достичь большего.
            </Text>
            <Text>
              [Связаться со мной]
              <Button href="tel:89531370800">+7(953)-137-08-00</Button>
            </Text>
          </div>
        </div>
      </div>
      <div className={styles.about__details}>
        <div className={styles.about__block}>
          <Text tag="h3" view="subtitle" weight="black" uppercase>
            Образование
          </Text>
          <div className={styles.about__eduItem}>
            <Text>Лицей информационных технологий №28 г.Киров.</Text>
            <Text color="secondary">2015 – 2021</Text>
          </div>
          <div className={styles.about__eduItem}>
            <Text>Московский политехнический университет.</Text>
            <Text>
              Бакалавр с отличием: Информатика и вычислительная техника.
            </Text>
            <Text color="secondary">2021 – 2025</Text>
          </div>
          <div className={styles.about__eduItem}>
            <Text>Московский политехнический университет и Иннополис.</Text>
            <Text>
              Профессиональная переподготовка: Нейросетевые технологии
            </Text>
            <Text color="secondary">2024</Text>
          </div>
          <div className={styles.about__eduItem}>
            <Text>Московский политехнический университет.</Text>
            <Text>Магистратура: Информационные системы и технологии.</Text>
            <Text color="secondary">2025 – 2027</Text>
          </div>
        </div>
        <div className={styles.about__block}>
          <Text tag="h3" view="subtitle" weight="black" uppercase>
            Работа
          </Text>
          <div className={styles.about__workItem}>
            <Text>ООО «Студя КТС»</Text>
            <Text>Младший фронтенд разработчик</Text>
            <Text color="secondary">ноябрь 2025 – сейчас</Text>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
