"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const BillboardClient = () => {
  return (
    <div className=' flex items-center justify-between'>
        <Heading
         title='Billboards(0)'
         description='Manage billboards for your store'
        />
        <Button>
            <Plus className=' w-4 h-4'/>
            Add new
        </Button>
    </div>
  )
}

export default BillboardClient