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

        const {name, value} = body
        
        if(!name|| !value){
            return new NextResponse("Label and imageUrl are required")
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

        const billboard = await prisma.size.create({
            data:{
               name ,
                value,
                storeId:params.storeId
            }
        })

        
        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[SIZES_POST]',error)
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
        
        const sizes = await prisma.size.findMany({
           where:{
            storeId:params.storeId
           }
        })

        
        return NextResponse.json(sizes)
    } catch (error) {
        console.log('[SIZES_GET]',error)
        return new NextResponse("Internal err",{status:500})
    }
}