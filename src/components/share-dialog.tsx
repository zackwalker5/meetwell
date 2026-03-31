"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShareIcon, CopyIcon, CheckIcon } from "lucide-react";

interface ShareDialogProps {
  slug: string;
}

export function ShareDialog({ slug }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/e/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <ShareIcon data-icon="inline-start" />
            Share
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input readOnly value={url} className="text-sm" />
          <Button onClick={handleCopy} className="shrink-0">
            {copied ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon data-icon="inline-start" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
