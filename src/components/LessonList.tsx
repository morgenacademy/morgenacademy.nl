import { Play, FileText } from "lucide-react";
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
      {modules.map((mod) => (
        <AccordionItem key={mod.id} value={mod.id} className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
            {mod.title}
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-2 space-y-0.5">
            {mod.lessons.map((lesson) => {
              globalIndex++;
              const idx = globalIndex;
              const isArticle = lesson.type === "article";
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={cn(
                    "w-full flex items-start gap-3 rounded-lg p-3 text-left transition-all duration-200",
                    activeLesson === lesson.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-secondary border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                      activeLesson === lesson.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {activeLesson === lesson.id ? (
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
                        activeLesson === lesson.id
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
      ))}
    </Accordion>
  );
};

export default LessonList;
