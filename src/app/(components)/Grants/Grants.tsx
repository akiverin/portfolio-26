"use client";

import styles from "./Grants.module.scss";
import Text from "components/Text";
import { useSearchParams } from "next/navigation";
import { useUrlParams } from "hooks/useUrlParams";
import React, { useCallback, useEffect, useState } from "react";
import { SearchParams } from "entities/searchParams/model";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GrantListStore } from "entities/grants/stores/GrantListStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import GovScience from "components/icons/GovScience";
import Polytech from "components/icons/Polytech";
import Moscow from "components/icons/Moscow";
import Button from "components/Button";
import classNames from "classnames";

const GRANT_ICONS = {
  govScience: GovScience,
  polytech: Polytech,
  moscow: Moscow,
};

const GrantsSection: React.FC = observer(() => {
  const [isActive, setIsActive] = useState(false);
  const toggleActive = () => {
    setIsActive(!isActive);
  };
  const searchParams = useSearchParams();
  const { set: updateUrl } = useUrlParams();

  const handleUpdateUrl = useCallback(
    (updates: Partial<SearchParams>) => {
      const cleaned = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value != null)
      );
      updateUrl(cleaned);
    },
    [updateUrl]
  );

  const grantsListStore = useLocalObservable(
    () => new GrantListStore(new URLSearchParams(), handleUpdateUrl)
  );

  const formatMonthYear = (date: Date): string => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    grantsListStore.searchModel.initFromParams(params);
    grantsListStore.fetchAllGrants();
  }, [searchParams, grantsListStore]);

  return (
    <section className={styles.grants}>
      <div className={styles.grants__head}>
        <Text
          font="caveat"
          view="p-24"
          weight="medium"
          color="secondary"
          className={styles.grants__desc}
        >
          с 2022 по 2026 год
        </Text>
        <Text tag="h2" view="title" weight="black" uppercase>
          <span className={styles.grants__titleSpan}>
            Стипендии <br />и гранты
            <DotLottieReact
              className={styles.grants__decorate}
              src="https://lottie.host/32f3e8a4-7bfd-4d0f-8529-f58a3b4560fa/ISHaPO2vJn.lottie"
              autoplay
              loop
            />
          </span>
        </Text>
      </div>
      <ul
        className={classNames(
          styles.grants__content,
          isActive ? styles["grants__content--active"] : ""
        )}
      >
        {grantsListStore.grants.map((grant) => {
          return (
            <li key={grant.id} className={styles.grants__item}>
              <div className={styles.grants__titles}>
                <Text tag="h3" view="p-20">
                  {grant.title}
                </Text>
                <div className={styles.grants__details}>
                  {grant.icon && grant.icon in GRANT_ICONS
                    ? React.createElement(
                        GRANT_ICONS[grant.icon as keyof typeof GRANT_ICONS]
                      )
                    : null}{" "}
                  <Text view="p-16" color="secondary">
                    {grant.desc}
                  </Text>
                  <Text view="p-16" color="secondary">
                    •{" "}
                    {Number(grant.sum).toLocaleString("ru-RU", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    ₽
                  </Text>
                </div>
              </div>
              <div className={styles.grants__dates}>
                <Text view="p-14" color="secondary">
                  {formatMonthYear(
                    new Date(
                      grant.startDate.seconds * 1000 +
                        grant.startDate.nanoseconds / 1000000
                    )
                  )}
                </Text>
                <Text view="p-14" color="secondary">
                  {" – "}
                  {formatMonthYear(
                    new Date(
                      grant.endDate.seconds * 1000 +
                        grant.endDate.nanoseconds / 1000000
                    )
                  )}
                </Text>
              </div>
            </li>
          );
        })}
      </ul>
      <Button className={styles.grants__button} onClick={toggleActive}>
        {isActive ? "Скрыть" : "Показать все"}
      </Button>
    </section>
  );
});

export default GrantsSection;
