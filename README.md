# Makelaarsmaatje

Snellere lead-opvolging voor makelaars, zonder heen-en-weer mailen.

Een interactieve demo gebouwd met Next.js 14, geoptimaliseerd voor showcases aan makelaars.

## Wat het doet

- **Inbox van Funda-leads** met auto-kwalificatie en prioritering
- **AI-concept antwoorden** klaar om te versturen via WhatsApp of e-mail
- **Klant-boekingsflow** met 3-staps kwalificatie en self-service planning
- **Teamagenda** met overzicht van bezichtigingen
- **Wekelijkse rapportage** voor verkopers
- **Statistieken** over reactietijd, funnel, en impact

## Werkt direct na deployment

Geen database, geen login, geen API keys nodig. Alles werkt in-memory zodat je de demo veilig kan delen met makelaars zonder risico's.

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Geen externe libraries voor styling — alles inline
- Geen database — demo-data in `app/data.ts`

## Lokaal draaien

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment naar Vercel

1. Push naar GitHub
2. Import in Vercel
3. Geen environment variables nodig
4. Deploy

## Demo-data aanpassen

Open `app/data.ts` om team-leden, leads, en kwalificaties aan te passen.
