# Miniprosjekt Høst 2019 - Community News

## Innledning
Dette miniprosjektet har blitt planlagt, arbeidet med og fullført av meg tilknyttet faget Systemutvikling 2 ved NTNU.
Jeg har lagd et system for en "Community" nettavis som bruker MySQL i backend og biblioteket React i frontend, samt typesjekking med Flow.

## Installasjon og oppsett

Åpne terminalen og skriv følgende:

```
git clone https://gitlab.stud.idi.ntnu.no/dilawarm/miniprosjekth19.git

cd miniprosjekth19/server/src

vim config.json
```

Lim inn innholdet under i config.json. Bytt ut det i ** med din info, og legg også til en nøkkel for generering av tokens for brukersystemet:

```
{
    "host": "*host*",
    
    "user": "*user*",
    
    "password": "*password*",
    
    "database": "*database*",
    
    "key": "*key*"
}
```

Etter at det har blitt gjort, er systemet klart for å bli kjørt. Skriv følgende i terminalen(e):
```
cd ../server
npm install
npm start
```

```
cd ../socket
npm install
npm start
```

```
cd ../client
npm install
npm start
```

Applikasjonen kan nå åpnes i [http://localhost:3000](http://localhost:3000). Det er også mulig å få utført REST-kall mot [http://localhost:8080](http://localhost:8080)

## Testing av klient og server, samt testing av typesjekking
Jeg har implementert en continuous integration (CI) løsning på NTNU's GitLab server, hvor det kjøres både servertester og klienttester, samt typesjekking i `server`, `socket`, og `client`.
Hvis dere ønsker å kjøre disse testene lokalt, kan det gjøres som beskrevet nedenfor for hver av de ulike mappene. Installer flow først:
```
npm install -g flow-bin
```

### Server

```
vim server/tests/nyhetssakdaoTest.js
```

Bytt ut informasjonen fra og med linje 8 til og med linje 16 med din egen informasjon om din (test)database. Gjør tilsvarende for resten av testfilene i `server/tests`.

Skriv følgende i terminalen i `server`:
```
- cd server && npm install && npm test && rm node_modules/bcryptjs/src/bower.json && flow check src
```
Som dere kan se, så sletter jeg en json fil før jeg tester typesjekkinga. Dette gjøres siden de(n) som har skrevet bcryptjs modulen (som jeg bruker for å kryptere passord i databasen) har brukt kommentarer i bower.json, noe som
bryter med syntaksen til .json fil, og det er noe Flow reagerer på. (Merk at selve fjerningen av denne filen ikke påvirker systemet).

### Socket
Har ingen tester i `socket`, men dere kan teste typesjekkinga på følgende måte:
```
cd socket
flow check src
```

### Klient
```
cd client
npm test && flow check src
```
```