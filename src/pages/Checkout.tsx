import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  Loader2,
  Star,
  Quote,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { courses } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  "Bespaar 20% tijd en win een volle werkdag per week",
  "Eenvoudig en je hebt geen technische kennis nodig",
  "Bouw je eigen assistenten; automatisering die nooit slaapt",
  "Toekomstbestendig: van afwachter naar voorloper in je vak",
  "Volledig online, leer in je eigen tempo en plek",
  "Onbeperkt toegang en blijvende updates voor altijd",
];

const testimonials = [
  {
    quote:
      "Een heldere to the point training. Nu een week na de training al ontzettend veel tijdwinst geboekt. Een hele goede investering in jezelf en je bedrijf!",
    name: "Maaike Bemelmans",
  },
  {
    quote:
      "Hands on training die gelijk resultaat oplevert. Heel praktisch en duidelijk uitgelegd.",
    name: "Alies van der Linden",
  },
  {
    quote:
      "Vandaag volgde ik een workshop van Karin. Haar aanpak is grondig en duidelijk. Ze neemt de tijd om in te gaan op verdiepende vragen, ook als die even buiten het onderwerp vallen. Daarna brengt ze het gesprek weer scherp terug naar de kern. Dat werkt prettig en houdt focus.\n\nWat ik extra waardeer, is haar oog voor de verschillende niveaus in de groep. Iedereen kan aansluiten en wordt uitgedaagd om een stap verder te zetten.\n\nEen sterke en inspirerende workshop. Complimenten!",
    name: "Thomas B.",
  },
];

const Checkout = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const price = course.price || "49.00";
  const priceNum = parseFloat(price);
  const btw = priceNum - priceNum / 1.21;

  const handleCheckout = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !firstName.trim()) {
      // Scroll to form on mobile if fields missing
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast({
        title: "Vul je gegevens in",
        description: "Voornaam en e-mailadres zijn verplicht.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const redirectUrl = `${window.location.origin}/betaling?course=${course.id}`;

      // Save newsletter signup if opted in
      if (newsletter) {
        await supabase.from("newsletter_signups").upsert(
          { email: trimmedEmail, first_name: firstName.trim() || null },
          { onConflict: "email" }
        );
      }

      const { data, error } = await supabase.functions.invoke(
        "create-mollie-payment",
        {
          body: {
            courseId: course.id,
            courseTitle: course.title,
            amount: price,
            email: trimmedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
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
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-ui"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 text-center">
            <a href="https://www.morgenacademy.nl/">
              <span className="font-display text-xl font-semibold text-foreground tracking-tight">
                Morgen <span className="text-primary">Academy</span>
              </span>
            </a>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT: Sales copy + social proof */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Hero copy */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
                Stap op de AI trein
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  Claim je voorsprong. 100% online en onbeperkt toegang.
                </strong>{" "}
                De wereld verandert snel. Terwijl anderen nog handmatig werken,
                zet jij de turbo aan. In deze praktische online training leer je
                hoe je AI voor je laat werken. Geen vage theorie, maar directe
                tijdwinst.
              </p>
            </div>

            {/* Course image */}
            <div className="rounded-xl overflow-hidden border border-border">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Benefits */}
            <div>
              <h2 className="font-display text-xl text-foreground mb-4">
                Transformeer je werkroutine met slimme automatisering
              </h2>
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long description */}
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Leer efficiënt en zonder technisch gedoe AI te gebruiken om taken
                te automatiseren, lessen te volgen en continue updates te
                ontvangen. Je bouwt systematisch aan je eigen vaardigheden en
                krijgt levenslange toegang tot alle materialen.
              </p>
            </div>

            {/* Testimonials */}
            <div className="space-y-4 pt-2">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-card p-5 relative"
                >
                  <Quote className="h-4 w-4 text-primary/30 absolute top-4 right-4" />
                  <p className="text-sm text-foreground leading-relaxed italic pr-6">
                    {t.quote}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 font-ui font-medium">
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Checkout form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="sticky top-8 space-y-6">
              <form
                ref={formRef}
                onSubmit={handleCheckout}
                className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-6"
              >
                {/* Your details */}
                <div>
                  <h2 className="font-display text-xl text-foreground mb-4">
                    Jouw gegevens
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Voornaam"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        maxLength={50}
                      />
                      <Input
                        placeholder="Achternaam"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="E-mailadres"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                {/* Order summary */}
                <div>
                  <h2 className="font-display text-xl text-foreground mb-4">
                    Besteloverzicht
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Eenmalig inclusief 21% btw
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                        € {priceNum.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">
                          Totaal
                        </span>
                        <span className="text-lg font-display font-semibold text-foreground">
                          € {priceNum.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Totaalbedrag is inclusief € {btw.toFixed(2).replace(".", ",")} btw
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment methods - clickable */}
                <div>
                  <h2 className="font-display text-xl text-foreground mb-3">
                    Betaal direct met
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "iDEAL", icon: "https://www.mollie.com/external/icons/payment-methods/ideal.svg" },
                      { name: "Creditcard", icon: "https://www.mollie.com/external/icons/payment-methods/creditcard.svg" },
                    ].map((method) => (
                      <button
                        key={method.name}
                        type="button"
                        onClick={() => {
                          setSelectedMethod(method.name);
                          handleCheckout();
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                          selectedMethod === method.name
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background/50"
                        }`}
                      >
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="h-6 w-auto"
                        />
                        <span className="text-[10px] text-muted-foreground font-ui">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className={`flex items-start gap-2.5 cursor-pointer rounded-lg p-2 transition-colors ${!agree ? "bg-primary/5 border border-primary/20" : ""}`}>
                    <Checkbox
                      checked={agree}
                      onCheckedChange={(checked) => setAgree(checked === true)}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      Ik bevestig mijn aankoop en ga akkoord met de voorwaarden.
                    </span>
                  </label>

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
                </div>

                {/* CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-sm uppercase tracking-wider"
                  disabled={loading || !agree}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Afrekenen"
                  )}
                </Button>

                {/* Guarantee */}
                <div className="rounded-lg border border-success/20 bg-success/5 p-4 flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      14 dagen niet goed? Geld terug.
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Niet tevreden? Neem binnen 14 dagen contact op en je krijgt je volledige aankoopbedrag terug. Geen vragen, geen gedoe.
                    </p>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      100% veilig betalen
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      We gebruiken dezelfde beveiliging als je bank
                    </p>
                  </div>
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="text-center pt-1">
                  <Link
                    to="/privacy"
                    className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors"
                  >
                    Privacybeleid
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Totaal</p>
            <p className="text-lg font-display font-semibold text-foreground">
              € {priceNum.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <Button
            size="lg"
            className="text-sm uppercase tracking-wider px-8"
            disabled={loading}
            onClick={() => handleCheckout()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Afrekenen"
            )}
          </Button>
        </div>
      </div>

      {/* Bottom spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default Checkout;
