import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ShieldAlert } from "lucide-react";

interface Resource {
  label: string;
  value: string;
}

interface PortalResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainingTitle: string;
  resources: Resource[];
}

const PortalResourcesDialog = ({ open, onOpenChange, trainingTitle, resources }: PortalResourcesDialogProps) => {
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
            const isLong = resource.value.length > 80;
            const isCopied = copiedIndex === index;

            return (
              <div key={index} className="rounded-lg border border-border bg-muted/50 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{resource.label}</span>
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
                </div>
                {isLong ? (
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
