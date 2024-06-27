# PopJonanek API
Kvalitní API v nest.js pro hru PopJonanek!

## Plánované endpointy
| Cesta                     | Metoda | Popis                                         | Jen pro přihlášené | Vyžaduje                        | Vrací při úspěchu                                                     |
|---------------------------|--------|-----------------------------------------------|--------------------|---------------------------------|-----------------------------------------------------------------------|
| /auth/login               | POST   | Přihlášení                                    | ❌              | Email, Heslo                    | Informace o uživateli, JWT Token                                      |
| /auth/register            | POST   | Registrace                                    | ❌              | Email, přezdívku, heslo         | Informace o uživateli, JWT token (Pošle email pro ověření)            |
| /auth/email-verify        | POST   | Ověření emailu                                | ❌              | Token                           |                                                                       |
| /auth/forgot-password     | POST   | Poslání emailu pro resetování hesla           | ❌              | Email                           |                                                                       |
| /auth/password-reset      | POST   | Nastavení nového hesla po resetovani z emailu | ❌              | Token, nové heslo               |                                                                       |
| /user/[ID]                | GET    | Informace o uživateli                         | ❌              | USER_ID                         | USER_ID, přezdívka, avatar, celkový počet kliků, aktuální počet kliků |
| /user                     | GET    | Získání informací o přihlášeném uživateli     | ✔               |                                 | USER_ID, přezdívka, avatar, celkový počet kliků, aktuální počet kliků |
| /user                     | PUT    | Aktualizace uživatele                         | ✔               |                                 |                                                                       |
| /user/clicks              | PUT    | Aktualizace počtu kliknutí uživatele          | ✔               | Aktuální celkový počet kliknutí |                                                                       |
| /user/sound               | PUT    | Nastavení zvuku (musí být zakoupený)          | ✔               | SOUND_ID                        |                                                                       |
| /user/background          | PUT    | Nastavení pozadí (musí být zakoupený)         | ✔               | BACKGROUND_ID                   |                                                                       |
| /user/inventory           | GET    | Vypíše všechny zakoupené předměty uživatele   | ✔               |                                 |                                                                       |
| /clicks/total             | GET    | Celkový počet kliknutí                        | ❌              |                                 |                                                                       |
| /shop/items               | GET    | Vypíše všechny předměty v obchodu             | ❌              |                                 |                                                                       |
| /shop/items/[ID]/purchase | POST   | Zakoupení předmětů v obchodu                  | ✔               |                                 |                                                                       |

## Env proměnné
| Proměnná            | Povinné | Výchozí hodnota                                                             | Popis                                       |
|---------------------|---------|-----------------------------------------------------------------------------|---------------------------------------------|
| DB_HOST             | ❌   | 127.0.0.1                                                                   | IP adresa/hostname databázového serveru     |
| DB_PORT             | ❌   | 3306                                                                        | Port databázového serveru                   |
| DB_USER             | ✔    |                                                                             | Uživatel pro připojení na databázi          |
| DB_PASSWORD         | ✔    |                                                                             | Heslo pro připojení na databázi             |
| DB_DATABASE         | ✔    |                                                                             | Název databáze na databázovém serveru       |
| USERNAME_MIN_LENGTH | ❌   | 2                                                                           | Minimální délka přezdívky                   |
| USERNAME_MAX_LENGTH | ❌   | 32                                                                          | Maximální délka přezdívky                   |
| PASSWORD_MIN_LENGTH | ❌   | 8                                                                           | Minimální délka hesla                       |
| PASSWORD_MAX_LENGTH | ❌   | 50                                                                          | Maximální délka přezdívky                   |
| PASSWORD_REGEX      | ❌   | /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&amp;])[A-Za-z\d@$!%*?&amp;]+$/ | Regex požadavky na heslo                    |
| SMTP_HOST           | ✔    |                                                                             | IP adresa/hostname SMTP serveru             |
| SMTP_PORT           | ❌   | 465                                                                         | Port SMTP serveru                           |
| SMTP_TLS            | ❌   | ✔                                                                        | Povolení/zakázání TLS pro připojení na SMTP |
| SMTP_USERNAME       | ✔    |                                                                             | Uživatel pro připojení na SMTP server       |
| SMTP_PASSWORD       | ✔    |                                                                             | Heslo pro připojení na SMTP server          |



## Spuštění API

- Instalace

```bash
$ npm install
```

- Nastavení ENV proměnných (Viz. výše)

- Samotné spuštění

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
