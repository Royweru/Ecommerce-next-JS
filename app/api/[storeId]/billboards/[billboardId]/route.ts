import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (params.billboardId) {
      return new NextResponse("Billboard id is required!", { status: 400 });
    }
    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_GET]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unathenticated", { status: 401 });
    }
    if (!label || !imageUrl) {
      return new NextResponse("Label and ImageURl is required", {
        status: 400,
      });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_ID]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unathenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("billboard id is required", { status: 400 });
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
    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_DELETE]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
