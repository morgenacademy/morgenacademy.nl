import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Clock,
  BookOpen,
  Zap,
  CheckCircle,
  Loader2,
  Lock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    name: "Marieke V.",
    role: "Marketing Manager",
    quote:
      "Na deze training heb ik binnen een week mijn eerste AI-assistent gebouwd. Heel praktisch en goed uitgelegd!",
    stars: 5,
  },
  {
    name: "Thomas B.",
    role: "Ondernemer",
    quote:
      "Eindelijk een training die niet alleen theorie is, maar je echt aan de slag laat gaan. Aanrader!",
    stars: 5,
  },
  {
    name: "Lisa K.",
    role: "HR Adviseur",
    quote:
      "De stap-voor-stap aanpak maakt het heel toegankelijk. Ik had geen technische achtergrond en kon het prima volgen.",
    stars: 5,
  },
];

const benefits = [
  "Direct toegang na betaling",
  "Levenslang beschikbaar",
  "31 praktische videolessen",
  "Bouw je eigen AI-assistent",
  "Downloadbare templates en checklists",
  "Op je eigen tempo leren",
];

const Checkout = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  if (!course || course.comingSoon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">
            Cursus niet gevonden
          </h1>
          <Link to="/">
            <Button variant="outline">Terug naar home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/betaling?course=${course.id}`;

      const { data, error } = await supabase.functions.invoke(
        "create-mollie-payment",
        {
          body: {
            courseId: course.id,
            courseTitle: course.title,
            amount: course.price || "49.00",
            email: email.trim().toLowerCase(),
            redirectUrl,
          },
        }
      );

      if (error || !data?.checkoutUrl) {
        throw new Error("Payment creation failed");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      toast({
        title: "Er ging iets mis",
        description: "Probeer het opnieuw of neem contact op.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-ui"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug
          </button>
          <div className="flex-1 text-center">
            <Link to="/">
              <span className="font-display text-xl font-semibold text-foreground tracking-tight">
                Morgen <span className="text-primary">Academy</span>
              </span>
            </Link>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left: Course info & social proof */}
          <div className="lg:col-span-3 space-y-10">
            {/* Course overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-5 items-start">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-28 h-20 rounded-lg object-cover shrink-0"
                />
                <div>
                  <h1 className="font-display text-2xl md:text-3xl text-foreground">
                    {course.title}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="font-display text-xl text-foreground mb-4">
                Wat je krijgt
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-display text-xl text-foreground mb-4">
                Wat anderen zeggen
              </h2>
              <div className="space-y-4">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-3.5 w-3.5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic">
                      "{t.quote}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t.name} · {t.role}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Checkout form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="sticky top-8"
            >
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                {/* Price */}
                <div className="text-center pb-4 border-b border-border">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Eenmalig
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl text-foreground">
                      €{course.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusief BTW · Levenslang toegang
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div>
                    <label className="text-xs font-ui text-muted-foreground mb-1.5 block">
                      E-mailadres
                    </label>
                    <Input
                      type="email"
                      placeholder="jouw@email.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={255}
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <Checkbox
                      checked={newsletter}
                      onCheckedChange={(checked) =>
                        setNewsletter(checked === true)
                      }
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      Keep me in the loop! Ik ontvang graag AI- en
                      automatiseringstips van Morgen 🚀
                    </span>
                  </label>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-sm uppercase tracking-wider"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Afrekenen"
                    )}
                  </Button>
                </form>

                {/* Trust signals */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span>Veilig betalen via Mollie (iDEAL, creditcard, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>Direct toegang na betaling</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {course.totalLessons} lessen · {course.totalDuration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4 text-primary shrink-0" />
                    <span>Levenslang toegang, op je eigen tempo</span>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <Zap className="h-3.5 w-3.5 text-primary inline -mt-0.5 mr-1" />
                    Niet tevreden? Neem binnen 14 dagen contact op en je krijgt je geld terug. Geen vragen.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
