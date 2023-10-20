import {create} from 'zustand'

interface useDeleteAlertModalStore{
    isOpen:boolean,
    onOpen:()=>void,
    onClose:()=>void
}

export const useDeleteAlertModal =create<useDeleteAlertModalStore>((set)=>(
    {
        isOpen:false,
        onOpen:()=>set({isOpen:true}),
        onClose:()=>set({isOpen:false})
    }
))