import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createRepository,
  getRepositories,
} from "@/services/repositories/repository.service";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 },
      );
    }

    const repository = await createRepository(
      session.user.id,
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

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const repositories = await getRepositories(session.user.id);

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Failed to fetch repositories:", error);

    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 },
    );
  }
}