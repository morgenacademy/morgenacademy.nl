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
    const { slug, password, training_id } = await req.json();

    if (!slug || !password || !training_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to verify password and get signed URL
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify password via RPC
    const { data: verifyResult, error: verifyError } = await supabase.rpc(
      "portal_verify_password",
      { _slug: slug, _password: password }
    );

    if (verifyError || !verifyResult?.success) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const company_id = verifyResult.company_id;

    // Verify training belongs to this company and has a slide
    const { data: training, error: trainingError } = await supabase
      .from("portal_trainings")
      .select("slide_storage_path, slide_filename, company_id")
      .eq("id", training_id)
      .eq("company_id", company_id)
      .eq("is_active", true)
      .maybeSingle();

    if (trainingError || !training || !training.slide_storage_path) {
      return new Response(JSON.stringify({ error: "Training or slide not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate signed URL (5 minute expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("portal-slides")
      .createSignedUrl(training.slide_storage_path, 300);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new Error("Failed to generate download URL");
    }

    return new Response(
      JSON.stringify({
        download_url: signedUrlData.signedUrl,
        filename: training.slide_filename || "slides.pdf",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("portal-download error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
