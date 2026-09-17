import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/database";
import { COLLECTIONS } from "@/lib/db/collections";
import { ensureDatabaseIndexes } from "@/lib/db/indexes";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function generateUniqueSlug(
  name: string,
  excludeId?: ObjectId,
): Promise<string> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTIONS.REPOSITORIES);

  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query: {
      slug: string;
      _id?: { $ne: ObjectId };
    } = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await collection.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createRepository(
  userId: string,
  name: string,
  description?: string,
) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Repository name cannot be empty");
  }

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const db = await getDatabase();
  await ensureDatabaseIndexes();

  const slug = await generateUniqueSlug(trimmedName);

  const repository = {
    userId: new ObjectId(userId),
    name: trimmedName,
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
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

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

  const existing = await db
    .collection(COLLECTIONS.REPOSITORIES)
    .findOne({ slug });

  if (!existing) {
    return null;
  }

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
    updateData.slug = await generateUniqueSlug(
      name,
      existing._id,
    );
  }

  if (updates.description !== undefined) {
    updateData.description = updates.description?.trim() || null;
  }

  return db.collection(COLLECTIONS.REPOSITORIES).findOneAndUpdate(
    { _id: existing._id },
    { $set: updateData },
    { returnDocument: "after" },
  );
}

export async function deleteRepository(slug: string) {
  const db = await getDatabase();

  const result = await db
    .collection(COLLECTIONS.REPOSITORIES)
    .deleteOne({ slug });

  return result.deletedCount > 0;
}