"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'
interface SizeClientProps{
    data:SizeColumn[]
}
const SizeClient:React.FC<SizeClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()
  return (
    <>
      <div className=' flex items-center justify-between'>
        <Heading
         title={`Sizes(${data.length})`}
         description='Manage Sizes for your store'
        />
        <Button onClick={()=>router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className=' w-4 h-4'/>
            Add new
        </Button>
        </div>
    <Separator />
     <DataTable searchKey='label' columns={columns} data={data}/>
     <Heading title='API' description='API List for Sizes' />
     <Separator />
     <ApiList entityName='sizes' entityIdName="" />
    </>
  )
}

export default SizeClient