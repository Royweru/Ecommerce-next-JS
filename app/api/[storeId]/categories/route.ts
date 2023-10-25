import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"
import prisma from '@/lib/prismadb'

export async function POST(
    req:Request,
    {params}:{
        params:{storeId:string}
    }
) {
    try {
        
        const user = await currentUser()
        if(!user){
            return new NextResponse("unauthorized",{status:401})
        }

        const body = await req.json()

        const {name, billboardId} = body
        
        if(!name|| !billboardId){
            return new NextResponse("name and billboard are required")
        }

        if(!params.storeId){
            return new NextResponse("storeId is required",{status:400})
        }

        const storeById = await prisma.store.findFirst({
            where:{
                id:params.storeId,
                userId:user.id
            }
        })
        if(!storeById){
            return new NextResponse("unauthorized",{status:400})
        }

        const category = await prisma.category.create({
            data:{
                name ,
                billboardId,
                storeId:params.storeId
            }
        })

        
        return NextResponse.json(category)
    } catch (error) {
        console.log('[CATEGORY_POST]',error)
        return new NextResponse("Internal err",{status:500})
    }
}
export async function GET(
    req:Request,
    {params}:{
        params:{storeId:string}
    }
) {
    try {
        
       
        if(!params.storeId){
            return new NextResponse("storeId is required",{status:400})
        }
        
        const categories = await prisma.category.findMany({
           where:{
            storeId:params.storeId
           }
        })

        
        return NextResponse.json(categories)
    } catch (error) {
        console.log('[CATEGORIES_GET]',error)
        return new NextResponse("Internal err",{status:500})
    }
}