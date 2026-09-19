"use client";

import { FormEvent, useState } from "react";

type CreateRepositoryFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export default function CreateRepositoryForm({
  onCreated,
  onCancel,
}: CreateRepositoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Repository name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create repository",
        );
      }

      setName("");
      setDescription("");

      onCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="repository-name"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Repository name
        </label>

        <input
          id="repository-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Machine Learning"
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="repository-description"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Description
          <span className="ml-1 font-normal text-gray-400">
            (optional)
          </span>
        </label>

        <textarea
          id="repository-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What will you store here?"
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Repository"}
        </button>
      </div>
    </form>
  );
}