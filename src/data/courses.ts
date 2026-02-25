import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  attachments?: { name: string; url: string }[];
  links?: { label: string; url: string }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  totalLessons: number;
  totalDuration: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "business-fundamentals",
    title: "Business Fundamentals",
    subtitle: "De basis van ondernemen onder de knie krijgen",
    thumbnail: course1,
    totalLessons: 5,
    totalDuration: "2u 15min",
    lessons: [
      {
        id: "les-1",
        title: "Introductie & Visie",
        duration: "24:30",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "In deze les leer je de fundamenten van een sterke bedrijfsvisie en hoe je deze kunt vertalen naar actie.",
        links: [{ label: "Aanvullende bronnen", url: "#" }],
      },
      {
        id: "les-2",
        title: "Strategie & Planning",
        duration: "31:15",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Leer hoe je een effectieve bedrijfsstrategie opzet en een uitvoerbaar plan maakt.",
        attachments: [{ name: "Strategie Template.pdf", url: "#" }],
      },
      {
        id: "les-3",
        title: "Financieel Management",
        duration: "28:45",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Begrijp de financiële basis die elke ondernemer moet kennen.",
      },
      {
        id: "les-4",
        title: "Marketing Essentials",
        duration: "26:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Ontdek de kernprincipes van effectieve marketing.",
      },
      {
        id: "les-5",
        title: "Groei & Schaling",
        duration: "25:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Leer hoe je jouw bedrijf duurzaam kunt opschalen.",
        links: [{ label: "Groeimodel spreadsheet", url: "#" }],
      },
    ],
  },
  {
    id: "leadership-mastery",
    title: "Leadership Mastery",
    subtitle: "Word de leider die teams inspireert",
    thumbnail: course2,
    totalLessons: 4,
    totalDuration: "1u 48min",
    lessons: [
      {
        id: "les-1",
        title: "De Mindset van een Leider",
        duration: "27:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Ontwikkel de mindset die nodig is om effectief leiding te geven.",
      },
      {
        id: "les-2",
        title: "Communicatie & Invloed",
        duration: "30:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Leer communiceren met impact en invloed uitoefenen.",
        attachments: [{ name: "Communicatie Framework.pdf", url: "#" }],
      },
      {
        id: "les-3",
        title: "Teambuilding",
        duration: "25:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Bouw een high-performance team dat resultaten levert.",
      },
      {
        id: "les-4",
        title: "Besluitvorming",
        duration: "26:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Neem betere beslissingen onder druk en onzekerheid.",
      },
    ],
  },
  {
    id: "sales-excellence",
    title: "Sales Excellence",
    subtitle: "Verkoop met overtuiging en integriteit",
    thumbnail: course3,
    totalLessons: 4,
    totalDuration: "1u 52min",
    lessons: [
      {
        id: "les-1",
        title: "Sales Psychologie",
        duration: "28:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Begrijp de psychologie achter aankoopbeslissingen.",
      },
      {
        id: "les-2",
        title: "Het Verkoopgesprek",
        duration: "32:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Structureer je verkoopgesprek voor maximaal resultaat.",
        attachments: [{ name: "Gespreksscript.pdf", url: "#" }],
      },
      {
        id: "les-3",
        title: "Bezwaren Overwinnen",
        duration: "24:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Leer omgaan met bezwaren en weerstand.",
      },
      {
        id: "les-4",
        title: "Closing Technieken",
        duration: "28:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Sluit deals met vertrouwen en elegantie.",
        links: [{ label: "Closing checklist", url: "#" }],
      },
    ],
  },
];
