import styles from './page.module.scss';
import Text from 'shared/ui/Text';
import Link from 'next/link';
import { ROUTES } from 'shared/configs/routes';

export default function PrivacyPage() {
  return (
    <main className={styles.legal}>
      <div className={styles.legal__container}>
        <Link href={ROUTES.HOME} className={styles.legal__back}>
          <Text view="p-14" color="accent">
            ← На главную
          </Text>
        </Link>

        <Text tag="h1" view="p-32" weight="bold">
          Политика конфиденциальности
        </Text>
        <Text view="p-14" color="secondary">
          Дата вступления в силу: 1 января 2025 г.
        </Text>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            1. Общие положения
          </Text>
          <Text tag="p" view="p-16">
            Настоящая Политика конфиденциальности (далее — Политика) разработана в соответствии с
            Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок
            обработки персональных данных Пользователей персонального портфолио-сайта (далее —
            Сайт).
          </Text>
          <Text tag="p" view="p-16">
            Оператор персональных данных: Киверин Андрей Александрович (далее — Оператор).
          </Text>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            2. Состав персональных данных
          </Text>
          <Text tag="p" view="p-16">
            Оператор может обрабатывать следующие персональные данные Пользователя:
          </Text>
          <ul className={styles.legal__list}>
            <li>
              <Text tag="p" view="p-16">
                Имя (при регистрации или отправке формы обратной связи)
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Адрес электронной почты (email)
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Текст сообщения (при использовании формы обратной связи)
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Данные, предоставляемые сервисом Google при авторизации через Google OAuth
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            3. Цели обработки данных
          </Text>
          <Text tag="p" view="p-16">
            Персональные данные обрабатываются в следующих целях:
          </Text>
          <ul className={styles.legal__list}>
            <li>
              <Text tag="p" view="p-16">
                Регистрация и идентификация Пользователя на Сайте
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Обработка обращений через форму обратной связи
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Обеспечение работы функций Сайта
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            4. Правовые основания обработки
          </Text>
          <Text tag="p" view="p-16">
            Обработка персональных данных осуществляется на основании согласия Пользователя (пункт 1
            части 1 статьи 6 Федерального закона № 152-ФЗ), выраженного путём принятия условий при
            регистрации или отправке формы обратной связи.
          </Text>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            5. Хранение и защита данных
          </Text>
          <Text tag="p" view="p-16">
            5.1. Персональные данные хранятся на серверах Google Firebase (Google LLC),
            расположенных в соответствии с условиями использования Google Cloud Platform.
          </Text>
          <Text tag="p" view="p-16">
            5.2. Оператор принимает необходимые организационные и технические меры для защиты
            персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения.
          </Text>
          <Text tag="p" view="p-16">
            5.3. Данные хранятся в течение срока, необходимого для достижения целей обработки, либо
            до момента отзыва согласия Пользователем.
          </Text>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            6. Права Пользователя
          </Text>
          <Text tag="p" view="p-16">
            В соответствии с законодательством Российской Федерации Пользователь имеет право:
          </Text>
          <ul className={styles.legal__list}>
            <li>
              <Text tag="p" view="p-16">
                Получить информацию об обработке своих персональных данных
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Потребовать уточнения, блокирования или уничтожения своих данных
              </Text>
            </li>
            <li>
              <Text tag="p" view="p-16">
                Отозвать согласие на обработку персональных данных
              </Text>
            </li>
          </ul>
          <Text tag="p" view="p-16">
            Для реализации указанных прав Пользователь может обратиться к Оператору через форму
            обратной связи на Сайте.
          </Text>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            7. Сторонние сервисы
          </Text>
          <Text tag="p" view="p-16">
            Сайт использует следующие сторонние сервисы: Google Firebase (аутентификация и хранение
            данных), Google OAuth (авторизация). Использование данных сервисов регулируется их
            собственными политиками конфиденциальности.
          </Text>
        </section>

        <section className={styles.legal__section}>
          <Text tag="h2" view="p-20" weight="bold">
            8. Заключительные положения
          </Text>
          <Text tag="p" view="p-16">
            Оператор вправе вносить изменения в настоящую Политику. Актуальная версия размещается на
            данной странице Сайта. Продолжение использования Сайта после внесения изменений означает
            согласие с обновлённой Политикой.
          </Text>
        </section>
      </div>
    </main>
  );
}
