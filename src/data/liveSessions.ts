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
    id: "summer-school-kickoff-2026-07-01",
    title: "KickOff",
    summary:
      "De start van de Summer School: we zetten de route uit, maken kennis en vertalen AI naar concrete leerdoelen voor de komende twee maanden.",
    startsAt: "2026-07-01T10:00:00+02:00",
    endsAt: "2026-07-01T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Los € 39,95",
    audience: "Los te boeken of inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-duurzaam-ai-2026-07-15",
    title: "Webinar Duurzaam gebruik van AI: de impact op onze wereld",
    summary:
      "Over de ecologische en maatschappelijke impact van AI, en hoe je bewuster keuzes maakt in dagelijks gebruik.",
    startsAt: "2026-07-15T10:00:00+02:00",
    endsAt: "2026-07-15T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Los € 39,95",
    audience: "Los te boeken of inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-moreel-kompas-2026-07-29",
    title: "Moreel kompas: veiligheid en ethiek",
    summary:
      "Een praktische sessie over verantwoord werken met AI: veiligheid, ethiek en het maken van afwegingen in echte situaties.",
    startsAt: "2026-07-29T10:00:00+02:00",
    endsAt: "2026-07-29T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Los € 39,95",
    audience: "Los te boeken of inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-data-soevereiniteit-2026-08-12",
    title: "Data soevereiniteit",
    summary:
      "Over grip houden op data, eigenaarschap en bewuste keuzes rond tools, opslag en samenwerking.",
    startsAt: "2026-08-12T10:00:00+02:00",
    endsAt: "2026-08-12T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Los € 39,95",
    audience: "Los te boeken of inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
];
