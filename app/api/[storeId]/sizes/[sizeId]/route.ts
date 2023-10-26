import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (params.sizeId) {
      return new NextResponse("Size id is required!", { status: 400 });
    }
    const billboard = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[SIZE_GET]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unathenticated", { status: 401 });
    }
    if (!name || !value) {
      return new NextResponse("name and value is required", {
        status: 400,
      });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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
      return new NextResponse("unauthorized", { status: 400 });
    }
    const size= await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_ID]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unathenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("size id is required", { status: 400 });
    }

    const storeById = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    if (!storeById) {
      return new NextResponse("unauthorized", { status: 400 });
    }
    const size = await prisma.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_DELETE]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
