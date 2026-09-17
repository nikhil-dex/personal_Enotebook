import clientPromise from "./mongodb";

async function main() {
  const client = await clientPromise;

  await client.db("library_db").command({ ping: 1 });

  console.log("MongoDB connected successfully");

  await client.close();
}

main().catch((error) => {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
});