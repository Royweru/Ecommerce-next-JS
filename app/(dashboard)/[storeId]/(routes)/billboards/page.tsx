import React from 'react'
import BillboardClient from './components/client'
import prisma from '@/lib/prismadb'
const BillboardsPage =async () => {
    const data = await prisma.billboard.findMany()
  return (
    <div className=' flex-col'>
        <div className=' flex-1 space-y-4 p-8 pt-6'>
            <BillboardClient data={data} />
        </div>
    </div>
  )
}

export default BillboardsPage