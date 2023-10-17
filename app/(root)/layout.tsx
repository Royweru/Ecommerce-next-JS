import { auth, redirectToSignIn } from "@clerk/nextjs";
import React from "react";

import prisma from "@/lib/prismadb"
import { redirect } from "next/navigation";
export default async function SetupLayout({
    children
}:{
    children:React.ReactNode
}) {
    const {userId} = auth()
    if(!userId){
        redirectToSignIn()
    }

    const store = await prisma.store.findFirst({
        where:{
            userId
        }
    });

    if(store){
        redirect(`/${store.id}`)
    }
    return(
        <>
        {children}
        </>
    )
}