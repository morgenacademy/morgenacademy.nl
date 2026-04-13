export interface LiveSession {
  id: string;
  title: string;
  summary: string;
  startsAt: string;
  endsAt: string;
  formatLabel: string;
  location: string;
  seatsLeft: number;
  priceLabel: string;
  audience: string;
  supportLabel: string;
}

export const liveSessions: LiveSession[] = [
  {
    id: "basistraining-ai-live-2026-05-14",
    title: "Basistraining AI Live",
    summary:
      "Een compacte livesessie voor teams en professionals die slim willen starten met AI zonder eerst alles zelf uit te zoeken.",
    startsAt: "2026-05-14T09:30:00+02:00",
    endsAt: "2026-05-14T12:00:00+02:00",
    formatLabel: "Live online",
    location: "Zoom sessie",
    seatsLeft: 8,
    priceLabel: "€ 149 p.p.",
    audience: "Voor starters en snelle beslissers",
    supportLabel: "Inclusief replay en promptsheet",
  },
  {
    id: "ai-workflows-live-2026-05-28",
    title: "AI Workflows in de praktijk",
    summary:
      "Werk in een kleine groep aan concrete prompts, workflows en eerste automatiseringen die je dezelfde week nog kunt inzetten.",
    startsAt: "2026-05-28T13:30:00+02:00",
    endsAt: "2026-05-28T16:30:00+02:00",
    formatLabel: "Live online",
    location: "Teams workshop",
    seatsLeft: 5,
    priceLabel: "€ 179 p.p.",
    audience: "Voor professionals die al experimenteren",
    supportLabel: "Met werkboek en Q&A na afloop",
  },
  {
    id: "ai-kantooruren-2026-06-11",
    title: "AI Kantooruren: vragen, cases en feedback",
    summary:
      "Een live verdiepingsmoment waarin we echte praktijkcases bespreken en deelnemers helpen om van losse prompts naar een werkende routine te gaan.",
    startsAt: "2026-06-11T10:00:00+02:00",
    endsAt: "2026-06-11T11:30:00+02:00",
    formatLabel: "Hybride pilot",
    location: "Utrecht + online",
    seatsLeft: 10,
    priceLabel: "€ 95 p.p.",
    audience: "Voor alumni en nieuwe deelnemers",
    supportLabel: "Kleine groep, veel persoonlijke feedback",
  },
];
