import classNames from "classnames";
import styles from "./Text.module.scss";
import { HTMLAttributes, LabelHTMLAttributes } from "react";

export type BaseTextProps = {
  className?: string;
  full?: boolean;
  view?:
    | "title"
    | "subtitle"
    | "button"
    | "p-32"
    | "p-30"
    | "p-28"
    | "p-24"
    | "p-20"
    | "p-18"
    | "p-16"
    | "p-14"
    | "p-12"
    | "p-10"
    | "p-8";
  font?: "pretendard" | "caveat";
  weight?: "normal" | "medium" | "bold" | "black";
  htmlFor?: string;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "accent";
  maxLines?: number;
  uppercase?: boolean;
  noWrap?: boolean;
};

// Пропсы, когда tag === "label"
type LabelTextProps = BaseTextProps & {
  tag: "label";
} & LabelHTMLAttributes<HTMLLabelElement>;

// Пропсы для всех остальных тегов
type OtherTextProps = BaseTextProps & {
  tag?: Exclude<
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "p" | "span",
    "label"
  >;
} & HTMLAttributes<HTMLElement>;

export type TextProps = LabelTextProps | OtherTextProps;

const Text: React.FC<TextProps> = ({
  htmlFor,
  className,
  view,
  tag: Tag = "p",
  font = "pretendard",
  weight,
  children,
  color,
  uppercase = false,
  maxLines,
  full,
  noWrap,
}: TextProps) => {
  return (
    <Tag
      className={classNames(styles.text, className, {
        [styles["text--w-black"]]: weight === "black",
        [styles["text--w-bold"]]: weight === "bold",
        [styles["text--full"]]: full === true,
        [styles["text--uppercase"]]: uppercase === true,
        [styles["text--w-medium"]]: weight === "medium",
        [styles[`text--v-${view}`]]: view,
        [styles[`text--c-${color}`]]: color,
        [styles[`text--f-${font}`]]: font,
        [styles["text--no-wrap"]]: noWrap,
      })}
      style={{ WebkitLineClamp: maxLines ? maxLines : "auto" }}
      htmlFor={htmlFor}
    >
      {children}
    </Tag>
  );
};

export default Text;
