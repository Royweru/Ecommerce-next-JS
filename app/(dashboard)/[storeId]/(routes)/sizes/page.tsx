import React from 'react'
import BillboardClient from './components/client'
import prisma from '@/lib/prismadb'

import {format} from 'date-fns'

import {SizeColumn} from "./components/columns"
const SizesPage =async ({params}:{
    params:{storeId:string}
}) => {
    
    const data = await prisma.size.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    const formattedSizes:SizeColumn[] =data.map(item => (
        {
            id:item.id,
            name:item.name,
            value:item.value,
            createdAt:format(item.createdAt,"MMMM do, yyyy")
        }
    )) 
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient data={formattedSizes} />
        </div>
    </div>
  )
}

export default SizesPage