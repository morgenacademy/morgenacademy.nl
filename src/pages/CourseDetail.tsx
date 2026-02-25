import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import LessonList from "@/components/LessonList";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const [activeLessonId, setActiveLessonId] = useState(course?.lessons[0]?.id || "");
  const activeLesson = course?.lessons.find((l) => l.id === activeLessonId) || course?.lessons[0];
  const [videoUrl, setVideoUrl] = useState(activeLesson?.videoUrl || "");

  useEffect(() => {
    if (!course || !activeLesson) return;
    const getStorageVideo = async () => {
      const filePath = `${course.id}/${activeLesson.id}.mp4`;
      const { data } = await supabase.storage
        .from("course-videos")
        .createSignedUrl(filePath, 3600);

      if (data?.signedUrl) {
        setVideoUrl(data.signedUrl);
      } else {
        setVideoUrl(activeLesson.videoUrl);
      }
    };
    getStorageVideo();
  }, [activeLessonId, course?.id, activeLesson?.videoUrl, activeLesson?.id]);

  if (!course || !activeLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cursus niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Terug</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h2 className="font-display text-lg font-semibold text-foreground truncate">
            {course.title}
          </h2>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={activeLessonId}
          >
            <VideoPlayer src={videoUrl} />

            <div className="mt-6">
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                {activeLesson.title}
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {activeLesson.description}
              </p>

              {/* Attachments & Links */}
              {(activeLesson.attachments || activeLesson.links) && (
                <div className="mt-6 space-y-2">
                  {activeLesson.attachments?.map((att) => (
                    <a
                      key={att.name}
                      href={att.url}
                      className="flex items-center gap-3 rounded-lg bg-secondary p-3.5 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      {att.name}
                    </a>
                  ))}
                  {activeLesson.links?.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-secondary p-3.5 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-primary" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar - Lesson List */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 px-1">
                Lessen ({course.lessons.length})
              </h3>
              <LessonList
                lessons={course.lessons}
                activeLesson={activeLessonId}
                onSelectLesson={setActiveLessonId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
