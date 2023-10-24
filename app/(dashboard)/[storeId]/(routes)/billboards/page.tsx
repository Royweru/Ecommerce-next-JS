import React from 'react'
import BillboardClient from './components/client'
import prisma from '@/lib/prismadb'

import {format} from 'date-fns'

import {BillboardColumn} from "./components/columns"
const BillboardsPage =async ({params}:{
    params:{storeId:string}
}) => {
    const data = await prisma.billboard.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    const formattedBillboards:BillboardColumn[] =data.map(item => (
        {
            id:item.id,
            label:item.label,
            createdAt:format(item.createdAt,"MMMM do, YYYY")
        }
    )) 
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient data={formattedBillboards} />
        </div>
    </div>
  )
}

export default BillboardsPage