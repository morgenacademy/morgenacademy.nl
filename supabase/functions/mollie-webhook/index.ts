import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const paymentId = formData.get("id") as string;

    if (!paymentId) {
      return new Response("Missing payment id", { status: 400, headers: corsHeaders });
    }

    const mollieApiKey = Deno.env.get("MOLLIE_API_KEY")!;

    // Fetch payment status from Mollie
    const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mollieApiKey}`,
      },
    });

    if (!mollieRes.ok) {
      console.error("Failed to fetch Mollie payment:", await mollieRes.text());
      return new Response("Failed to verify payment", { status: 500, headers: corsHeaders });
    }

    const payment = await mollieRes.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update payment status
    await supabase
      .from("payments")
      .update({
        status: payment.status,
        updated_at: new Date().toISOString(),
      })
      .eq("mollie_payment_id", paymentId);

    console.log(`Payment ${paymentId} updated to status: ${payment.status}`);

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal server error", { status: 500, headers: corsHeaders });
  }
});
