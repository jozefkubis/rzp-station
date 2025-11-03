"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Spinner from "../Spinner";

export default function ShiftLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm">
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Spinner />
      </div>
    </div>,
    document.body,
  );
}
