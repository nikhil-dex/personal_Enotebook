import { NextResponse } from "next/server";
import {
  getNotebook,
  updateNotebook,
  deleteNotebook,
} from "@/services/notebooks/notebook.service";

type RouteContext = {
  params: Promise<{
    slug: string;
    notebookId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { notebookId } = await context.params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const notebook = await getNotebook(userId, notebookId);

    if (!notebook) {
      return NextResponse.json(
        { error: "Notebook not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(notebook);
  } catch (error) {
    console.error("Failed to fetch notebook:", error);

    return NextResponse.json(
      { error: "Failed to fetch notebook" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { notebookId } = await context.params;

    const body = await request.json();
    const { userId, name } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    if (name === undefined) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const notebook = await updateNotebook(
      userId,
      notebookId,
      { name },
    );

    if (!notebook) {
      return NextResponse.json(
        { error: "Notebook not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(notebook);
  } catch (error) {
    console.error("Failed to update notebook:", error);

    return NextResponse.json(
      { error: "Failed to update notebook" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const { notebookId } = await context.params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const deleted = await deleteNotebook(
      userId,
      notebookId,
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Notebook not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Notebook deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete notebook:", error);

    return NextResponse.json(
      { error: "Failed to delete notebook" },
      { status: 500 },
    );
  }
}