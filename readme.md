# OpenSSL PKI Management Script (TypeScript)

Ten projekt umożliwia zarządzanie podstawowymi operacjami PKI (Public Key Infrastructure) przy użyciu OpenSSL, skryptowane w TypeScript.

## Wymagania Wstępne

Przed uruchomieniem upewnij się, że masz zainstalowane:

1.  **Node.js**: Wersja 16.x lub nowsza (zalecane LTS). Możesz pobrać z [nodejs.org](https://nodejs.org/).
2.  **OpenSSL**: Dostępne w PATH Twojego systemu. Sprawdź poleceniem `openssl version`.
3.  **npm** lub **yarn**: Do zarządzania zależnościami projektu.

## Konfiguracja Projektu

1.  **Sklonuj repozytorium** (jeśli dotyczy) lub upewnij się, że masz wszystkie pliki projektu.

2.  **Zainstaluj zależności:**
    Otwórz terminal w głównym katalogu projektu i uruchom:
    ```bash
    npm install
    ```
    Lub jeśli używasz yarn:
    ```bash
    yarn install
    ```
    Spowoduje to instalację `typescript`, `ts-node`, `dotenv` i `@types/node`.

3.  **Skonfiguruj zmienne środowiskowe:**
    * Skopiuj plik `.env.example` do nowego pliku o nazwie `.env` w głównym katalogu projektu:
        ```bash
        cp .env.example .env
        ```
    * Otwórz plik `.env` i dostosuj wartości, szczególnie:
        * `OUTPUT_DIR`: Katalog, w którym będą przechowywane wygenerowane klucze i certyfikaty.
        * `CA_SUBJECT` i `ENTITY_SUBJECT`: Dane podmiotów dla CA i certyfikatu końcowego.
        * `CA_KEY_PASSWORD`: **Bardzo ważne!** Ustaw silne, unikalne hasło dla klucza prywatnego Twojego CA. **Nie używaj domyślnego hasła w środowisku produkcyjnym.**

## Uruchamianie Skryptu

Skrypt można uruchomić bezpośrednio za pomocą `ts-node`, co eliminuje potrzebę wcześniejszej kompilacji TypeScript do JavaScript.

W głównym katalogu projektu wykonaj polecenie:

```bash
npx ts-node src/main.ts