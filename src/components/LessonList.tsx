import { Play, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Module, Lesson } from "@/data/courses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LessonListProps {
  modules: Module[];
  activeLesson: string;
  onSelectLesson: (id: string) => void;
}

const LessonList = ({ modules, activeLesson, onSelectLesson }: LessonListProps) => {
  // Find which module contains the active lesson so we can default-open it
  const activeModuleId = modules.find((m) =>
    m.lessons.some((l) => l.id === activeLesson)
  )?.id;

  let globalIndex = 0;

  return (
    <Accordion
      type="multiple"
      defaultValue={activeModuleId ? [activeModuleId] : [modules[0]?.id]}
      className="space-y-2"
    >
      {modules.map((mod) => {
        const isComingSoon = !!mod.comingSoon;
        return (
          <AccordionItem key={mod.id} value={mod.id} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                {mod.title}
                {isComingSoon && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    <Lock className="h-2.5 w-2.5" />
                    Binnenkort
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-2 space-y-0.5">
              {mod.lessons.map((lesson) => {
                if (!isComingSoon) globalIndex++;
                const idx = isComingSoon ? null : globalIndex;
                const isArticle = lesson.type === "article";
                return (
                  <button
                    key={lesson.id}
                    onClick={() => !isComingSoon && onSelectLesson(lesson.id)}
                    disabled={isComingSoon}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-lg p-3 text-left transition-all duration-200",
                      isComingSoon
                        ? "opacity-50 cursor-not-allowed border border-transparent"
                        : activeLesson === lesson.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-secondary border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                        isComingSoon
                          ? "bg-secondary text-muted-foreground"
                          : activeLesson === lesson.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {isComingSoon ? (
                        <Lock className="h-3 w-3" />
                      ) : activeLesson === lesson.id ? (
                        isArticle ? (
                          <FileText className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        )
                      ) : isArticle ? (
                        <FileText className="h-3 w-3" />
                      ) : (
                        idx
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          !isComingSoon && activeLesson === lesson.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {lesson.title}
                      </p>
                      {lesson.duration && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lesson.duration}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default LessonList;
