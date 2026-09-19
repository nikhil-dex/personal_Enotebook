"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CreateRepositoryForm from "@/components/repository/create-repository-form";

type Repository = {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
const [createOpen, setCreateOpen] = useState(false);
const [repositories, setRepositories] = useState<Repository[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadRepositories() {
    if (status !== "authenticated" || !session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/repositories");

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadRepositories();
}, [session, status]);

  return (
    <main className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
      Your Library
    </h1>

    <p className="mt-2 text-sm text-gray-500 md:text-base">
      Organize your knowledge into repositories.
    </p>
  </div>

  <button
    type="button"
    onClick={() => setCreateOpen(true)}
    className="shrink-0 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
  >
    + Create Repository
  </button>
</div>

        {loading ? (
          <div className="text-sm text-gray-500">
            Loading repositories...
          </div>
        ) : repositories.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-10 text-center">
            <div className="mb-4 text-5xl">📚</div>

            <h2 className="text-xl font-semibold text-gray-900">
              Your library is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first repository to start organizing
              your notebooks and resources.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repositories.map((repository) => (
              <Link
                key={repository._id}
                href={`/repositories/${repository.slug}`}
                className="rounded-xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">📦</div>

                <h2 className="text-lg font-semibold text-gray-900">
                  {repository.name}
                </h2>

                {repository.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {repository.description}
                  </p>
                )}

                <p className="mt-5 text-xs text-gray-400">
                  Updated{" "}
                  {new Date(repository.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      {createOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Create Repository
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a space for your notebooks and resources.
        </p>
      </div>

      <CreateRepositoryForm
        onCreated={() => {
          setCreateOpen(false);
          window.location.reload();
        }}
        onCancel={() => setCreateOpen(false)}
      />
    </div>
  </div>
)}
    </main>
  );
}