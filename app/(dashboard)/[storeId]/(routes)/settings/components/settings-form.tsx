"use client"
import { Store } from '@prisma/client'
import React, { useState } from 'react'

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm } from 'react-hook-form'
import 
{ 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel
 } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import AlertModal from '@/components/modals/alert-modal'
import { useDeleteAlertModal } from '@/hooks/useDeleteAlertModal'
interface SettingsFormProps{
    initialData:Store
}

const formShema  =z.object({
    name:z.string().min(2)
})

type SettingsFormValues = z.infer<typeof formShema>

const SettingsForm:React.FC<SettingsFormProps> = ({
    initialData
}) => {
  const useAlertModal = useDeleteAlertModal()
  const params = useParams()
  const router = useRouter()
  const [open,setOpen] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver:zodResolver(formShema),
    defaultValues:initialData
  })
  const isLoading = form.formState.isSubmitting

  const onSubmit =async (data:SettingsFormValues)=>{
   try {
    await axios.patch(`/api/stores/${params.storeId}`,data)
    router.refresh()
    toast({
      description:"Success"
    })
   } catch (error) {
     toast({
        description:"Oopsy something went wrong",
        variant:"destructive"
     })
   }
  }

  const onDelete =async () => {
    try {
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast({
        description:"Store has been deleted successfully"
      })
    } catch (error) {
      toast({
        description:"Make sure you removed all products and categories first."
      })
    }
  }
  return (
    <>
     <AlertModal
       isOpen={open}
       onClose={()=>setOpen(false)}
       onConfirm={onDelete}
       loading={isLoading}
     />


       <div className='flex items-center justify-between'>
        <Heading
         title="settings"
         description = "Manage store preferences"
        />
        <Button variant="destructive" size="sm" onClick={()=>setOpen(true)} >
           <Trash className=' h-4 w-4' />
        </Button>
    </div>
    <Separator />

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8 w-full'>
            <div className=' grid grid-cols-3 gap-8'>
                    <FormField
                     name="name"
                     control={form.control}
                     render={({field})=>(
                        <FormItem>
                            <FormLabel>Name:</FormLabel>
                            <FormControl>
                                <Input placeholder='name' disabled={isLoading}  {...field}/>
                            </FormControl>
                        </FormItem>
                     )}

                    />
            </div>
            <Button disabled={isLoading} className=' ml-auto' type='submit'>Save Changes</Button>
        </form>
    </Form>
    </>
  )
    
  
}

export default SettingsForm