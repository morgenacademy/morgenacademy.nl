import { courses } from "@/data/courses";

export type RecommendationKind = "course" | "podcast";

export interface RecommendationItem {
  id: string;
  kind: RecommendationKind;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta: string;
  relatedCourseIds: string[];
  comingSoon?: boolean;
  price?: string;
}

const courseRecommendations: RecommendationItem[] = courses.map((course) => ({
  id: course.id,
  kind: "course",
  title: course.title,
  subtitle: course.subtitle,
  image: course.thumbnail,
  href: course.comingSoon ? "/" : `/checkout/${course.id}`,
  cta: course.comingSoon ? "Binnenkort" : "Bekijk training",
  relatedCourseIds: [course.id],
  comingSoon: course.comingSoon,
  price: course.price,
}));

const podcastRecommendations: RecommendationItem[] = [
  {
    id: "podcast-ai-in-de-praktijk",
    kind: "podcast",
    title: "AI in de praktijk",
    subtitle: "Korte gesprekken en voorbeelden over slimmer werken met AI.",
    image: courses.find((course) => course.id === "ai-in-je-bedrijf")?.thumbnail ?? courses[0].thumbnail,
    href: "https://morgencompany.com",
    cta: "Luister podcast",
    relatedCourseIds: ["basistraining-ai", "ai-in-je-bedrijf", "claude-openai-training"],
  },
];

const recommendations = [...courseRecommendations, ...podcastRecommendations];

const recommendationOrderByCourseId: Record<string, string[]> = {
  "basistraining-ai": [
    "claude-openai-training",
    "agentic-ai",
    "vibecoden",
    "podcast-ai-in-de-praktijk",
    "ai-in-je-bedrijf",
  ],
  "agentic-ai": [
    "claude-openai-training",
    "ai-in-je-bedrijf",
    "podcast-ai-in-de-praktijk",
    "vibecoden",
  ],
  vibecoden: [
    "agentic-ai",
    "claude-openai-training",
    "podcast-ai-in-de-praktijk",
    "ai-in-je-bedrijf",
  ],
  "claude-openai-training": [
    "agentic-ai",
    "vibecoden",
    "podcast-ai-in-de-praktijk",
    "ai-in-je-bedrijf",
  ],
  "ai-in-je-bedrijf": [
    "basistraining-ai",
    "agentic-ai",
    "podcast-ai-in-de-praktijk",
    "claude-openai-training",
  ],
};

export function getRecommendationsForCourse(
  courseId: string,
  enrolledCourseIds: string[] = [],
  limit = 5
): RecommendationItem[] {
  const enrolledSet = new Set(enrolledCourseIds);
  const orderedIds = recommendationOrderByCourseId[courseId] ?? [];
  const ordered = orderedIds
    .map((id) => recommendations.find((item) => item.id === id))
    .filter((item): item is RecommendationItem => Boolean(item));

  const fallback = recommendations.filter(
    (item) => item.id !== courseId && !orderedIds.includes(item.id)
  );

  return [...ordered, ...fallback]
    .filter((item) => item.id !== courseId)
    .filter((item) => item.kind !== "course" || !enrolledSet.has(item.id))
    .slice(0, limit);
}

export function getRecommendationsForCourses(
  courseIds: string[],
  enrolledCourseIds: string[] = [],
  limit = 6
): RecommendationItem[] {
  const seen = new Set<string>();

  return courseIds
    .flatMap((courseId) => getRecommendationsForCourse(courseId, enrolledCourseIds, limit))
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, limit);
}
