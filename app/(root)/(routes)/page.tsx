"use client"

import {useEffect} from 'react'

import { useStoreModal } from "@/hooks/useStoreModal";
const SetupPage = ()=> {
  const onOpen= useStoreModal((state)=>state.onOpen)
  const isOpen= useStoreModal((state)=>state.isOpen)

  useEffect(()=>{
   if(!isOpen){
    onOpen()
   }
  },[isOpen,onOpen])
  return (
    <main className="flex min-h-screen flex-col  justify-start p-2">
     <div className="p-4">
      RootPage
     </div>
    </main>
  )
}

export default SetupPage