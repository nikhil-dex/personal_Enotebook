"use client";

import { useState } from "react";
import CreateNotebookForm from "./create-notebook-form";

type NewNotebookButtonProps = {
  slug: string;
};

export default function NewNotebookButton({
  slug,
}: NewNotebookButtonProps) {
  const [open, setOpen] = useState(false);

  function handleCreated() {
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + New Notebook
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Notebook
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a new notebook inside this repository.
              </p>
            </div>

            <CreateNotebookForm
              slug={slug}
              onCreated={handleCreated}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}