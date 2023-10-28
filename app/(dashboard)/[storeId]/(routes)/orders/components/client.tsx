"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'


import React from 'react'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'
interface OrderClientProps{
    data:OrderColumn[]
}
const OrderClient:React.FC<OrderClientProps> = ({
    data
}) => {
  
  return (
    <>
      <div className=' flex items-center justify-between'>
        <Heading
         title={`Orders(${data.length})`}
         description='Manage orders for your store'
        />
       
        </div>
    <Separator />
     <DataTable searchKey='label' columns={columns} data={data}/>
     
    </>
  )
}

export default OrderClient