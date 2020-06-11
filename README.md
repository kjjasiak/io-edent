# io-edent
## Instalacja
1. Pobrać w formacie ZIP i wypakować (może to potrwać nawet do kilku minut) lub sklonować repozytorium.
2. Pobrać i zainstalować NodeJS 12.18.0 (https://nodejs.org/en/download/) z domyślną konfiguracją (testowano na wersji 64-bitowej).
3. Pobrać i zainstalować MariaDB 10.4.11 (https://downloads.mariadb.org/interstitial/mariadb-10.4.11/winx64-packages/mariadb-10.4.11-winx64.msi/from/http%3A//ftp.hosteurope.de/mirror/archive.mariadb.org/) z domyślną konfiguracją. Podczas instalacji jest możliwość zmiany domyślnego hasła dla użytkownika 'root' - jest to opcjonalne.
4. Uruchomić MySQL Client (MariaDB 10.4 (x64)).
5. Podać hasło użytkownika 'root' (jeśli nie zmienialiśmy hasła przy instalacji to domyślnie jest ono puste - wystarczy wtedy wcisnąć Enter).
6. W konsoli MariaDB wkleić zawartość pliku db_queries.txt i zatwierdzić klawiszem Enter.
7. W głównym folderze z implementacją odszukać plik db.js, a następnie podmienić w nim wartości **'host'**, **'port'**, **'user'** oraz **'password'** na odpowiadające posiadanej konfiguracji bazy danych, po czym zapisać plik.
8. **(opcjonalnie)** W pliku app.js zmienić wartość zmiennej **'host'** oraz **'port'** na żądane wartości (wartości te będą potrzebne przy uruchomieniu serwera aplikacji).
9. Uruchomić linię komend lub inny preferowany terminal, przejść w nim do głównego folderu z implementacją.
10. W linii komend wydać polecenie:
```
npm install -g nodemon
```
11. Następnie wydać polecenie:
```
nodemon app.js
```
12. Otworzyć przeglądarkę pod adresem podanym w linii komend, np.
```
Aplikacja dostepna pod adresem http://127.0.0.1:2500/
```

## Obsługa demo
W celu poruszania się po przygotowanym demo należy korzystać z linków znajdujących się w menu rozwijalnym **"Wizyty (DEMO)"** na górnym pasku.
