import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/database";
import { COLLECTIONS } from "@/lib/db/collections";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createRepository(
  userId: string,
  name: string,
  description?: string,
) {
  const db = await getDatabase();

  const slug = generateSlug(name);

  const repository = {
    userId: new ObjectId(userId),
    name: name.trim(),
    slug,
    description: description?.trim() || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db
    .collection(COLLECTIONS.REPOSITORIES)
    .insertOne(repository);

  return {
    ...repository,
    _id: result.insertedId,
  };
}

export async function getRepositories(userId: string) {
  const db = await getDatabase();

  return db
    .collection(COLLECTIONS.REPOSITORIES)
    .find({
      userId: new ObjectId(userId),
    })
    .sort({
      updatedAt: -1,
    })
    .toArray();
}

export async function getRepository(slug: string) {
  const db = await getDatabase();

  return db
    .collection(COLLECTIONS.REPOSITORIES)
    .findOne({
      slug,
    });
}

export async function updateRepository(
  slug: string,
  updates: {
    name?: string;
    description?: string | null;
  },
) {
  const db = await getDatabase();

  const updateData: {
    updatedAt: Date;
    name?: string;
    description?: string | null;
    slug?: string;
  } = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) {
    const name = updates.name.trim();

    if (!name) {
      throw new Error("Repository name cannot be empty");
    }

    updateData.name = name;
    updateData.slug = generateSlug(name);
  }

  if (updates.description !== undefined) {
    updateData.description = updates.description?.trim() || null;
  }

  return db.collection(COLLECTIONS.REPOSITORIES).findOneAndUpdate(
    { slug },
    { $set: updateData },
    { returnDocument: "after" },
  );
}