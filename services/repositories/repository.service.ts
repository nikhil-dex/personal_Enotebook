import { db } from "@/lib/db/client";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createRepository(
  userId: number,
  name: string,
  description?: string,
) {
  const slug = generateSlug(name);

  const repository = await db.orm.public.Repository.create({
    data: {
      userId,
      name,
      slug,
      description: description ?? null,
    },
  });

  return repository;
}