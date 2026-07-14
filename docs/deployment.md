# План развёртывания

## Обзор инфраструктуры

```
                   GitLab
                     │
                     ▼
            ┌─────────────────┐
            │   GitLab CI/CD  │
            │                 │
            │  ┌───────────┐  │
            │  │   Build    │  │
            │  │   Test     │  │
            │  │   Lint     │  │
            │  │   Deploy   │  │
            │  └───────────┘  │
            └────────┬────────┘
                     │
          ┌──────────┼──────────┐
          ▼                     ▼
   ┌──────────────┐    ┌──────────────┐
   │  Preview      │    │  Production  │
   │  (dev ветка)  │    │  andkiv.com  │
   │  dev.andkiv…  │    │              │
   └──────────────┘    └──────────────┘
          │                     │
          └─────────┬───────────┘
                    ▼
             ┌─────────────┐
             │   Nginx     │
             │   Reverse   │
             │   Proxy     │
             └─────────────┘
```

## 1. Подготовка сервера

### Минимальные требования

- OS: Ubuntu 22.04+ / Debian 12+
- RAM: 1 GB
- Диск: 10 GB SSD
- Домен: `andkiv.com` с DNS записями

### Установка ПО

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Nginx
sudo apt install nginx -y
sudo systemctl enable nginx

# Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y

# Node.js (для сборки, если нужна локальная сборка)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# GitLab Runner
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt install gitlab-runner -y
```

### Регистрация GitLab Runner

```bash
sudo gitlab-runner register \
  --url https://gitlab.com/ \
  --registration-token YOUR_TOKEN \
  --executor shell \
  --description "production-server"
```

### DNS записи

```
A     andkiv.com        → IP_СЕРВЕРА
A     dev.andkiv.com    → IP_СЕРВЕРА   (для preview)
```

## 2. Настройка Nginx

### Основной сайт (production)

```nginx
# /etc/nginx/sites-available/andkiv.com
server {
    listen 80;
    server_name andkiv.com www.andkiv.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name andkiv.com www.andkiv.com;

    ssl_certificate /etc/letsencrypt/live/andkiv.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/andkiv.com/privkey.pem;

    root /var/www/andkiv.com/production;
    index index.html;

    # SPA — все маршруты обслуживаются index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статики
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;
}
```

### Preview-сайт (dev)

```nginx
# /etc/nginx/sites-available/dev.andkiv.com
server {
    listen 80;
    server_name dev.andkiv.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dev.andkiv.com;

    ssl_certificate /etc/letsencrypt/live/dev.andkiv.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.andkiv.com/privkey.pem;

    root /var/www/andkiv.com/preview;
    index index.html;

    # Базовая авторизация (опционально)
    # auth_basic "Preview";
    # auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
```

### Активация конфигов

```bash
sudo ln -s /etc/nginx/sites-available/andkiv.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dev.andkiv.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL-сертификаты

```bash
sudo certbot --nginx -d andkiv.com -d www.andkiv.com
sudo certbot --nginx -d dev.andkiv.com
```

## 3. Структура директорий на сервере

```
/var/www/andkiv.com/
├── production/    # Продакшн-сборка (из main)
│   ├── index.html
│   └── assets/
├── preview/       # Preview-сборка (из MR)
│   ├── index.html
│   └── assets/
└── assets/        # Статические ресурсы (обложки проектов, достижений)
    ├── projects/
    └── achievements/
```

## 4. GitLab CI/CD

### Файл `.gitlab-ci.yml`

```yaml
stages:
  - quality
  - build
  - deploy-preview
  - deploy-production

variables:
  NODE_VERSION: "20"
  PNPM_VERSION: "9"

# ─── Общий шаблон ───

.node-setup:
  before_script:
    - corepack enable
    - corepack prepare pnpm@$PNPM_VERSION --activate
    - pnpm install --frozen-lockfile
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - node_modules/
      - .pnpm-store/

# ─── Этап 1: Проверка качества ───

typecheck:
  stage: quality
  extends: .node-setup
  script:
    - pnpm ts-check
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"

lint:
  stage: quality
  extends: .node-setup
  script:
    - pnpm lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"
  allow_failure: true  # ESLint конфиг требует настройки

stylelint:
  stage: quality
  extends: .node-setup
  script:
    - pnpm stylelint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"

# ─── Этап 2: Сборка ───

build:
  stage: build
  extends: .node-setup
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"

# ─── Этап 3: Деплой preview (при создании/обновлении MR) ───

deploy-preview:
  stage: deploy-preview
  needs:
    - build
  script:
    - rsync -avz --delete dist/ /var/www/andkiv.com/preview/
  environment:
    name: preview
    url: https://dev.andkiv.com
    on_stop: stop-preview
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

stop-preview:
  stage: deploy-preview
  script:
    - rm -rf /var/www/andkiv.com/preview/*
    - echo "Preview cleared" > /var/www/andkiv.com/preview/index.html
  environment:
    name: preview
    action: stop
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: manual

# ─── Этап 4: Деплой в production (ручной, после слития в main) ───

deploy-production:
  stage: deploy-production
  needs:
    - build
  script:
    - rsync -avz --delete dist/ /var/www/andkiv.com/production/
  environment:
    name: production
    url: https://andkiv.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  only:
    - main
```

## 5. Рабочий процесс

### Разработка новой фичи

```
1. Создать ветку от main:
   git checkout -b feature/my-feature

2. Разработка, коммиты

3. Push и создание Merge Request:
   git push -u origin feature/my-feature

4. CI автоматически:
   ✅ Запускает typecheck, lint, stylelint
   ✅ Собирает проект
   ✅ Деплоит preview на dev.andkiv.com

5. Тестирование на dev.andkiv.com

6. Code Review → Approve → Merge в main

7. После merge в main:
   ✅ CI запускает quality + build
   ✅ deploy-production доступен как ручная кнопка
   🖱️ Нажать "Deploy" для выкатки на andkiv.com
```

### Откат

```bash
# На сервере, если нужен быстрый откат:
# Предыдущая версия хранится в artifacts GitLab
# Можно перезапустить deploy-production из предыдущего pipeline
```

## 6. Мониторинг

### Логи Nginx

```bash
# Доступ
sudo tail -f /var/log/nginx/access.log

# Ошибки
sudo tail -f /var/log/nginx/error.log
```

### Проверка здоровья

```bash
# Проверить, что сайт отвечает
curl -I https://andkiv.com

# Проверить SSL
curl -vI https://andkiv.com 2>&1 | grep "SSL certificate"
```

### Автообновление SSL

```bash
# Certbot автоматически обновляет сертификаты
# Проверить таймер:
sudo systemctl status certbot.timer

# Тест обновления:
sudo certbot renew --dry-run
```

## 7. Переменные окружения

### GitLab CI Variables

| Переменная | Тип | Описание |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Masked | API ключ Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Variable | Домен аутентификации |
| `VITE_FIREBASE_PROJECT_ID` | Variable | ID проекта Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Variable | Bucket хранилища |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Masked | Sender ID |
| `VITE_FIREBASE_APP_ID` | Masked | App ID |

Настраиваются в GitLab → Settings → CI/CD → Variables.

## 8. Безопасность

- ✅ SSL/TLS через Let's Encrypt
- ✅ HTTP → HTTPS редирект
- ✅ Security-заголовки в Nginx
- ✅ Firebase переменные как CI Variables (не в коде)
- ✅ Firestore Security Rules для контроля доступа
- ✅ Опциональная HTTP-авторизация для preview
