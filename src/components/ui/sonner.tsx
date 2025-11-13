"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="light"
      toastOptions={{
        duration: 3500,
      }}
    />
  );
}

