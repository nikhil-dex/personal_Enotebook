"use client";

import Link from "next/link";
import { BookOpen, Settings, Plus, X } from "lucide-react";

interface AppSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const repositories: string[] = [];

export default function AppSidebar({
  mobile = false,
  onClose,
}: AppSidebarProps) {
  return (
    <aside
      className={`flex h-full w-64 flex-col border-r bg-white ${
        mobile ? "" : "hidden md:flex"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-5">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <BookOpen size={21} />
          <span>Library</span>
        </div>

        {mobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        <Link
  href="/repositories"
  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
>
  <Plus size={16} />
  Create Repository
</Link>
      </div>

      <nav className="flex-1 px-3">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Repositories
        </p>

        <div className="space-y-1">
  {repositories.map((repository) => (
    <Link
      key={repository}
      href={`/repositories/${repository}`}
      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
    >
      {repository}
    </Link>
  ))}
</div>
      </nav>

      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}