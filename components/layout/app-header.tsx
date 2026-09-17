"use client";

import { Menu, Search } from "lucide-react";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="font-semibold text-gray-900">
        📚 Library
      </div>

      <button
        className="rounded-lg p-2 hover:bg-gray-100"
        aria-label="Search"
      >
        <Search size={21} />
      </button>
    </header>
  );
}