"use client";

import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "./login-button";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
    );
  }

  if (!session) {
    return <LoginButton />;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {session.user?.name ?? session.user?.email}
      </span>

      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  );
}