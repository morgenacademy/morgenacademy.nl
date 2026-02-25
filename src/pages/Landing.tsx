import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const [loadingCourse, setLoadingCourse] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBuy = async (courseId: string, courseTitle: string, price: string) => {
    setLoadingCourse(courseId);
    try {
      const email = prompt("Vul je e-mailadres in om af te rekenen:");
      if (!email) {
        setLoadingCourse(null);
        return;
      }

      const redirectUrl = `${window.location.origin}/betaling?course=${courseId}`;

      const { data, error } = await supabase.functions.invoke("create-mollie-payment", {
        body: {
          courseId,
          courseTitle,
          amount: price,
          email,
          redirectUrl,
        },
      });

      if (error || !data?.checkoutUrl) {
        throw new Error("Payment creation failed");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      toast({
        title: "Fout bij betaling",
        description: "Er ging iets mis. Probeer het opnieuw.",
        variant: "destructive",
      });
      setLoadingCourse(null);
    }
  };

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
                    <p className="text-sm text-muted-foreground">In ontwikkeling — binnenkort beschikbaar</p>
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
                      disabled={loadingCourse === course.id}
                      onClick={() => handleBuy(course.id, course.title, course.price || "49.00")}
                    >
                      {loadingCourse === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Koop nu
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Een initiatief van{" "}
            <a
              href="https://morgencompany.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Morgen Company
            </a>
          </p>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Morgen Academy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
