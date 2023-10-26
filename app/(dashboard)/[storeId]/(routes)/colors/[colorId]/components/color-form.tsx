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



const formSchema = z.object({
 name: z.string().min(2),
  value:z.string().min(1)
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Size | null;
  
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
 
  const title = initialData ? "Edit color" : "create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData
    ? "color edited successfully!"
    : "created color successfully!";
  const action = initialData ? "Save changes" : "Create color";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name:"",
      value:""
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data:ColorFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          ` /api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
        form.reset();
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`)
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
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      router.refresh();
      router.push("/");
      toast({
        variant: "destructive",
        description: "color was deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "Make sure you remove all products using color first",
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
                      placeholder="color name.."
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
                    <div className=" flex items-center gap-x-4">
                    <Input
                      disabled={isLoading}
                      placeholder="size value.."
                      {...field}
                    />
                    <div className=" border p-4 rounded-full" style={{backgroundColor:field.value}} />
                    </div>
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

export default ColorForm;
