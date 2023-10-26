"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Trash } from "lucide-react";
import { Billboard, Category, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Heading from "@/components/heading";
import useOrigin from "@/hooks/useOrigin";
import AlertModal from "@/components/modals/alert-modal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
 name: z.string().min(2),
  value:z.string().min(1)
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
  
}

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
 
  const title = initialData ? "Edit size" : "create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData
    ? "size edited successfully!"
    : "created size successfully!";
  const action = initialData ? "Save changes" : "Create size";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name:"",
      value:""
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: SizeFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          ` /api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
        form.reset();
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`)
      toast({
        description: toastMessage,
      });

    } catch (error: any) {
      console.error(error),
        toast({
          variant: "destructive",
          description: "something went wrong!",
        });
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );
      router.refresh();
      router.push("/");
      toast({
        variant: "destructive",
        description: "size was deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "Make sure you remove all products using size first",
      });
    }
  };

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
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
       
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="size name.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="size value.."
                      {...field}
                    />
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

export default SizeForm;
