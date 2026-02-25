import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check, Loader2, Film, ArrowLeft, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { courses, getAllLessons } from "@/data/courses";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface PendingFile {
  file: File;
  lessonId: string | null;
}

const AdminUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<Record<string, boolean>>({});
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  const course = courses.find((c) => !c.comingSoon);
  const allLessons = course ? getAllLessons(course) : [];
  const videoLessons = allLessons.filter((l) => l.type !== "article");

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
      checkExistingVideos();
    };
    checkAdmin();
  }, [navigate]);

  const checkExistingVideos = async () => {
    if (!course) return;
    const { data } = await supabase.storage.from("course-videos").list(course.id, { limit: 200 });
    if (data) {
      const existing: Record<string, boolean> = {};
      data.forEach((file) => {
        existing[`${course.id}/${file.name}`] = true;
      });
      setUploadedVideos(existing);
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPending: PendingFile[] = files.map((file) => ({ file, lessonId: null }));
    setPendingFiles((prev) => [...prev, ...newPending]);
    e.target.value = "";
  };

  const updateLessonAssignment = (index: number, lessonId: string) => {
    setPendingFiles((prev) =>
      prev.map((pf, i) => (i === index ? { ...pf, lessonId } : pf))
    );
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const assignedLessonIds = pendingFiles
    .map((pf) => pf.lessonId)
    .filter(Boolean) as string[];

  const canUpload =
    pendingFiles.length > 0 &&
    pendingFiles.every((pf) => pf.lessonId !== null);

  const handleBulkUpload = async () => {
    if (!course || !canUpload) return;
    setIsBulkUploading(true);
    setUploadProgress({ done: 0, total: pendingFiles.length });

    let successes = 0;
    let failures = 0;

    for (const pf of pendingFiles) {
      const filePath = `${course.id}/${pf.lessonId}.mp4`;
      try {
        const { error } = await supabase.storage
          .from("course-videos")
          .upload(filePath, pf.file, { cacheControl: "3600", upsert: true });
        if (error) throw error;
        setUploadedVideos((prev) => ({ ...prev, [filePath]: true }));
        successes++;
      } catch (err: any) {
        console.error(`Upload failed for ${pf.file.name}:`, err);
        failures++;
      }
      setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    setIsBulkUploading(false);
    setPendingFiles([]);

    toast({
      title: failures === 0 ? "Alle video's geüpload!" : "Upload voltooid met fouten",
      description: `${successes} gelukt, ${failures} mislukt.`,
      variant: failures > 0 ? "destructive" : "default",
    });
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-5">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">
            Video Upload <span className="text-primary">Admin</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-10 cursor-pointer hover:border-primary/40 transition-colors">
            <input
              type="file"
              accept="video/mp4,video/*"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
              disabled={isBulkUploading}
            />
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">
              Klik om video's te selecteren
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Selecteer meerdere bestanden tegelijk, wijs ze daarna toe aan lessen
            </p>
          </label>
        </motion.div>

        {/* Pending files list */}
        {pendingFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {pendingFiles.length} bestand{pendingFiles.length !== 1 && "en"} geselecteerd
            </h2>

            <div className="space-y-2">
              {pendingFiles.map((pf, index) => (
                <div
                  key={`${pf.file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <Film className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {pf.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(pf.file.size)}
                    </p>
                  </div>

                  <Select
                    value={pf.lessonId || ""}
                    onValueChange={(val) => updateLessonAssignment(index, val)}
                  >
                    <SelectTrigger className="w-[280px] shrink-0">
                      <SelectValue placeholder="Kies een les..." />
                    </SelectTrigger>
                    <SelectContent>
                      {course?.modules.map((mod) => (
                        <div key={mod.id}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {mod.title}
                          </div>
                          {mod.lessons
                            .filter((l) => l.type !== "article")
                            .map((lesson) => {
                              const alreadyAssigned =
                                assignedLessonIds.includes(lesson.id) &&
                                pf.lessonId !== lesson.id;
                              const alreadyUploaded =
                                uploadedVideos[`${course.id}/${lesson.id}.mp4`];
                              return (
                                <SelectItem
                                  key={lesson.id}
                                  value={lesson.id}
                                  disabled={alreadyAssigned}
                                >
                                  <span className="flex items-center gap-2">
                                    {lesson.title}
                                    {alreadyUploaded && (
                                      <Check className="h-3 w-3 text-primary inline" />
                                    )}
                                  </span>
                                </SelectItem>
                              );
                            })}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeFile(index)}
                    disabled={isBulkUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {isBulkUploading && (
              <div className="space-y-2">
                <Progress
                  value={(uploadProgress.done / uploadProgress.total) * 100}
                />
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress.done} / {uploadProgress.total} geüpload...
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={!canUpload || isBulkUploading}
              onClick={handleBulkUpload}
            >
              {isBulkUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploaden...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Alles uploaden
                </>
              )}
            </Button>
          </div>
        )}

        {/* Already uploaded overview */}
        {Object.keys(uploadedVideos).length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Al geüpload
            </h2>
            <div className="space-y-1">
              {videoLessons
                .filter((l) => uploadedVideos[`${course?.id}/${l.id}.mp4`])
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 rounded-lg p-3 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground">{lesson.title}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUpload;
