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

    // Update payment status and get payment details
    const { data: paymentRow } = await supabase
      .from("payments")
      .update({
        status: payment.status,
        updated_at: new Date().toISOString(),
      })
      .eq("mollie_payment_id", paymentId)
      .select("id, course_id, user_email")
      .single();

    console.log(`Payment ${paymentId} updated to status: ${payment.status}`);

    // If payment succeeded, grant course access
    if (payment.status === "paid" && paymentRow) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users?.users?.find(
        (u) => u.email?.toLowerCase() === paymentRow.user_email?.toLowerCase()
      );

      if (user) {
        const { error: enrollError } = await supabase
          .from("course_enrollments")
          .upsert(
            {
              user_id: user.id,
              course_id: paymentRow.course_id,
              payment_id: paymentRow.id,
            },
            { onConflict: "user_id,course_id" }
          );

        if (enrollError) {
          console.error("Failed to create enrollment:", enrollError.message);
        } else {
          console.log(`Enrollment created: user ${user.id} -> course ${paymentRow.course_id}`);
        }
      } else {
        console.warn(`No auth user found for email ${paymentRow.user_email}`);
      }
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal server error", { status: 500, headers: corsHeaders });
  }
});
