import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styles from './ContactForm.module.scss';
import Input from 'shared/ui/Input';
import Textarea from 'shared/ui/Textarea';
import Button from 'shared/ui/Button';
import { SegmentedControl } from 'shared/ui/ActionButton';
import { ContactFormStore } from 'features/contact/model/ContactFormStore';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import { ROUTES } from 'shared/configs/routes';

const PROJECT_TYPES = [
  { value: 'website', label: 'Сайт' },
  { value: 'product', label: 'Приложение' },
  { value: 'design', label: 'Дизайн' },
  { value: 'other', label: 'Другое' },
] as const;
const MESSAGE_LIMIT = 1200;

const ContactForm = observer(() => {
  const form = useLocalStore(() => new ContactFormStore());
  const loading = form.meta === Meta.loading;

  if (form.meta === Meta.success) {
    return (
      <div className={styles.contact__success} role="status">
        <h3>Сообщение отправлено</h3>
        <p>Спасибо. Отвечу на указанный email.</p>
        <Button variant="secondary" onClick={() => form.reset()}>
          Новое сообщение
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
      className={styles.contact__form}
      noValidate
      aria-label="Связаться с Андреем"
    >
      <div className={styles.contact__projectChoice}>
        <span className={styles.contact__label}>Тип проекта</span>
        <SegmentedControl
          label="Тип проекта"
          value={form.projectType}
          options={PROJECT_TYPES}
          onChange={(value) => form.setField('projectType', value)}
          disabled={loading}
          compact
          fullWidth
        />
      </div>
      <div className={styles.contact__row}>
        <div className={styles.contact__field}>
          <label htmlFor="contact-name">Имя</label>
          <Input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={(value) => form.setField('name', value)}
            placeholder="Ваше имя"
            autoComplete="name"
            disabled={loading}
            required
            aria-invalid={Boolean(form.errors.name)}
            aria-describedby={form.errors.name ? 'contact-name-error' : undefined}
          />
          {form.errors.name && (
            <span id="contact-name-error" className={styles.contact__fieldError} role="alert">
              {form.errors.name}
            </span>
          )}
        </div>
        <div className={styles.contact__field}>
          <label htmlFor="contact-email">Email</label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(value) => form.setField('email', value)}
            placeholder="name@example.com"
            autoComplete="email"
            disabled={loading}
            required
            aria-invalid={Boolean(form.errors.email)}
            aria-describedby={form.errors.email ? 'contact-email-error' : undefined}
          />
          {form.errors.email && (
            <span id="contact-email-error" className={styles.contact__fieldError} role="alert">
              {form.errors.email}
            </span>
          )}
        </div>
      </div>
      <div className={styles.contact__field}>
        <div className={styles.contact__messageLabel}>
          <label htmlFor="contact-message">О проекте</label>
          {form.message.length > 1000 && (
            <span>
              {form.message.length} / {MESSAGE_LIMIT}
            </span>
          )}
        </div>
        <Textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={(value) => form.setField('message', value)}
          placeholder="Что нужно сделать и к какому сроку?"
          rows={5}
          maxLength={MESSAGE_LIMIT}
          disabled={loading}
          required
          aria-invalid={Boolean(form.errors.message)}
          aria-describedby={form.errors.message ? 'contact-message-error' : undefined}
        />
        {form.errors.message && (
          <span id="contact-message-error" className={styles.contact__fieldError} role="alert">
            {form.errors.message}
          </span>
        )}
      </div>
      {form.meta === Meta.error && (
        <p className={styles.contact__error} role="alert">
          Не удалось отправить сообщение. Попробуйте ещё раз или напишите на email.
        </p>
      )}
      <div className={styles.contact__actions}>
        <Button type="submit" loading={loading} loadingLabel="Отправка сообщения">
          Отправить
        </Button>
        <p className={styles.contact__legal}>
          Нажимая кнопку, вы соглашаетесь с{' '}
          <Link to={ROUTES.PRIVACY}>политикой конфиденциальности</Link>.
        </p>
      </div>
    </form>
  );
});
export default ContactForm;
