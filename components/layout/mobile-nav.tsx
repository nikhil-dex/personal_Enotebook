"use client";

import AppSidebar from "./app-sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({
  open,
  onClose,
}: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative h-full w-72 max-w-[85vw]">
        <AppSidebar mobile onClose={onClose} />
      </div>
    </div>
  );
}