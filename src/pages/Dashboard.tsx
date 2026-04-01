import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import WaitlistDialog from "@/components/WaitlistDialog";
import { courses } from "@/data/courses";

const Dashboard = () => {
  const navigate = useNavigate();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [waitlistCourse, setWaitlistCourse] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if admin (admins see all courses as enrolled)
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        setEnrolledCourseIds(courses.filter((c) => !c.comingSoon).map((c) => c.id));
        return;
      }

      const { data } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      setEnrolledCourseIds(data?.map((e) => e.course_id) || []);
    };
    fetchEnrollments();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
            Morgen <span className="text-primary">Academy</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Uitloggen</span>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Welkom terug
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight max-w-xl">
            Jouw trainingen
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg leading-relaxed">
            Bekijk je cursussen en start direct met leren. Elk op je eigen tempo, waar en wanneer je wilt.
          </p>
        </motion.div>
      </section>

      {/* Course Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              enrolled={enrolledCourseIds.includes(course.id)}
              onWaitlist={course.comingSoon ? () => setWaitlistCourse({ id: course.id, title: course.title }) : undefined}
            />
          ))}
        </div>
      </section>

      <WaitlistDialog
        open={!!waitlistCourse}
        onOpenChange={(open) => !open && setWaitlistCourse(null)}
        courseId={waitlistCourse?.id || ""}
        courseTitle={waitlistCourse?.title || ""}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Morgen Academy is het trainingsplatform van{" "}
            <a
              href="https://www.morgencompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Morgen Company
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
