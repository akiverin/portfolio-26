# Самостоятельное медиа-хранилище

## Что реализовано

Админка отправляет файл в `POST /api/media` вместе с Firebase ID-токеном.
PHP проверяет токен через Firebase Authentication, читает роль пользователя из
`users/{uid}` в Firestore и разрешает операцию только при `role: "admin"`.

Файлы не попадают в Firestore и не входят в `dist`: они сохраняются в
`/var/www/andkiv-media/{projects|achievements}/YYYY/MM/`. В документ Firestore
записывается абсолютный URL файла. При замене предыдущий файл удаляется только
после успешного сохранения документа; при удалении записи его обложка также
удаляется.

Ограничения: изображения до 10 МБ (JPEG, PNG, WebP, GIF, AVIF), видео до
100 МБ (MP4, WebM, MOV). Имя генерируется сервером из 32 случайных
шестнадцатеричных символов.

## Развёртывание на Ubuntu 22.04

1. Установите PHP-FPM и cURL:

   ```bash
   sudo apt update
   sudo apt install php8.1-fpm php8.1-curl
   sudo systemctl enable --now php8.1-fpm
   ```

   Разместите `server/php/media.pool.conf` в
   `/etc/php/8.1/fpm/pool.d/andkiv-media.conf` и перезапустите PHP-FPM. Пул
   работает в режиме `ondemand`: отдельные PHP-процессы запускаются только во
   время запроса и завершаются через 10 секунд простоя.

2. Создайте защищённые каталоги и разместите обработчик:

   ```bash
   sudo install -d -o www-data -g www-data -m 0750 /var/www/andkiv-api /var/www/andkiv-media /etc/andkiv
   sudo install -o root -g www-data -m 0640 server/php/media.php /var/www/andkiv-api/media.php
   sudo install -o root -g www-data -m 0640 server/php/media.config.php.example /etc/andkiv/media.php
   sudoedit /etc/andkiv/media.php
   ```

   В конфигурации задайте фактические `VITE_FIREBASE_API_KEY` и
   `VITE_FIREBASE_PROJECT_ID` из production-конфигурации фронтенда.

3. Добавьте содержимое `server/nginx/media-api.conf` внутрь каждого `server {}`
   для `andkiv.com` и `andkiv.ru`. Затем проверьте и перезагрузите Nginx:

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

4. В Firestore Rules пользователь должен иметь право прочитать собственный
   документ `users/{uid}`. PHP дополнительно требует поле `role: "admin"`.
   Не добавляйте Firebase service-account ключ в браузер или репозиторий.

## Резервное копирование

Добавьте `/var/www/andkiv-media` в резервные копии сервера. БД содержит лишь
ссылки; отсутствие этого каталога сделает обложки недоступными.
