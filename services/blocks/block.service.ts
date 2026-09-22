import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/db/database";
import { COLLECTIONS } from "@/lib/db/collections";

export type BlockType =
  | "paragraph"
  | "heading"
  | "code"
  | "quote"
  | "list"
  | "image";

type CreateBlockInput = {
  userId: string;
  notebookId: string;
  type: BlockType;
  content?: unknown;
  position?: number;
};

export async function createBlock({
  userId,
  notebookId,
  type,
  content = "",
  position = 0,
}: CreateBlockInput) {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!ObjectId.isValid(notebookId)) {
    throw new Error("Invalid notebook ID");
  }

  const db = await getDatabase();

  const now = new Date();

const blocks = db.collection(COLLECTIONS.BLOCKS);

const lastBlock = await blocks
  .find({
    userId: new ObjectId(userId),
    notebookId: new ObjectId(notebookId),
  })
  .sort({ position: -1 })
  .limit(1)
  .next();

const nextPosition = lastBlock
  ? lastBlock.position + 1
  : 0;

const block = {
  userId: new ObjectId(userId),
  notebookId: new ObjectId(notebookId),
  type,
  content,
  position: nextPosition,
  createdAt: now,
  updatedAt: now,
};

  const result = await db
    .collection(COLLECTIONS.BLOCKS)
    .insertOne(block);

  return {
    ...block,
    _id: result.insertedId,
  };
}

export async function getBlocks(
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

  return db
  .collection(COLLECTIONS.BLOCKS)
  .find({
    userId: new ObjectId(userId),
    notebookId: new ObjectId(notebookId),
  })
  .sort({
    position: 1,
    createdAt: 1,
    _id: 1,
  })
  .toArray();
}