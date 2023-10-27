"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'
interface ProductClientProps{
    data:ProductColumn[]
}
const ProductClient:React.FC<ProductClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()
  return (
    <>
      <div className=' flex items-center justify-between'>
        <Heading
         title={`Products(${data.length})`}
         description='Manage Products for your store'
        />
        <Button onClick={()=>router.push(`/${params.storeId}/products/new`)}>
            <Plus className=' w-4 h-4'/>
            Add new
        </Button>
        </div>
    <Separator />
     <DataTable searchKey='name' columns={columns} data={data}/>
     <Heading title='API' description='API List for products' />
     <Separator />
     <ApiList entityName='Products' entityIdName="" />
    </>
  )
}

export default ProductClient