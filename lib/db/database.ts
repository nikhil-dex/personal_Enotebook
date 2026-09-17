import clientPromise from "./mongodb";

const DATABASE_NAME = "library_db";

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME);
}