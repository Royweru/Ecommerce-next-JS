import React, { useState } from "react";
import axios from "axios";
import { SizeColumn} from "./columns";
import AlertModal from "@/components/modals/alert-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";

interface CellActionProps {
  data: SizeColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter();
  const params = useParams();
  const onDelete = async () => {
    try {
        setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
      router.refresh();
    
      toast({
        description: "Color was successfully deleted",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "Make sure you remove all categories out of this billboard",
      });
    }finally{
        setIsLoading(false)
    }
  };
  const oncopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      description: " Color Id copied to the clipboard successfully",
    });
  };
  
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <span className=" sr-only">Open menu</span>
            <MoreHorizontal className=" h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => oncopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/colors/${data.id}`)
            } 
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
