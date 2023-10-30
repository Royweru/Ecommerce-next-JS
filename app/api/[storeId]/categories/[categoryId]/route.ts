import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required!", { status: 400 });
    }
    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_GET]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse("Unathenticated", { status: 401 });
    }
    if (!name || !billboardId) {
      return new NextResponse("name and billboardId are required", {
        status: 400,
      });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const storeById = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!storeById) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const category = await prisma.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_PATCH]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const storeById = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!storeById) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    const category = await prisma.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_DELETE]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
