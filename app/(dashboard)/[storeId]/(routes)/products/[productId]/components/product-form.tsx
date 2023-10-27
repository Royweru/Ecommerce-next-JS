"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Trash } from "lucide-react";
import { Billboard, Category, Color, Image, Product, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Select,SelectTrigger,SelectValue,SelectItem,SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Heading from "@/components/heading";
import useOrigin from "@/hooks/useOrigin";
import AlertModal from "@/components/modals/alert-modal";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ui/image-upload";
import { parse } from "path";
import { url } from "inspector";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
 name: z.string().min(2),
  images: z.object({url:z.string()}).array(),
  price:z.coerce.number().min(1),
  categoryId:z.string().min(1),
  sizeId:z.string().min(1),
  colorId:z.string().min(1),
  isFeatured:z.boolean().default(false).optional(),
  isArchived:z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product&{
    images:Image[]
  }|null ;
  sizes:Size[],
  colors:Color[],
  categories:Category[]
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData,
   sizes,
   categories,
   colors,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit product" : "create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData
    ? "product edited successfully!"
    : "created product successfully!";
  const action = initialData ? "Save changes" : "Create product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData?{
      ...initialData,
      price:parseFloat(String(initialData?.price))
     } : {
        name: "",
         images: [],
         categoryId:"",
         price:0,
         sizeId:"",
         colorId:"",
         isArchived:false,
         isFeatured:false
       }
    } 
  );

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (initialData) {
        await axios.patch(
          ` /api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
        form.reset();
      }

      router.refresh();
      router.push(`/${params.storeId}/products`)
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
        `/api/${params.storeId}/products/${params.productId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast({
        
        description: "Product was successfully deleted!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "Make sure you remove all categories out of this billboard",
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image:</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image)=>image.url)}
                    disabled={isLoading}
                    onChange={(url) => field.onChange([...field.value,{url}])}
                    onRemove={(url) => field.onChange([...field.value.filter((current)=>current.url!==url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
               <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category:</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {categories?.map(category=>(
                        <SelectItem
                         key={category.id}
                         value={category.id}
                        >
                         {category.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size:</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {sizes?.map(size=>(
                        <SelectItem
                         key={size.id}
                         value={size.id}
                        >
                         {size.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color:</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {colors?.map(color=>(
                        <SelectItem
                         key={color.id}
                         value={color.id}
                        >
                         {color.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
               <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="9.99$"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem  className=" flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <div className=" space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                    </div>      
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem  className=" flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <div className=" space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                    </div>      
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

export default  ProductForm;
