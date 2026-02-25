import { Play, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/data/courses";

interface LessonListProps {
  lessons: Lesson[];
  activeLesson: string;
  onSelectLesson: (id: string) => void;
}

const LessonList = ({ lessons, activeLesson, onSelectLesson }: LessonListProps) => {
  return (
    <div className="space-y-1">
      {lessons.map((lesson, index) => (
        <button
          key={lesson.id}
          onClick={() => onSelectLesson(lesson.id)}
          className={cn(
            "w-full flex items-start gap-3 rounded-lg p-3.5 text-left transition-all duration-200",
            activeLesson === lesson.id
              ? "bg-primary/10 border border-primary/20"
              : "hover:bg-secondary border border-transparent"
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
              activeLesson === lesson.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {activeLesson === lesson.id ? (
              <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
            ) : (
              index + 1
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium truncate",
                activeLesson === lesson.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {lesson.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default LessonList;
