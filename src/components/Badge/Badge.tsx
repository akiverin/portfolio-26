import React from "react";
import styles from "./Badge.module.scss";
import classNames from "classnames";
import Text from "components/Text";
import Article from "components/icons/Article";
import Conference from "components/icons/Conference";
import Citation from "components/icons/Citation";
import Design from "components/icons/Design";
import Team from "components/icons/Team";
import Code from "components/icons/Code";
import Trophy from "components/icons/Trophy";
import Student from "components/icons/Student";

export type ColorsBadgeT =
  | "black"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "blue"
  | "yellow"
  | "sky"
  | "pink";

export type IconsBadgeT =
  | "article"
  | "conference"
  | "citation"
  | "design"
  | "team"
  | "trophy"
  | "student"
  | "code";

const ICONS = {
  article: <Article height={14} width={14} className={styles.badge__icon} />,
  conference: (
    <Conference height={14} width={14} className={styles.badge__icon} />
  ),
  citation: <Citation height={14} width={14} className={styles.badge__icon} />,
  design: <Design height={14} width={14} className={styles.badge__icon} />,
  team: <Team height={14} width={14} className={styles.badge__icon} />,
  trophy: <Trophy height={14} width={14} className={styles.badge__icon} />,
  student: <Student height={14} width={14} className={styles.badge__icon} />,
  code: <Code height={14} width={14} className={styles.badge__icon} />,
};

export type BadgeProps = {
  /** Дополнительный класс */
  className?: string;
  /** Название бейджа */
  title: string;
  /** Цвет бейджа */
  color?: ColorsBadgeT | null;
  /** Иконка бейджа */
  icon?: IconsBadgeT | null;
};

const Badge: React.FC<BadgeProps> = ({
  title,
  color = "black",
  icon,
  className,
}) => {
  const badgeClasses = classNames(
    styles.badge,
    className,
    styles[`badge--c-${color}`]
  );

  return (
    <div className={badgeClasses}>
      {icon && ICONS[icon]}
      <Text weight="medium" view="p-14" noWrap className={styles.badge__title}>
        {title}
      </Text>
    </div>
  );
};

export default Badge;
