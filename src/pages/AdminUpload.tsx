import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Check, Video, Settings } from "lucide-react";

const LIBRARY_ID_KEY = "bunny-library-id";

const AdminUpload = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [libraryId, setLibraryId] = useState(() => localStorage.getItem(LIBRARY_ID_KEY) || "");
  const [guids, setGuids] = useState<Record<string, string>>({});
  const [savedGuids, setSavedGuids] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const buildUrl = (guid: string) =>
    guid && libraryId ? `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}` : "";

  const extractGuid = (url: string) => {
    const match = url.match(/\/embed\/[^/]+\/([a-f0-9-]+)/i);
    return match ? match[1] : url;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) { navigate("/dashboard"); return; }
      setIsAdmin(true);
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase.from("lesson_videos").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: { course_id: string; lesson_id: string; video_url: string }) => {
          map[`${row.course_id}/${row.lesson_id}`] = extractGuid(row.video_url);
        });
        setGuids(map);
        setSavedGuids(map);
      }
    };
    load();
  }, [isAdmin]);

  const handleLibraryChange = (val: string) => {
    setLibraryId(val);
    localStorage.setItem(LIBRARY_ID_KEY, val);
  };

  const handleSaveAll = async () => {
    if (!libraryId.trim()) { toast.error("Vul eerst je Bunny Library ID in"); return; }
    setSaving("all");

    const rows = Object.entries(guids)
      .filter(([, guid]) => guid.trim() !== "")
      .map(([key, guid]) => {
        const [course_id, lesson_id] = key.split("/");
        return { course_id, lesson_id, video_url: buildUrl(guid.trim()), updated_at: new Date().toISOString() };
      });

    if (rows.length === 0) { setSaving(null); return; }

    const { error } = await supabase.from("lesson_videos").upsert(rows, { onConflict: "course_id,lesson_id" });

    if (error) {
      toast.error("Opslaan mislukt: " + error.message);
    } else {
      const newSaved = { ...savedGuids };
      rows.forEach((r) => {
        newSaved[`${r.course_id}/${r.lesson_id}`] = extractGuid(r.video_url);
      });
      setSavedGuids(newSaved);
      toast.success(`${rows.length} video's opgeslagen`);
    }
    setSaving(null);
  };

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const activeCourses = courses.filter((c) => !c.comingSoon);
  const filledCount = Object.values(guids).filter((g) => g.trim()).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-xl font-semibold text-foreground">Video URL beheer</h1>
          </div>
          <Button onClick={handleSaveAll} disabled={saving === "all"} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {saving === "all" ? "Opslaan..." : `Alles opslaan (${filledCount})`}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Library ID */}
        <div className="rounded-xl border border-border bg-secondary/30 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Bunny Stream Library ID</span>
          </div>
          <Input
            placeholder="Bijv. 123456"
            value={libraryId}
            onChange={(e) => handleLibraryChange(e.target.value)}
            className="max-w-xs text-sm h-9"
          />
          <p className="text-xs text-muted-foreground">
            Vind je in het Bunny Stream dashboard. Vul deze één keer in, daarna plak je per les alleen het korte Video GUID.
          </p>
        </div>

        {/* Lessons */}
        {activeCourses.map((course) => (
          <div key={course.id}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">{course.title}</h2>
            {course.modules.map((mod) => {
              const videoLessons = mod.lessons.filter((l) => l.type !== "article");
              if (videoLessons.length === 0) return null;

              return (
                <div key={mod.id} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">{mod.title}</h3>
                  <div className="space-y-2">
                    {videoLessons.map((lesson) => {
                      const key = `${course.id}/${lesson.id}`;
                      const guid = guids[key] || "";
                      const isSaved = savedGuids[key] === guid && guid !== "";

                      return (
                        <div key={lesson.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                          <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground min-w-[180px] shrink-0 truncate" title={lesson.title}>
                            {lesson.title}
                          </span>
                          <Input
                            placeholder="Video GUID (bijv. a1b2c3d4-...)"
                            value={guid}
                            onChange={(e) => setGuids((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="flex-1 text-sm h-9 font-mono"
                          />
                          {isSaved && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUpload;
