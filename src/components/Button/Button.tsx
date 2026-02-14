import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";
import Loader from "../Loader";
import Link, { LinkProps } from "next/link";

export type ButtonProps = {
  /** Содержимое кнопки */
  children: React.ReactNode;
  /** Если указан — рендерится как ссылка */
  href?: string;
  /** Тема кнопки */
  theme?: "dark" | "primary" | "accent";
  /** Статус загрузки */
  loading?: boolean;
  /** Наличие отступов */
  noPadding?: boolean;
  /** Дополнительный класс */
  className?: string;
  /** Целевой атрибут (для внешних ссылок) */
  target?: "_blank" | "_self";
  /** Пропсы только для кнопки */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Тип кнопки (только для <button>) */
  type?: "button" | "submit" | "reset";
  /** Отключена ли кнопка (игнорируется для ссылок) */
  disabled?: boolean;
  /** Любые другие пропсы для ссылки (если href задан) */
  linkProps?: Omit<LinkProps, "href" | "children">;
};

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  theme = "primary",
  loading = false,
  className,
  target,
  onClick,
  type = "button",
  disabled,
  linkProps = {},
  noPadding,
}) => {
  const buttonClasses = classNames(
    styles.button,
    className,
    loading && styles["button--loading"],
    noPadding && styles["button--noPadding"],
    theme === "accent" && styles["button--accent"],
    theme === "dark" && styles["button--dark"]
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={buttonClasses}
        {...linkProps}
      >
        {loading && <Loader className={styles.button__loader} size="s" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading && <Loader className={styles.button__loader} size="s" />}
      {children}
    </button>
  );
};

export default Button;
