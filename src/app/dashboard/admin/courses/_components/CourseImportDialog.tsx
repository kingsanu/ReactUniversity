"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CourseImportDialogProps {
  onImport: (url: string) => Promise<void>;
}

export function CourseImportDialog({ onImport }: CourseImportDialogProps) {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsImporting(true);
    try {
      await onImport(url.trim());
      setUrl("");
      setIsOpen(false);
      toast.success("Import job started. Check status in a moment.");
    } catch (error) {
      toast.error("Failed to start import. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Import Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Course from URL</DialogTitle>
          <DialogDescription>
            Paste a Coursera course URL to automatically fetch and import course
            details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">Course URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://coursera.org/learn/example-course"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isImporting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={isImporting || !url.trim()}
            className="gap-2"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isImporting ? "Importing..." : "Start Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
