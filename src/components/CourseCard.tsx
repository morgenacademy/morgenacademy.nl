import { motion } from "framer-motion";
import { Play, Lock, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
  index: number;
  enrolled?: boolean;
}

const CourseCard = ({ course, index, enrolled = false }: CourseCardProps) => {
  const isLocked = !enrolled && !course.comingSoon;
  const Wrapper = course.comingSoon ? "div" : Link;
  const wrapperProps = course.comingSoon
    ? {}
    : enrolled
    ? { to: `/cursus/${course.id}` }
    : { to: `/checkout/${course.id}` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Wrapper
        {...(wrapperProps as any)}
        className={`group block overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 ${
          course.comingSoon
            ? "cursor-default opacity-70"
            : "hover:border-primary/30 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.15)]"
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              course.comingSoon ? "grayscale" : "group-hover:scale-105"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

          {course.comingSoon ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-secondary/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-foreground tracking-wide">
                  Binnenkort
                </span>
              </div>
            </div>
          ) : enrolled ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm">
                <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground ml-0.5" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-primary/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">
                  Kopen
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {course.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {course.subtitle}
          </p>

          {/* Progress bar or meta */}
          {course.comingSoon ? (
            <div className="mt-4 text-xs text-muted-foreground">
              <span>In ontwikkeling</span>
            </div>
          ) : enrolled ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{course.totalLessons} lessen · {course.totalDuration}</span>
                {course.progress !== undefined && (
                  <span className="text-primary font-medium">{course.progress}%</span>
                )}
              </div>
              {course.progress !== undefined && (
                <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {course.totalLessons} lessen · {course.totalDuration}
              </span>
              {course.price && (
                <span className="text-sm font-semibold text-primary">
                  € {parseFloat(course.price).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
};

export default CourseCard;
