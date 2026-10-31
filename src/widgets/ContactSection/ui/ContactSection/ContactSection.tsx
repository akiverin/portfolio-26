import styles from './ContactSection.module.scss';
import ContactForm from 'features/contact/ui/ContactForm';

const SOCIALS = [
  { href: 'mailto:kiverin03@yandex.ru', type: 'Email', label: 'kiverin03@yandex.ru' },
  { href: 'https://t.me/andkiv', type: 'Telegram', label: '@andkiv' },
  { href: 'tel:+79531370800', type: 'Телефон', label: '+7 (953) 137-08-00' },
] as const;

const ContactSection = () => (
  <section className={styles.contact} id="contact" aria-labelledby="contact-title">
    <div className={styles.contact__container}>
      <header className={styles.contact__header}>
        <h2 id="contact-title">Связаться</h2>
      </header>
      <div className={styles.contact__intro}>
        <p className={styles.contact__introText}>Расскажите о проекте или задайте вопрос.</p>
        <div className={styles.contact__responseCard}>
          <div>
            <span>Обычно отвечаю в течение дня</span>
            <span className={styles.contact__responseMeta}>Будни · 10:00–20:00 МСК</span>
          </div>
        </div>
        <div className={styles.contact__socials}>
          {SOCIALS.map(({ href, type, label }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('https') ? '_blank' : undefined}
              rel={href.startsWith('https') ? 'noopener noreferrer' : undefined}
              className={styles.contact__socialLink}
            >
              <span className={styles.contact__socialCopy}>
                <span className={styles.contact__socialType}>{type}</span>
                <span>{label}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className={styles.contact__formWrapper}>
        <ContactForm />
      </div>
    </div>
  </section>
);
export default ContactSection;
