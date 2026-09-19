import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getRepository } from "@/services/repositories/repository.service";
import { getNotebooks } from "@/services/notebooks/notebook.service";
import CreateNotebookForm from "@/components/notebook/create-notebook-form";
import NewNotebookButton from "@/components/notebook/new-notebook-button";
type RepositoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RepositoryPage({
  params,
}: RepositoryPageProps) {
  const { slug } = await params;
  const session = await auth();

if (!session?.user?.id) {
  notFound();
}

  const repository = await getRepository(slug);

if (!repository) {
  notFound();
}

const notebooks = await getNotebooks(
  session.user.id,
  repository._id.toString(),
);

  if (!repository) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/repositories"
          className="mb-6 inline-flex text-sm text-gray-500 transition hover:text-gray-900"
        >
          ← Back to Library
        </Link>

        <div className="rounded-2xl border bg-white p-6">
          <div className="mb-6">
            <div className="mb-3 text-4xl">📦</div>

            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {repository.name}
            </h1>

            {repository.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {repository.description}
              </p>
            )}
          </div>

          <div>
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Notebooks
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Organize your notes inside this repository.
      </p>
    </div>

    <NewNotebookButton slug={slug} />
  </div>

  {notebooks.length === 0 ? (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <div className="mb-3 text-4xl">📓</div>

      <h3 className="text-lg font-semibold text-gray-900">
        No notebooks yet
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Create your first notebook to start writing.
      </p>
    </div>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notebooks.map((notebook) => (
        <div
          key={notebook._id.toString()}
          className="rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="mb-3 text-3xl">📓</div>

          <h3 className="font-semibold text-gray-900">
            {notebook.name}
          </h3>

          <p className="mt-3 text-xs text-gray-400">
            Updated{" "}
            {new Date(notebook.updatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
        </div>
      </div>
    </main>
  );
}