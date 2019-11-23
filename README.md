# Miniprosjekt Høst 2019 - Community News

## Innledning
Dette miniprosjektet har blitt planlagt, arbeidet med og fullført av meg tilknyttet faget Systemutvikling 2 ved NTNU.
Jeg har lagd et system for en "Community" nettavis som bruker MySQL og Node.js i backend og bibliotekene React og React-Bootstrap i frontend, samt typesjekking med Flow.

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

Skriv følgende i terminalen fra hovedmappa:
```
- cd server npm install && npm test && rm node_modules/bcryptjs/src/bower.json && flow check src
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

## Om systemet

Nå skal jeg beskrive hva jeg har implementert, både i tråd med det oppgave spurte om, og også funksjonalitet
som jeg har implementert utover det oppgaven har spurt om.

### HAR

*  Det er mulig å se en oversikt over nyhetssaker, hvor man kan se bilde, overskrift og når artikkelen ble oppdatert.
*  Det er mulig å registrere nyhetssaker med overskrift, innhold, bilde (i form av lenke), kategori og viktighet. Tidspunktet blir opprettet av backend.
*  Det er mulig å redigere en sak som er registrert.
*  Det er mulig å slette en sak.
*  Det er mulig å filtrere saker basert på kategori. Kun de viktigste sakene havner på forsiden, resten havner i kategoriene og livefeed.
*  Hovesidene består av en meny med kategorier og en lenke til registreringssida.
*  Under menyen er det en live newsfeed som ruller horisontalt med de ferskeste sakene med kun overskrift og tidspunkt.
*  Når man trykker på en sak, kommer selve innholdet opp og man kan lese artikkelen.
*  Systemet har en RESTful løsning (se endepunktene i `server.js` i `server` mappa).
*  Jeg har brukt funksjonelle algoritmer istedenfor vanlige løkker og if/else-setninger.
*  Jeg har implementert tester på både server- og klient-siden. (23 tester på serversiden og 9 tester på klientsiden)
*  Jeg har implementert statisk tyepsjekking med Flow på både server- og klient-siden.
*  Jeg har brukt continious integration (CI) løsning på NTNU's GitLab server.
*  Klienten er delt opp i gjenbrukbare komponenter, og det har blitt brukt service-objekter.
*  All data er lagret i og hentes fra en database.
*  Det har blitt brukt database-modeller med databasekall strukturert i egne klasser.

### EKSTRA

*  For det første har jeg valgt å ikke ha en egen tabell i databasen for kategorier. Grunnen til det er at brukeren ikke kan opprette nye kategorier, og at man unngår en JOIN-operasjon i spørringene når man filtrerer på kategorier.
*  Har implementert livefeed med WebSocket, slik at newsfeeden faktisk er live. Har brukt socket.io i backend og socket.io-client i frontend for å få til dette.
*  Oppgaven ga inntrykk av at hvem som helst kunne redigere og slette artikler, så da bestemte jeg meg for å opprette et brukersystem slik at hver sak er tilknyttet en bruker (en bruker kan ha flere saker, men en sak har kun en bruker).
*  Det er mulig å registrere en bruker med brukernavn og passord. Av sikkerhetsmessige grunner passordene blir kryptert i databasen med (SALT-hashing).
*  Det er mulig for brukeren å logge inn med brukernavn og passord, og får da en token som varer i en time og som legges i x-access-token i header. Token blir signert med brukernavnet.
*  Man må altså ha en bruker for å kunne legge inn saker, slik at de skal være rediger- og slettbare.
*  Når brukeren har logget inn, blir brukeren presentert med den vanlige hovedsiden i tillegg til en oversikt over sine egne saker. Også mulighet for å logge ut.
*  Det er kun brukeren selv som kan slette og redigere sine egne saker.
*  Har også lagt til muligheten for å kunne kommentere saker med egenvalgt nick hvis man ikke er logget inn, ellers brukes brukernavnet.
*  Det er mulig for sakeieren å slette kommentarene til andre.
*  Jeg har også lagt til et ratingsystem for å upvote/downvote saker (negativ rating er mulig).
*  Sakene blir sortert etter rating på hovesidene og under kategoriene.
*  Jeg har også implementert en søk-funksjonalitet, slik at man kan søke etter saker. Søkestrengen finner sakene med overskriften slik at søkestrengen er en substring i overskriften.