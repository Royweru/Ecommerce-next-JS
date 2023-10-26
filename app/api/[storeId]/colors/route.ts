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
            return new NextResponse("name and value are required")
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

        const color = await prisma.color.create({
            data:{
               name ,
                value,
                storeId:params.storeId
            }
        })

        
        return NextResponse.json(color)
    } catch (error) {
        console.log('[COLORS_POST]',error)
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
        
        const colors = await prisma.color.findMany({
           where:{
            storeId:params.storeId
           }
        })

        
        return NextResponse.json(colors)
    } catch (error) {
        console.log('[COLORS_GET]',error)
        return new NextResponse("Internal err",{status:500})
    }
}