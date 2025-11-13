"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string | null;
  companyName: string;
};

export function RequestDocumentDialog({
  open,
  onOpenChange,
  documentName,
  companyName,
}: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!documentName) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          document: documentName,
          company: companyName,
          message: message.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Could not register the request.");
      }

      toast.success("Request logged. We'll reply via email soon.");
      setEmail("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unexpected error.";
      toast.error(description);
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabled = !documentName || email.trim().length === 0 || isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setEmail("");
          setMessage("");
        }
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request access</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Document
            </Label>
            <p className="font-medium">{documentName ?? "Select a document"}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Your work email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">
              Context (optional)
            </Label>
            <Textarea
              id="message"
              rows={3}
              placeholder="Tell us why you need access to this document."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={disabled}>
              {isSubmitting ? "Sending..." : "Request document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
