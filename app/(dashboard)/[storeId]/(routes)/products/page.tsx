import React from 'react'
import ProductClient from './components/client'
import prisma from '@/lib/prismadb'

import {format} from 'date-fns'
import { formatter } from '@/lib/utils'
import { ProductColumn } from './components/columns'
const ProductsPage =async ({params}:{
    params:{storeId:string}
}) => {
    
    const data = await prisma.product.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
          category:true,
          size:true,
          color:true,
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedProducts:ProductColumn[] =data.map(item => (
        {
            id:item.id,
            name:item.name,
            size:item.size.value,
            isFeatured:item.isFeatured,
            isArchived:item.isArchived,
            price:formatter.format(item.price.toNumber()),
            category:item.category.name,
            color:item.color.value,
            createdAt:format(item.createdAt,"MMMM do, yyyy")
        }
    )) 
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <ProductClient data={formattedProducts} />
        </div>
    </div>
  )
}

export default ProductsPage