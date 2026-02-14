import React from "react";
import styles from "./Loader.module.scss";
import classNames from "classnames";

export type LoaderProps = {
  /** Размер */
  size?: "s" | "m" | "l";
  /** Дополнительный класс */
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size, className }: LoaderProps) => {
  return (
    <div
      className={classNames(
        styles.loader,
        size === "s" && styles["loader--small"],
        size === "m" && styles["loader-medium"],
        className
      )}
    >
      <div className={styles.loader__circle}></div>
    </div>
  );
};

export default Loader;
