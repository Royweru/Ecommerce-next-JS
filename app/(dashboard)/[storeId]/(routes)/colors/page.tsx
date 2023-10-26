import React from 'react'
import ColorClient from './components/client'
import prisma from '@/lib/prismadb'

import {format} from 'date-fns'

import { ColorColumn } from './components/columns'
const ColorsPage =async ({params}:{
    params:{storeId:string}
}) => {
    
    const data = await prisma.color.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    const formattedColors:ColorColumn[] =data.map(item => (
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
            <ColorClient data={formattedColors} />
        </div>
    </div>
  )
}

export default ColorsPage