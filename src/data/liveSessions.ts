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
      "De online start van de Summer School: we zetten de route uit, maken kennis en vertalen AI naar concrete leerdoelen voor de komende twee maanden.",
    startsAt: "2026-07-01T10:00:00+02:00",
    endsAt: "2026-07-01T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Summer School € 250",
    audience: "Online en inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-duurzaam-ai-2026-07-15",
    title: "Live webinar",
    summary:
      "Een thematische online sessie om zelf verder te leren en je vragen te stellen. Denk bijvoorbeeld aan duurzaam AI-gebruik, ethiek of data.",
    startsAt: "2026-07-15T10:00:00+02:00",
    endsAt: "2026-07-15T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Summer School € 250",
    audience: "Online en inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-moreel-kompas-2026-07-29",
    title: "Live webinar",
    summary:
      "Een thematische online sessie om zelf verder te leren en je vragen te stellen. We sluiten aan bij wat er leeft in de groep.",
    startsAt: "2026-07-29T10:00:00+02:00",
    endsAt: "2026-07-29T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Summer School € 250",
    audience: "Online en inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
  {
    id: "summer-school-data-soevereiniteit-2026-08-12",
    title: "Live webinar",
    summary:
      "Een thematische online sessie om zelf verder te leren en je vragen te stellen. Voorbeelden zijn veiligheid, betere prompts of slim toepassen in je werk.",
    startsAt: "2026-08-12T10:00:00+02:00",
    endsAt: "2026-08-12T11:30:00+02:00",
    formatLabel: "Webinar",
    location: "Live online",
    seatsLeft: 25,
    priceLabel: "Summer School € 250",
    audience: "Online en inbegrepen bij Summer School",
    supportLabel: "Summer School live moment",
  },
];
