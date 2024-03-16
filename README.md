# learnbeat-puppeteer

Learnbeat speedrun bot 🇳🇱

## Wat doet deze Puppeteer bot?

Deze bot automatiseert authenticatie met Somtoday, zodat je vervolgens een learnbeat woordenlijst kunt speedrunnen.
De bot maakt er een screenshot van en zet deze in de `screenshots` directory.

## Configuratie

De bot is te configureren via `config.json`. Het schema van dit bestand spreekt aardig voor zich, en de zod validator is te vinden in `src/config.ts`, maar hierbij de hoofdlijnen.

- **schoolName**: de schoolnaam in Somtoday. Dit kan ook het eerste stukje van de naam zijn, zolang je maar de opgegeven waarde + ENTER in Somtoday kan intypen en Somtoday dan begrijpt welke school je bedoelde werkt het.
- **username**: de gebruikersnaam in Somtoday (let op: sommige scholen gebruiken andere methodes om in te loggen, dus het kan zijn dat dit niet werkt, maak dan [een issue](https://github.com/25huizengek1/minitoets-puppeteer/issues/new/choose))
- **password**: het wachtwoord van je account
- **shouldCheckHeadless** (optioneel, default = `false`): geeft aan of er moet gecheckt moet worden of het herkenbaar is dat Chrome in headless modus is
- **failChance** (optioneel, default = `0.4`): kans dat de bot het verkeerde (`...`) antwoord geeft.
- **screenshotDirectory** (optioneel, default = `screenshots`): de map waarin de screenshots terecht komen, wordt aangemaakt als het pad niet bestaat.

## Licentie

De broncode is beschermd onder de GNU GPLv3 licentie. Een kopie daarvan is te vinden in `LICENSE`.
