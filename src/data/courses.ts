import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";

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
  progress?: number; // 0-100
  comingSoon?: boolean;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "basistraining-ai",
    title: "Basistraining AI",
    subtitle: "Leer de fundamenten van kunstmatige intelligentie en pas het direct toe",
    thumbnail: course1,
    totalLessons: 5,
    totalDuration: "2u 15min",
    progress: 20,
    lessons: [
      {
        id: "les-1",
        title: "Introductie tot AI",
        duration: "24:30",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Wat is AI precies en hoe kun je het inzetten in je dagelijkse werk? In deze les leggen we de basis.",
        links: [{ label: "Aanvullende bronnen", url: "#" }],
      },
      {
        id: "les-2",
        title: "Prompt Engineering",
        duration: "31:15",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Leer hoe je effectieve prompts schrijft om het maximale uit AI-tools te halen.",
        attachments: [{ name: "Prompt Template.pdf", url: "#" }],
      },
      {
        id: "les-3",
        title: "AI Tools in de Praktijk",
        duration: "28:45",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Een overzicht van de beste AI-tools en hoe je ze kunt inzetten.",
      },
      {
        id: "les-4",
        title: "AI voor Content Creatie",
        duration: "26:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Gebruik AI om sneller en beter content te maken.",
      },
      {
        id: "les-5",
        title: "AI Strategie & Ethiek",
        duration: "25:00",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Hoe implementeer je AI verantwoord binnen je organisatie?",
        links: [{ label: "AI Ethiek framework", url: "#" }],
      },
    ],
  },
  {
    id: "automatiseren-kun-je-leren",
    title: "Automatiseren kun je leren",
    subtitle: "Van handmatig werk naar slimme automatiseringen",
    thumbnail: course2,
    totalLessons: 6,
    totalDuration: "Binnenkort beschikbaar",
    comingSoon: true,
    lessons: [],
  },
];
