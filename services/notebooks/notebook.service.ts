import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/database";
import { COLLECTIONS } from "@/lib/db/collections";

export async function createNotebook(
  userId: string,
  repositoryId: string,
  name: string,
) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Notebook name cannot be empty");
  }

  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(repositoryId)) {
    throw new Error("Invalid repository ID");
  }

  const db = await getDatabase();

  const now = new Date();

  const notebook = {
    userId: new ObjectId(userId),
    repositoryId: new ObjectId(repositoryId),
    name: trimmedName,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db
    .collection(COLLECTIONS.NOTEBOOKS)
    .insertOne(notebook);

  return {
    ...notebook,
    _id: result.insertedId,
  };
}

export async function getNotebooks(
  userId: string,
  repositoryId: string,
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(repositoryId)) {
    throw new Error("Invalid repository ID");
  }

  const db = await getDatabase();

  return db
    .collection(COLLECTIONS.NOTEBOOKS)
    .find({
      userId: new ObjectId(userId),
      repositoryId: new ObjectId(repositoryId),
    })
    .sort({
      updatedAt: -1,
    })
    .toArray();
}

export async function getNotebook(
  userId: string,
  notebookId: string,
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(notebookId)) {
    throw new Error("Invalid notebook ID");
  }

  const db = await getDatabase();

  return db.collection(COLLECTIONS.NOTEBOOKS).findOne({
    _id: new ObjectId(notebookId),
    userId: new ObjectId(userId),
  });
}

export async function updateNotebook(
  userId: string,
  notebookId: string,
  updates: {
    name?: string;
  },
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(notebookId)) {
    throw new Error("Invalid notebook ID");
  }

  const updateData: {
    updatedAt: Date;
    name?: string;
  } = {
    updatedAt: new Date(),
  };

  if (updates.name !== undefined) {
    const name = updates.name.trim();

    if (!name) {
      throw new Error("Notebook name cannot be empty");
    }

    updateData.name = name;
  }

  const db = await getDatabase();

  return db.collection(COLLECTIONS.NOTEBOOKS).findOneAndUpdate(
    {
      _id: new ObjectId(notebookId),
      userId: new ObjectId(userId),
    },
    {
      $set: updateData,
    },
    {
      returnDocument: "after",
    },
  );
}

export async function deleteNotebook(
  userId: string,
  notebookId: string,
) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(notebookId)) {
    throw new Error("Invalid notebook ID");
  }

  const db = await getDatabase();

  const result = await db
    .collection(COLLECTIONS.NOTEBOOKS)
    .deleteOne({
      _id: new ObjectId(notebookId),
      userId: new ObjectId(userId),
    });

  return result.deletedCount > 0;
}