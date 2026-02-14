"use client";

import Link from "next/link";
import styles from "./not-found.module.scss";
import Text from "components/Text";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <Text tag="h1">404 - Страница не найдена</Text>
      <Text color="accent">
        К сожалению, страница, которую вы ищете, не существует.
      </Text>
      <Link href="/" className={styles.notFound__link}>
        Вернуться на главную
      </Link>
    </div>
  );
}
