# Меню Frank by Basta — учебник официанта

Статичный сайт: `index.html` + иконки. Всё в одном файле, без сборки и серверов.

## GitHub Pages
1. На github.com создай репозиторий (например `frank-menu`), публичный.
2. Загрузи все файлы из этой папки (Add file → Upload files), включая папку `icons`.
3. Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.
4. Через минуту сайт будет на `https://ТВОЙ_НИК.github.io/frank-menu/`. Нужен именно https.

## Telegram Mini App
1. В Telegram открой @BotFather → `/newbot`, задай имя и username.
2. `/setuserpic` → выбери бота → отправь `logo-512.png`.
3. `/newapp` → выбери бота → название, описание, фото 640×360 (можно любое), потом ссылку на сайт с GitHub Pages и короткое имя.
   Или проще: `/mybots` → бот → Bot Settings → Menu Button → Configure menu button → вставь ссылку.
4. Открой бота и нажми кнопку меню слева от поля ввода.

Прогресс хранится в памяти приложения на телефоне (localStorage), поэтому на другом устройстве он не появится.

## Таблица менеджера
Прогресс стажёров можно отправлять в Google Таблицу: см. manager/ИНСТРУКЦИЯ.md и файл config.js.
