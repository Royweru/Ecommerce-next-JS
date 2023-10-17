"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "../ui/modal";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const router = useRouter()
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.post('/api/stores',values)
        toast({
          description:"Success!"
        })
        router.refresh() 
        form.reset()
    } catch (error) {
       console.error(error),
       toast({
        description:"Ooopsy something went wrong!",
        variant:"destructive"
       })
    }

    
  };

  const isLoading = form.formState.isSubmitting
  return (
    <Modal
      title=" Create store"
      description="Add a new store  to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className=" space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input disabled={isLoading} placeholder="E-commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" p-6 space-x-2 flex items-center justify-end w-full">
               <Button disabled={isLoading} variant="outline" onClick={storeModal.onClose}>
                 Cancel
               </Button>
               <Button disabled={isLoading} type="submit" variant="destructive">
                 Continue
               </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
