"use client";

import { FormEvent, useState } from "react";

type Block = {
  _id: string;
  type: string;
  content: unknown;
  position: number;
};

type NotebookEditorProps = {
  notebookId: string;
  initialBlocks: Block[];
};

export default function NotebookEditor({
  notebookId,
  initialBlocks,
}: NotebookEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Write something before saving.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        `/api/repositories/${window.location.pathname.split("/")[2]}/notebooks/${notebookId}/blocks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "paragraph",
            content,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save block");
      }

      setBlocks((currentBlocks) => [
        ...currentBlocks,
        {
          _id: data._id.toString(),
          type: data.type,
          content: data.content,
          position: data.position,
        },
      ]);

      setContent("");
      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      {blocks.length > 0 && (
        <div className="mb-6 space-y-3">
          {blocks.map((block) => (
            <div
              key={block._id}
              className="rounded-xl border bg-white p-4"
            >
              <div className="mb-2 text-xs font-medium uppercase text-gray-400">
                {block.type}
              </div>

              <div className="whitespace-pre-wrap text-base leading-7 text-gray-800">
                {typeof block.content === "string"
                  ? block.content
                  : JSON.stringify(block.content)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Editor
        </h2>

        {saved && (
          <span className="text-sm text-green-600">
            Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="rounded-xl border bg-white">
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setSaved(false);
              setError("");
            }}
            placeholder="Start writing..."
            className="min-h-[300px] w-full resize-none rounded-xl p-5 text-base leading-7 text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Block"}
          </button>
        </div>
      </form>
    </div>
  );
}