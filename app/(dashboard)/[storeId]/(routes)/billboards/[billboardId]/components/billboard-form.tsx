"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Trash } from "lucide-react"
import { Billboard } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Heading from "@/components/heading"
import useOrigin from "@/hooks/useOrigin"
import AlertModal from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import {

  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"



const formSchema = z.object({
 label: z.string().min(2),
 imageUrl:z.string().min(2)
});

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard|null;
};

 const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);

  const title = initialData?"Edit billboard":"create billboard";
  const description = initialData?"Edit a billboard":"Add a new billboard";
  const toastMessage = initialData?"Billboard edited successfully!":"created billboard successfully!";
  const action = initialData?"Save changes":"Create billboard";
  

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData||{
        label:"",
        imageUrl:""
    }
  });


  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: BillboardFormValues) => {
    try {
     
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast({
        description:"success you updated your store!"
      })
    } catch (error: any) {
       console.error(error),
       toast({
        variant:"destructive",
        description:toastMessage
       })
    } 
  };

  const onDelete = async () => {
    try {
     
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
     toast({
      variant:"destructive",
      description:"store was successfully deleted"
     })
    } catch (error: any) {
      toast({
        variant:"destructive",
        description:"Oopsy something went wrong!"
      })
    } 
  }
  

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={isLoading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label:</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="billboard label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      
      
    </>
  );
};

export default BillboardForm