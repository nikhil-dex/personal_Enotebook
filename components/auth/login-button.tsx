"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("github")}
      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
    >
      Continue with GitHub
    </button>
  );
}