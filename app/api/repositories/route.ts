import { NextResponse } from "next/server";
import {
  createRepository,
  getRepositories,
} from "@/services/repositories/repository.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, name, description } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 },
      );
    }

    const repository = await createRepository(
      userId,
      name,
      description,
    );

    return NextResponse.json(repository, { status: 201 });
  } catch (error) {
    console.error("Failed to create repository:", error);

    return NextResponse.json(
      { error: "Failed to create repository" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const repositories = await getRepositories(userId);

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Failed to fetch repositories:", error);

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}