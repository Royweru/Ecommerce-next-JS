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
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
  
  const [open,setOpen] = useState(false)



    const form = useForm<SettingsFormValues>({
    resolver:zodResolver(formShema),
    defaultValues:initialData
  })
  const isLoading = form.formState.isSubmitting

  const onSubmit =async (data:SettingsFormValues)=>{
    console.log(data)
  }
  return (
    <>
       <div className='flex items-center justify-between'>
        <Heading
         title="settings"
         description = "Manage store preferences"
        />
        <Button variant="destructive" size="sm" onClick={()=>{}} >
           <Trash className=' h-4 w-4' />
        </Button>
    </div>
    <Separator />

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8 w-full'>
            <div className=' grid grid-cols-3 gap-8'>
                    <FormField
                     name='name'
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