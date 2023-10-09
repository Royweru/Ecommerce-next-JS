import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const SetupPage = ()=> {
  return (
    <main className="flex min-h-screen flex-col  justify-start p-2">
     <div className=" text-lg font-bold">
      <UserButton afterSignOutUrl="/"/>
     </div>
    
    </main>
  )
}

export default SetupPage