import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check, Loader2, Film, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { courses } from "@/data/courses";
import { useToast } from "@/hooks/use-toast";

const AdminUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadedVideos, setUploadedVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) {
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      checkExistingVideos();
    };
    checkAdmin();
  }, [navigate]);

  const checkExistingVideos = async () => {
    const { data } = await supabase.storage.from("course-videos").list("", { limit: 100 });
    if (data) {
      const existing: Record<string, boolean> = {};
      data.forEach((file) => {
        existing[file.name] = true;
      });
      setUploadedVideos(existing);
    }
  };

  const handleUpload = async (courseId: string, lessonId: string, file: File) => {
    const key = `${courseId}/${lessonId}`;
    setUploading(key);

    try {
      const filePath = `${courseId}/${lessonId}.mp4`;

      const { error } = await supabase.storage
        .from("course-videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      setUploadedVideos((prev) => ({ ...prev, [filePath]: true }));
      toast({
        title: "Video geüpload!",
        description: `${lessonId} is succesvol geüpload.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Upload mislukt",
        description: err.message || "Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const availableCourses = courses.filter((c) => !c.comingSoon);

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

      <main className="mx-auto max-w-4xl px-6 py-10">
        {availableCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              {course.title}
            </h2>

            <div className="space-y-3">
              {course.lessons.map((lesson) => {
                const filePath = `${course.id}/${lesson.id}.mp4`;
                const isUploaded = uploadedVideos[filePath];
                const isCurrentlyUploading = uploading === `${course.id}/${lesson.id}`;

                return (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Film className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUploaded && (
                        <span className="flex items-center gap-1 text-sm text-primary">
                          <Check className="h-4 w-4" /> Geüpload
                        </span>
                      )}

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/mp4,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(course.id, lesson.id, file);
                          }}
                          disabled={isCurrentlyUploading}
                        />
                        <Button
                          variant={isUploaded ? "outline" : "default"}
                          size="sm"
                          disabled={isCurrentlyUploading}
                          asChild
                        >
                          <span>
                            {isCurrentlyUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                {isUploaded ? "Vervangen" : "Upload"}
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default AdminUpload;
