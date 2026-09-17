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