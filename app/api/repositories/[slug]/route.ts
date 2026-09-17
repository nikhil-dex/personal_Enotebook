import { NextResponse } from "next/server";
import {
  getRepository,
  updateRepository,
  deleteRepository,
} from "@/services/repositories/repository.service";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const repository = await getRepository(slug);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(repository);
  } catch (error) {
    console.error("Failed to fetch repository:", error);

    return NextResponse.json(
      { error: "Failed to fetch repository" },
      { status: 500 },
    );
  }
}
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const { name, description } = body;

    if (name === undefined && description === undefined) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const repository = await updateRepository(slug, {
      name,
      description,
    });

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(repository);
  } catch (error) {
    console.error("Failed to update repository:", error);

    return NextResponse.json(
      { error: "Failed to update repository" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { slug } = await context.params;

    const deleted = await deleteRepository(slug);

    if (!deleted) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Repository deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete repository:", error);

    return NextResponse.json(
      { error: "Failed to delete repository" },
      { status: 500 },
    );
  }
}