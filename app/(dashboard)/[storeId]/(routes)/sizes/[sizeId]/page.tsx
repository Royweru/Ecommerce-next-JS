import React from 'react'

import prisma from "@/lib/prismadb"
import SizeForm from './components/size-form'
const CategoryPage =async ({
    params
}:{
    params:{sizeId:string,storeId:string}
}) => {
  const size= await prisma.size.findUnique({where:{
    id:params.sizeId
  }})

  
  return (
    <div className=' flex flex-col'>
        <div className=' flex-1 space-y-8 p-8 pt-6'>
          <SizeForm initialData={size} />
        </div>
      
    </div>
  )
}

export default CategoryPage