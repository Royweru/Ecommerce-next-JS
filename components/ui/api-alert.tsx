"use client"
import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge, BadgeProps } from "./badge"
import { Button } from "./button"
import { toast } from "./use-toast"

interface ApiAlertProps{
    title:string,
    description:string,
    variant:"public"|"admin"
}

const textMap:Record<ApiAlertProps ["variant"],string>={
    public:"Public",
    admin:"Admin"
}

const variantMap:Record<ApiAlertProps ["variant"],BadgeProps["variant"]>={
    public:"secondary",
    admin:"destructive"
}



export const ApiAlert:React.FC<ApiAlertProps> =({
    title,
    description,
    variant
})=>{
    const oncopy = ()=>{
        navigator.clipboard.writeText(description);
        toast({
          description:"Api Route copied to the clipboard successfully"
        })
      }
  return(
    <Alert>
        <Server className=" h-4 w-4"/>
        <AlertTitle className=" flex items-center gap-x-2">
            {title}
            <Badge variant={variantMap[variant]}>
                {textMap[variant]}
            </Badge>
            {textMap[variant]}
        </AlertTitle>
        <AlertDescription className=" mt-4 flex items-center justify-between " >
            <code className=" relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {description}
            </code>
            <Button onClick={oncopy}>
                <Copy className=" h-4 w-4"/>
            </Button>
        </AlertDescription>
    </Alert>
  )
}