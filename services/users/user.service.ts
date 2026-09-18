import { getDatabase } from "@/lib/db/database";
import { COLLECTIONS } from "@/lib/db/collections";

type GitHubUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function findOrCreateUser(githubUser: GitHubUser) {
  const db = await getDatabase();

  const users = db.collection(COLLECTIONS.USERS);

  const existingUser = await users.findOne({
    githubId: githubUser.id,
  });

  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          name: githubUser.name ?? null,
          email: githubUser.email ?? null,
          image: githubUser.image ?? null,
          updatedAt: new Date(),
        },
      },
    );

    return {
      ...existingUser,
      name: githubUser.name ?? null,
      email: githubUser.email ?? null,
      image: githubUser.image ?? null,
    };
  }

  const now = new Date();

  const user = {
    githubId: githubUser.id,
    name: githubUser.name ?? null,
    email: githubUser.email ?? null,
    image: githubUser.image ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(user);

  return {
    ...user,
    _id: result.insertedId,
  };
}