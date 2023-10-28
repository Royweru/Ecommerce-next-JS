import React from 'react'
import OrderClient from './components/client'
import prisma from '@/lib/prismadb'

import {format} from 'date-fns'

import {OrderColumn} from "./components/columns"
import { formatter } from '@/lib/utils'
const OrdersPage=async ({params}:{
    params:{storeId:string}
}) => {
    
    const data = await prisma.order.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedOrders:OrderColumn[] =data.map(item => (
        {
            id:item.id,
            phone:item.phone,
            adress:item.adress,
            products:item.orderItems.map(orderItem=>orderItem.product.name).join(', '),
            isPaid:item.isPaid,
            totalPrice:formatter.format(item.orderItems.reduce((total,item)=>{
                return total+ Number(item.product.price)
            },0)),
            createdAt:format(item.createdAt,"MMMM do, yyyy")
        }
    )) 
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <OrderClient data={formattedOrders} />
        </div>
    </div>
  )
}

export default OrdersPage