import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (params.productId) {
      return new NextResponse("product id is required!", { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include:{
        images:true,
        size:true,
        color:true,
        category:true
      }
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
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
    if (!userId) {
      return new NextResponse("Unathenticated", { status: 401 });
    }
   

    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
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
    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        sizeId,
        categoryId,
        colorId,
        images:{
            deleteMany:{}
        },
        isArchived,
        isFeatured
      },
    });
    const product = await prisma.product.update({
        where:{
            id:params.productId
        },
        data:{
            images:{
                createMany:{
                    data:[
                        ...images.map((image:{url:string})=> image)
                    ]
                }
            }
        }
    })
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_PATCH]`, error);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unathenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
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
    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("internal error", { status: 500 });
  }
}
