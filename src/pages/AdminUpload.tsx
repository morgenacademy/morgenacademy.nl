import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { courses, getAllLessons } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Check, Video } from "lucide-react";

interface LessonVideo {
  course_id: string;
  lesson_id: string;
  video_url: string;
}

const LIBRARY_ID_KEY = "bunny-library-id";

const AdminUpload = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [libraryId, setLibraryId] = useState(() => localStorage.getItem(LIBRARY_ID_KEY) || "");
  const [lessonGuids, setLessonGuids] = useState<Record<string, string>>({});
  const [savedGuids, setSavedGuids] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const buildUrl = (guid: string) =>
    guid && libraryId ? `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}` : "";

  const extractGuid = (url: string) => {
    const match = url.match(/\/embed\/[^/]+\/([a-f0-9-]+)/i);
    return match ? match[1] : url; // fallback: treat as raw guid
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
    const loadUrls = async () => {
      const { data } = await supabase.from("lesson_videos").select("*");
      if (data) {
        const urlMap: Record<string, string> = {};
        (data as LessonVideo[]).forEach((row) => {
          urlMap[`${row.course_id}/${row.lesson_id}`] = row.video_url;
        });
        setLessonUrls(urlMap);
        setSavedUrls(urlMap);
      }
    };
    loadUrls();
  }, [isAdmin]);

  const handleUrlChange = (courseId: string, lessonId: string, url: string) => {
    setLessonUrls((prev) => ({ ...prev, [`${courseId}/${lessonId}`]: url }));
  };

  const handleSave = async (courseId: string, lessonId: string) => {
    const key = `${courseId}/${lessonId}`;
    const url = (lessonUrls[key] || "").trim();
    setSaving(key);

    const { error } = await supabase.from("lesson_videos").upsert(
      { course_id: courseId, lesson_id: lessonId, video_url: url, updated_at: new Date().toISOString() },
      { onConflict: "course_id,lesson_id" }
    );

    if (error) {
      toast.error("Opslaan mislukt: " + error.message);
    } else {
      setSavedUrls((prev) => ({ ...prev, [key]: url }));
      toast.success("URL opgeslagen");
    }
    setSaving(null);
  };

  const handleSaveAll = async () => {
    setSaving("all");
    const rows = Object.entries(lessonUrls)
      .filter(([, url]) => url.trim() !== "")
      .map(([key, url]) => {
        const [course_id, lesson_id] = key.split("/");
        return { course_id, lesson_id, video_url: url.trim(), updated_at: new Date().toISOString() };
      });

    if (rows.length === 0) { setSaving(null); return; }

    const { error } = await supabase.from("lesson_videos").upsert(rows, { onConflict: "course_id,lesson_id" });

    if (error) {
      toast.error("Opslaan mislukt: " + error.message);
    } else {
      const newSaved = { ...savedUrls };
      rows.forEach((r) => { newSaved[`${r.course_id}/${r.lesson_id}`] = r.video_url; });
      setSavedUrls(newSaved);
      toast.success(`${rows.length} URL's opgeslagen`);
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
            {saving === "all" ? "Opslaan..." : "Alles opslaan"}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-10">
        <p className="text-muted-foreground text-sm">
          Vul per les de Bunny Stream embed-URL in. Formaat:{" "}
          <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">
            https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_GUID
          </code>
        </p>

        {activeCourses.map((course) => (
          <div key={course.id}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">{course.title}</h2>
            <div className="space-y-1">
              {course.modules.map((mod) => {
                const modVideoLessons = mod.lessons.filter((l) => l.type !== "article");
                if (modVideoLessons.length === 0) return null;

                return (
                  <div key={mod.id} className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">{mod.title}</h3>
                    <div className="space-y-2">
                      {modVideoLessons.map((lesson) => {
                        const key = `${course.id}/${lesson.id}`;
                        const currentUrl = lessonUrls[key] || "";
                        const isSaved = savedUrls[key] === currentUrl && currentUrl !== "";
                        const isChanged = currentUrl !== (savedUrls[key] || "");

                        return (
                          <div key={lesson.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                            <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground min-w-[180px] shrink-0 truncate" title={lesson.title}>
                              {lesson.title}
                            </span>
                            <Input
                              placeholder="https://iframe.mediadelivery.net/embed/..."
                              value={currentUrl}
                              onChange={(e) => handleUrlChange(course.id, lesson.id, e.target.value)}
                              className="flex-1 text-sm h-9"
                            />
                            {isSaved ? (
                              <Check className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSave(course.id, lesson.id)}
                                disabled={saving === key || !isChanged}
                                className="shrink-0"
                              >
                                {saving === key ? "..." : "Opslaan"}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUpload;
