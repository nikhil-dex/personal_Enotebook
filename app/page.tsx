"use client";

import { useState } from "react";
import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <AppHeader
          onMenuClick={() => setMobileNavOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Your Library
              </h1>
		<LoginButton />

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Organize your knowledge, notes and resources.
              </p>
            </div>

            {/* Empty State */}
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed bg-white p-8">
              <div className="max-w-md text-center">
                <div className="mb-4 text-5xl">📚</div>

                <h2 className="text-xl font-semibold text-gray-900">
                  Your library is empty
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Create your first repository to start organizing
                  your notes, code, PDFs and other resources.
                </p>

                <button className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
                  Create Repository
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}