import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2">
     <div className=" text-lg font-bold">
      Hey user 
     </div>
     <div>
      <Button size="default" >
        Click me
      </Button>
     </div>
    </main>
  )
}
