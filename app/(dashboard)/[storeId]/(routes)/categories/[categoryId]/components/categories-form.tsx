"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Trash } from "lucide-react";
import { Billboard, Category } from "@prisma/client";
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
  billboardId: z.string().min(2),
});

type CategoriesFormValues = z.infer<typeof formSchema>;

interface CategoriesFormProps {
  initialData: Category | null;
  billboards:Billboard[]|null;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({ initialData,billboards }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit category" : "create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData
    ? "category edited successfully!"
    : "created category successfully!";
  const action = initialData ? "Save changes" : "Create category";

  const form = useForm<CategoriesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name:"",
      billboardId:""
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: CategoriesFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          ` /api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
        form.reset();
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`)
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
        `/api/${params.storeId}/categories/${params.billboardId}`
      );
      router.refresh();
      router.push("/");
      toast({
        variant: "destructive",
        description: "cattegory was successfully deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "Make sure you remove all products using this category first",
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
                      placeholder="Category name.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard:</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                        <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {billboards?.map(billboard=>(
                        <SelectItem
                         key={billboard.id}
                         value={billboard.id}
                        >
                         {billboard.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
                  </Select>
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

export default CategoriesForm;
