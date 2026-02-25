import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading");
  const courseId = searchParams.get("course");

  useEffect(() => {
    const checkPayment = async () => {
      // Give Mollie webhook a moment to process
      await new Promise((r) => setTimeout(r, 2000));

      if (!courseId) {
        setStatus("failed");
        return;
      }

      const { data } = await supabase
        .from("payments")
        .select("status")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data?.status === "paid") {
        setStatus("paid");
      } else {
        setStatus("failed");
      }
    };

    checkPayment();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Betaling verwerken...
            </h1>
            <p className="mt-2 text-muted-foreground">Even geduld, we controleren je betaling.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Betaling geslaagd!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Je hebt nu toegang tot de training. Log in om te beginnen.
            </p>
            <Link to="/login" className="mt-6 inline-block">
              <Button size="lg">Naar inloggen</Button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Betaling niet gelukt
            </h1>
            <p className="mt-2 text-muted-foreground">
              Er ging iets mis met je betaling. Probeer het opnieuw.
            </p>
            <Link to="/" className="mt-6 inline-block">
              <Button size="lg" variant="outline">Terug naar trainingen</Button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentStatus;
