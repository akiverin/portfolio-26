'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';
import Link from 'next/link';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import { ROUTES } from 'shared/configs/routes';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <Text tag="h1">Что-то пошло не так</Text>
      <Text color="accent">Произошла ошибка. Попробуйте снова или вернитесь на главную.</Text>
      <div className={styles.errorPage__actions}>
        <Button onClick={reset}>Попробовать снова</Button>
        <Link href={ROUTES.HOME} className={styles.errorPage__link}>
          На главную
        </Link>
      </div>
    </div>
  );
}
