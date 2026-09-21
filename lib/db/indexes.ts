import { getDatabase } from "./database";
import { COLLECTIONS } from "./collections";

export async function ensureDatabaseIndexes() {
  const db = await getDatabase();

  const repositories = db.collection(COLLECTIONS.REPOSITORIES);

  await repositories.createIndex(
    { slug: 1 },
    { unique: true },
  );

  await repositories.createIndex(
    { userId: 1, updatedAt: -1 },
  );
}
export async function ensureBlockIndexes() {
  const db = await getDatabase();
  const blocks = db.collection(COLLECTIONS.BLOCKS);

  await blocks.createIndex({
    notebookId: 1,
    position: 1,
  });

  await blocks.createIndex({
    userId: 1,
    notebookId: 1,
  });
}