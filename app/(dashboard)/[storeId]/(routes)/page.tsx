
import React from 'react'
import prisma from '@/lib/prismadb'


interface DashboardPageProps{
    params:{
        storeId:string
    }
}
const DashboardPage =async ({params}:DashboardPageProps) => {
    const store = await prisma.store.findFirst({
        where:{
            id:params.storeId
        }
    })
  return (

    <div>
        Active Store:{store?.name}
    </div>
  )
}

export default DashboardPage