import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ShieldAlert, Download, Loader2 } from "lucide-react";

interface Resource {
  label: string;
  value: string;
  type?: "file";
  storagePath?: string;
  filename?: string;
  contentType?: string;
  size?: number;
}

interface PortalResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainingTitle: string;
  resources: Resource[];
  downloadingResourcePath?: string | null;
  onDownloadFile: (resource: Resource) => void;
}

const formatFileSize = (size?: number) => {
  if (!size) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const PortalResourcesDialog = ({
  open,
  onOpenChange,
  trainingTitle,
  resources,
  downloadingResourcePath,
  onDownloadFile,
}: PortalResourcesDialogProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{trainingTitle}</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            Deze gegevens zijn vertrouwelijk — deel ze niet verder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {resources.map((resource, index) => {
            const isFile = resource.type === "file" || !!resource.storagePath;
            const isLong = resource.value.length > 80;
            const isCopied = copiedIndex === index;
            const isDownloading = !!resource.storagePath && downloadingResourcePath === resource.storagePath;
            const fileSize = formatFileSize(resource.size);

            return (
              <div key={index} className="rounded-lg border border-border bg-muted/50 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{resource.label}</span>
                  {isFile && resource.storagePath ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadFile(resource)}
                      disabled={isDownloading}
                      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      Open
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(resource.value, index)}
                      className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-success" />
                          Gekopieerd
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Kopieer
                        </>
                      )}
                    </Button>
                  )}
                </div>
                {isFile ? (
                  <div className="rounded bg-background px-2 py-1.5 text-xs text-muted-foreground">
                    <p className="break-all font-medium text-foreground">
                      {resource.filename ?? resource.value}
                    </p>
                    {(resource.contentType || fileSize) && (
                      <p className="mt-1">
                        {[resource.contentType, fileSize].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ) : isLong ? (
                  <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap break-all rounded bg-background p-2 font-mono text-xs text-foreground">
                    {resource.value}
                  </pre>
                ) : (
                  <code className="block rounded bg-background px-2 py-1.5 font-mono text-xs text-foreground break-all">
                    {resource.value}
                  </code>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortalResourcesDialog;
