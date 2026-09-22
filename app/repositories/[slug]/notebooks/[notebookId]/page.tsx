import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getNotebook } from "@/services/notebooks/notebook.service";
import { getBlocks } from "@/services/blocks/block.service";
import NotebookEditor from "@/components/editor/notebook-editor";

type NotebookPageProps = {
  params: Promise<{
    slug: string;
    notebookId: string;
  }>;
};

export default async function NotebookPage({
  params,
}: NotebookPageProps) {
  const { slug, notebookId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const notebook = await getNotebook(
    session.user.id,
    notebookId,
  );

  if (!notebook) {
    notFound();
  }

  const blocks = await getBlocks(
    session.user.id,
    notebookId,
  );

  return (
    <main className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/repositories/${slug}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Repository
        </Link>

        <div className="mt-5 rounded-xl border bg-white p-6 md:p-8">
          <div className="mb-8">
            <div className="mb-3 text-4xl">📓</div>

            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {notebook.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
            </p>
          </div>

          <NotebookEditor
  notebookId={notebookId}
  initialBlocks={blocks.map((block) => ({
    _id: block._id.toString(),
    type: block.type,
    content: block.content,
    position: block.position,
  }))}
/>
        </div>
      </div>
    </main>
  );
}