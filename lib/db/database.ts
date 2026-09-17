import { getMongoClient } from "./mongodb";

const DATABASE_NAME = "library_db";

export async function getDatabase() {
  const client = await getMongoClient();

  return client.db(DATABASE_NAME);
}