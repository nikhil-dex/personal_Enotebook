import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export async function getMongoClient() {
  if (!clientPromise) {
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}