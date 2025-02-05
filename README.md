# Это исходный код DND бота, который создан для меня и друзей

В основном собираюсь использовать его для всяких фишек внутри Телеграма, но
постараюсь сильно на телеграмме не завязываться и писать хорошо расширяемое
приложение

## How to RUN

Создайте файл .env и впишите туда API Token от бота Telegram в таком формате,
как указано в .env.example, для удобства можете сделать вот так:

```bash
mv .env.example .env
```

---

Надо запустить для установки зависимостей:

```bash
deno install
```

И запустить бота в телеграмме:

```bash
deno run telegram
```
