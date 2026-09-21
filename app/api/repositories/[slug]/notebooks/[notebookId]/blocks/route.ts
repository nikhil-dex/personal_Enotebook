import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRepository } from "@/services/repositories/repository.service";
import {
  createBlock,
  getBlocks,
  type BlockType,
} from "@/services/blocks/block.service";

type RouteContext = {
  params: Promise<{
    slug: string;
    notebookId: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { slug, notebookId } = await context.params;

    const repository = await getRepository(slug);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    if (repository.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const blocks = await getBlocks(
      session.user.id,
      notebookId,
    );

    return NextResponse.json(blocks);
  } catch (error) {
    console.error("GET blocks error:", error);

    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { slug, notebookId } = await context.params;

    const repository = await getRepository(slug);

    if (!repository) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 },
      );
    }

    if (repository.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const {
      type,
      content = "",
      position = 0,
    } = body;

    const validTypes: BlockType[] = [
      "paragraph",
      "heading",
      "code",
      "quote",
      "list",
      "image",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid block type" },
        { status: 400 },
      );
    }

    const block = await createBlock({
      userId: session.user.id,
      notebookId,
      type,
      content,
      position,
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("POST block error:", error);

    return NextResponse.json(
      { error: "Failed to create block" },
      { status: 500 },
    );
  }
}