import { NextResponse } from "next/server";
import {
  getRepository,
} from "@/services/repositories/repository.service";
import {
  createNotebook,
  getNotebooks,
} from "@/services/notebooks/notebook.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const repository = await getRepository(slug);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    const notebooks = await getNotebooks(
      userId,
      repository._id.toString(),
    );

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error("Failed to fetch notebooks:", error);

    return NextResponse.json(
      { error: "Failed to fetch notebooks" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const body = await request.json();
    const { userId, name } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 },
      );
    }

    const repository = await getRepository(slug);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    const notebook = await createNotebook(
      userId,
      repository._id.toString(),
      name,
    );

    return NextResponse.json(notebook, { status: 201 });
  } catch (error) {
    console.error("Failed to create notebook:", error);

    return NextResponse.json(
      { error: "Failed to create notebook" },
      { status: 500 },
    );
  }
}