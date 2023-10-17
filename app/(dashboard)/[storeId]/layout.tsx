import { auth, redirectToSignIn } from "@clerk/nextjs"
import prisma from '@/lib/prismadb'
import { redirect } from "next/navigation"
export default async function DashboardLayout({
    children,
    params
}:{
    children:React.ReactNode,
    params:{storeId:string}
}) {
    const {userId} = auth()

    if(!userId){
        redirectToSignIn()
    }

    const store = await prisma.store.findFirst({
        where:{
            id:params.storeId,
            userId
        }
    })

    if(!store){
        redirect("/")
    }
    return(
       <>
       
       {children}
       </>
    )
}