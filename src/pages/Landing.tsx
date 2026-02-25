import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, ArrowRight, Sparkles, Bell, Users, Clock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import WaitlistDialog from "@/components/WaitlistDialog";
import IncompanyDialog from "@/components/IncompanyDialog";

const Landing = () => {
  const navigate = useNavigate();
  const [waitlistCourse, setWaitlistCourse] = useState<{ id: string; title: string } | null>(null);
  const [incompanyOpen, setIncompanyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
            Morgen <span className="text-primary">Academy</span>
          </h2>
          <Link to="/login">
            <Button variant="outline" size="sm" className="text-xs uppercase tracking-wider">
              Inloggen
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Online trainingen
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1]">
            Leer werken met AI & automatisering
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Praktische videotrainingen waarmee je direct aan de slag kunt. 
            Leer op je eigen tempo, waar en wanneer je wilt.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#trainingen">
              <Button size="lg" className="gap-2 text-sm uppercase tracking-wider">
                Bekijk trainingen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-sm uppercase tracking-wider">
                Al een account? Log in
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Courses */}
      <section id="trainingen" className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Trainingen
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-10">
            Ons aanbod
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`group overflow-hidden rounded-xl bg-card border border-border ${
                course.comingSoon ? "opacity-70" : ""
              }`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className={`h-full w-full object-cover ${
                    course.comingSoon ? "grayscale" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                {course.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-secondary/90 backdrop-blur-sm px-5 py-2.5 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium text-foreground tracking-wide">
                        Binnenkort beschikbaar
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {course.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {course.subtitle}
                </p>

                {course.comingSoon ? (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm w-full"
                      onClick={() => setWaitlistCourse({ id: course.id, title: course.title })}
                    >
                      <Bell className="h-4 w-4" />
                      Op de wachtlijst zetten
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {course.totalLessons} lessen · {course.totalDuration}
                    </span>
                    <div className="flex-1" />
                    {course.price && (
                      <span className="text-sm font-semibold text-foreground mr-2">
                        €{course.price}
                      </span>
                    )}
                    <Button
                      className="gap-2 text-sm"
                      onClick={() => navigate(`/checkout/${course.id}`)}
                    >
                      Koop nu
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Incompany / Live sectie */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-accent" />

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
                Live training
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Liever samen met je team?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Boek een incompany training en leer samen met je team werken met AI. 
                In twee uur krijgt je team een praktische, interactieve sessie op locatie of online.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span>10 personen incl.</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>2 uur</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl font-display font-semibold text-foreground">€ 995,-</span>
                <span className="text-xs text-muted-foreground">meer personen in overleg</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto md:pt-10">
              <Button
                size="lg"
                className="gap-2 text-sm uppercase tracking-wider w-full"
                onClick={() => setIncompanyOpen(true)}
              >
                <Mail className="h-4 w-4" />
                Training aanvragen
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We nemen binnen 1 werkdag contact op
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Waitlist Dialog */}
      <WaitlistDialog
        open={!!waitlistCourse}
        onOpenChange={(open) => !open && setWaitlistCourse(null)}
        courseId={waitlistCourse?.id || ""}
        courseTitle={waitlistCourse?.title || ""}
      />

      {/* Incompany Dialog */}
      <IncompanyDialog open={incompanyOpen} onOpenChange={setIncompanyOpen} />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Een initiatief van{" "}
            <a
              href="https://www.morgencompany.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Morgen Company
            </a>
          </p>
          <a
            href="https://www.morgencompany.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
          >
            © {new Date().getFullYear()} Morgen Company
          </a>
          <Link
            to="/privacy"
            className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
          >
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
