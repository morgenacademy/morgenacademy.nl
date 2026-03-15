import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, ExternalLink, Lock } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import LessonList from "@/components/LessonList";
import { courses, getAllLessons } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  const allLessons = course ? getAllLessons(course) : [];
  const [activeLessonId, setActiveLessonId] = useState(allLessons[0]?.id || "");
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const [videoUrl, setVideoUrl] = useState("");
  const [enrolled, setEnrolled] = useState<boolean | null>(null);

  // Check enrollment
  useEffect(() => {
    if (!courseId) return;
    const checkEnrollment = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Admins always have access
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        setEnrolled(true);
        return;
      }

      const { data } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      setEnrolled(!!data);
    };
    checkEnrollment();
  }, [courseId]);

  // Fetch Bunny Stream URL from database
  useEffect(() => {
    if (!course || !activeLesson || !enrolled) return;
    const fetchUrl = async () => {
      const { data } = await supabase
        .from("lesson_videos")
        .select("video_url")
        .eq("course_id", course.id)
        .eq("lesson_id", activeLesson.id)
        .maybeSingle();

      setVideoUrl(data?.video_url || activeLesson.videoUrl || "");
    };
    fetchUrl();
  }, [activeLessonId, course?.id, activeLesson?.id, activeLesson?.videoUrl, enrolled]);

  if (!course || !activeLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cursus niet gevonden</p>
      </div>
    );
  }

  // Loading enrollment check
  if (enrolled === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // No access
  if (!enrolled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-4">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Geen toegang
          </h1>
          <p className="text-muted-foreground">
            Je hebt nog geen toegang tot deze training. Koop de training om te beginnen.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Terug naar dashboard
            </Button>
            <Button onClick={() => navigate(`/checkout/${courseId}`)}>
              Training kopen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isArticle = activeLesson.type === "article";

  return (
    <div className="min-h-screen bg-background">
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
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={activeLessonId}
          >
            {isArticle ? (
              <div className="rounded-xl bg-secondary/50 border border-border flex items-center justify-center min-h-[200px] p-10">
                <div className="text-center space-y-3">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeLesson.title}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {activeLesson.description}
                  </p>
                </div>
              </div>
            ) : (
              <VideoPlayer src={videoUrl} />
            )}

            <div className="mt-6">
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                {activeLesson.title}
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {activeLesson.description}
              </p>

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

          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 px-1">
                Lessen ({allLessons.length})
              </h3>
              <LessonList
                modules={course.modules}
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
