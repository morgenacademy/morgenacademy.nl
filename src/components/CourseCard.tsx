import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link
        to={`/cursus/${course.id}`}
        className="group block overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.15)]"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm">
              <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground ml-0.5" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {course.subtitle}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{course.totalLessons} lessen</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{course.totalDuration}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
