import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!name) {
      return new NextResponse("name is required");
    }
    if (!images || !images.length) {
      return new NextResponse("images are required");
    }
    if (!sizeId) {
      return new NextResponse(" size id is required");
    }
    if (!colorId) {
      return new NextResponse("category is is required");
    }
    if (!categoryId) {
      return new NextResponse("color id is required");
    }
    if (!price) {
      return new NextResponse("price is required");
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const storeById = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });
    if (!storeById) {
      return new NextResponse("unauthorized", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sizeId,
        colorId,
        categoryId,
        price,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isArchived,
        isFeatured,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal err", { status: 500 });
  }
}
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include:{
        images:true,
        color:true,
        size:true,
        category:true
      },
      orderBy:{
        createdAt:"desc"
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal err", { status: 500 });
  }
}
