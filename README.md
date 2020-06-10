# io-edent
## Instalacja
1. Pobrać w formacie ZIP i wypakować lub sklonować repozytorium.
2. Pobrać i zainstalować NodeJS 12.18.0 (https://nodejs.org/en/download/) z domyślną konfiguracją (testowano na wersji 64-bitowej).
3. Pobrać i zainstalować MariaDB 10.4.11 (https://downloads.mariadb.org/interstitial/mariadb-10.4.11/winx64-packages/mariadb-10.4.11-winx64.msi/from/http%3A//ftp.hosteurope.de/mirror/archive.mariadb.org/)
4. konsola MariaDB + query (uzupełnić!)
5. W głównym folderze z implementacją odszukać plik db.js, a następnie podmienić w nim wartości **'host'**, **'port'**, **'database'**, **'user'** oraz **'password'** na odpowiadające posiadanej konfiguracji bazy danych, po czym zapisać plik.
5a. (opcjonalnie) W pliku app.js zmienić wartość zmiennej host oraz port na żądane wartości (wartości te będą potrzebne przy uruchomieniu serwera aplikacji).
6. Uruchomić linię komend lub inny preferowany terminal, przejść w nim do głównego folderu z implementacją.
7. W linii komend wydać polecenie:
```
npm install nodemon
```
8. Następnie wydać polecenie:
```
nodemon app.js
```
9. Otworzyć przeglądarkę pod adresem podanym w linii komend, np.
```
Aplikacja dostepna pod adresem http://127.0.0.1:2500/
```

## Obsługa demo
W celu poruszania się po przygotowanym demo należy korzystać z linków znajdujących się w menu rozwijalnym "Wizyty (DEMO)" na górnym pasku.
