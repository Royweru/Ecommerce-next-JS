import React from 'react'

import prisma from "@/lib/prismadb"
import CategoriesForm from './components/categories-form'
const CategoryPage =async ({
    params
}:{
    params:{categoryId:string,storeId:string}
}) => {
  const category= await prisma.category.findUnique({where:{
    id:params.categoryId
  }})

  const billboards = await prisma.billboard.findMany({
    where:{
       storeId:params.storeId
    }
  })
  return (
    <div className=' flex flex-col'>
        <div className=' flex-1 space-y-8 p-8 pt-6'>
          <CategoriesForm billboards={billboards} initialData={category} />
        </div>
      
    </div>
  )
}

export default CategoryPage