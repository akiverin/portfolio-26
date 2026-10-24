<?php
declare(strict_types=1);

/**
 * Self-hosted media endpoint for the portfolio admin panel.
 *
 * Authentication uses the Firebase ID token issued to the currently signed-in
 * user. The user document is then read from Firestore with that same token and
 * must contain `role: "admin"`. No service-account key is stored on the host.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function config(): array
{
    $path = $_SERVER['MEDIA_CONFIG_PATH'] ?? '';
    if (!is_string($path) || $path === '' || !is_readable($path)) {
        respond(500, ['error' => 'Конфигурация медиа-хранилища не найдена.']);
    }

    $config = require $path;
    if (!is_array($config)) {
        respond(500, ['error' => 'Конфигурация медиа-хранилища некорректна.']);
    }

    foreach (['firebase_web_api_key', 'firebase_project_id', 'storage_path', 'public_base_url'] as $key) {
        if (empty($config[$key]) || !is_string($config[$key])) {
            respond(500, ['error' => 'Конфигурация медиа-хранилища неполная.']);
        }
    }

    return $config;
}

function applyCors(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $origins = $config['allowed_origins'] ?? [];
    if (!is_array($origins)) $origins = [];

    if ($origin !== '' && in_array($origin, $origins, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 600');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function requestToken(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!is_string($header) || !preg_match('/^Bearer\\s+(.+)$/i', $header, $matches)) {
        respond(401, ['error' => 'Требуется авторизация.']);
    }

    return trim($matches[1]);
}

function httpJson(string $url, ?string $bearerToken = null, ?array $body = null): array
{
    $curl = curl_init($url);
    if ($curl === false) respond(500, ['error' => 'Не удалось инициализировать сетевой запрос.']);

    $headers = ['Accept: application/json'];
    if ($bearerToken !== null) $headers[] = "Authorization: Bearer {$bearerToken}";
    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES));
    }

    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_POST => $body !== null,
    ]);

    $result = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    if (!is_string($result) || $status < 200 || $status >= 300) {
        respond(401, ['error' => $error !== '' ? 'Не удалось проверить авторизацию.' : 'Недействительная авторизация.']);
    }

    $decoded = json_decode($result, true);
    if (!is_array($decoded)) respond(401, ['error' => 'Недействительный ответ авторизации.']);
    return $decoded;
}

function assertAdmin(array $config): void
{
    $token = requestToken();
    $identity = httpJson(
        'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . rawurlencode($config['firebase_web_api_key']),
        null,
        ['idToken' => $token],
    );
    $uid = $identity['users'][0]['localId'] ?? null;
    if (!is_string($uid) || $uid === '') respond(401, ['error' => 'Недействительный токен.']);

    $document = httpJson(
        'https://firestore.googleapis.com/v1/projects/' . rawurlencode($config['firebase_project_id']) .
        '/databases/(default)/documents/users/' . rawurlencode($uid),
        $token,
    );
    $role = $document['fields']['role']['stringValue'] ?? null;
    if ($role !== 'admin') respond(403, ['error' => 'Недостаточно прав для управления медиа.']);
}

function mediaEntity(): string
{
    $entity = $_POST['entity'] ?? '';
    if (!is_string($entity) || !in_array($entity, ['projects', 'achievements'], true)) {
        respond(422, ['error' => 'Недопустимый тип сущности.']);
    }
    return $entity;
}

function iniBytes(string $value): int
{
    $value = trim($value);
    if ($value === '') return 0;
    $unit = strtolower(substr($value, -1));
    $number = (float) $value;
    return match ($unit) {
        'g' => (int) ($number * 1024 * 1024 * 1024),
        'm' => (int) ($number * 1024 * 1024),
        'k' => (int) ($number * 1024),
        default => (int) $number,
    };
}

function uploadErrorMessage(int $error): string
{
    return match ($error) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Файл превышает допустимый размер: изображения до 20 МБ, видео до 150 МБ.',
        UPLOAD_ERR_PARTIAL => 'Файл загружен не полностью. Повторите попытку.',
        UPLOAD_ERR_NO_FILE => 'Файл не передан.',
        UPLOAD_ERR_NO_TMP_DIR => 'На сервере отсутствует временный каталог для загрузки.',
        UPLOAD_ERR_CANT_WRITE => 'Серверу не удалось сохранить файл на диск.',
        UPLOAD_ERR_EXTENSION => 'Загрузка файла остановлена расширением PHP.',
        default => 'Не удалось принять файл.',
    };
}

function storageRoot(array $config): string
{
    $root = rtrim($config['storage_path'], '/');
    if (!is_dir($root) && !mkdir($root, 0750, true) && !is_dir($root)) {
        respond(500, ['error' => 'Не удалось подготовить медиа-хранилище.']);
    }
    $realRoot = realpath($root);
    if ($realRoot === false) respond(500, ['error' => 'Медиа-хранилище недоступно.']);
    return $realRoot;
}

function upload(array $config): never
{
    $entity = mediaEntity();
    $file = $_FILES['media'] ?? null;
    if (!is_array($file) || !isset($file['error'], $file['tmp_name'], $file['size'])) {
        $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength > iniBytes(ini_get('post_max_size'))) {
            respond(413, ['error' => 'Файл превышает допустимый размер: изображения до 20 МБ, видео до 150 МБ.']);
        }
        respond(422, ['error' => 'Файл не передан.']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $status = in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) ? 413 : 422;
        respond($status, ['error' => uploadErrorMessage($file['error'])]);
    }
    if (!is_uploaded_file($file['tmp_name'])) respond(422, ['error' => 'Некорректный источник файла.']);

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    $allowedTypes = [
        'image/jpeg' => ['jpg', 'image', 20 * 1024 * 1024],
        'image/png' => ['png', 'image', 20 * 1024 * 1024],
        'image/webp' => ['webp', 'image', 20 * 1024 * 1024],
        'image/gif' => ['gif', 'image', 20 * 1024 * 1024],
        'image/avif' => ['avif', 'image', 20 * 1024 * 1024],
        'video/mp4' => ['mp4', 'video', 150 * 1024 * 1024],
        'video/webm' => ['webm', 'video', 150 * 1024 * 1024],
        'video/quicktime' => ['mov', 'video', 150 * 1024 * 1024],
    ];
    if (!is_string($mimeType) || !isset($allowedTypes[$mimeType])) {
        respond(415, ['error' => 'Поддерживаются JPEG, PNG, WebP, GIF, AVIF, MP4, WebM и MOV.']);
    }

    [$extension, $mediaType, $maxSize] = $allowedTypes[$mimeType];
    if (!is_int($file['size']) || $file['size'] < 1 || $file['size'] > $maxSize) {
        respond(413, ['error' => $mediaType === 'image' ? 'Изображение не должно превышать 20 МБ.' : 'Видео не должно превышать 150 МБ.']);
    }

    $root = storageRoot($config);
    $datePath = gmdate('Y/m');
    $relativePath = "{$entity}/{$datePath}/" . bin2hex(random_bytes(16)) . ".{$extension}";
    $targetDirectory = dirname("{$root}/{$relativePath}");
    if (!is_dir($targetDirectory) && !mkdir($targetDirectory, 0750, true) && !is_dir($targetDirectory)) {
        respond(500, ['error' => 'Не удалось создать каталог для файла.']);
    }

    $target = "{$root}/{$relativePath}";
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        respond(500, ['error' => 'Не удалось сохранить файл.']);
    }
    chmod($target, 0640);

    $url = rtrim($config['public_base_url'], '/') . '/' . $relativePath;
    respond(201, [
        'url' => $url,
        'path' => '/media/' . $relativePath,
        'mediaType' => $mediaType,
        'mimeType' => $mimeType,
        'size' => $file['size'],
    ]);
}

function deleteMediaFile(array $config): never
{
    $payload = json_decode((string) file_get_contents('php://input'), true);
    $url = is_array($payload) ? ($payload['url'] ?? null) : null;
    if (!is_string($url) || $url === '') respond(422, ['error' => 'Не указан URL медиафайла.']);

    $parts = parse_url($url);
    $publicBase = parse_url($config['public_base_url']);
    if (!is_array($parts) || !is_array($publicBase)) {
        respond(422, ['error' => 'Некорректный URL медиафайла.']);
    }
    if (isset($parts['host']) && ($parts['host'] ?? '') !== ($publicBase['host'] ?? '')) {
        respond(422, ['error' => 'Можно удалить только файл из собственного медиа-хранилища.']);
    }
    $path = is_array($parts) ? ($parts['path'] ?? null) : null;
    if (!is_string($path) || !preg_match('#^/media/(projects|achievements)/\\d{4}/\\d{2}/[a-f0-9]{32}\\.(?:jpg|png|webp|gif|avif|mp4|webm|mov)$#', $path)) {
        respond(422, ['error' => 'Можно удалить только файл из собственного медиа-хранилища.']);
    }

    $root = storageRoot($config);
    $relativePath = substr($path, strlen('/media/'));
    $target = "{$root}/{$relativePath}";
    if (is_file($target) && !unlink($target)) respond(500, ['error' => 'Не удалось удалить файл.']);

    respond(200, ['deleted' => true]);
}

$config = config();
applyCors($config);
assertAdmin($config);

match ($_SERVER['REQUEST_METHOD']) {
    'POST' => upload($config),
    'DELETE' => deleteMediaFile($config),
    default => respond(405, ['error' => 'Метод не поддерживается.']),
};
