import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"
import prisma from '@/lib/prismadb'

export async function POST(
    req:Request
) {
    try {
        
        const user = await currentUser()
        if(!user){
            return new NextResponse("unauthorized",{status:401})
        }

        const body = await req.json()

        const {name} = body
        
        if(!name){
            return new NextResponse("Namr is required")
        }
        const store = await prisma.store.create({
            data:{
                name,
                userId:user.id
            }
        })
        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORES_POST]',error)
        return new NextResponse("Internal err",{status:500})
    }
}