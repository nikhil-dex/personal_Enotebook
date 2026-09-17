import { NextResponse } from "next/server";
import { getRepository } from "@/services/repositories/repository.service";

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