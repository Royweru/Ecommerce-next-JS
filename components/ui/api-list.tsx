"use client"

import { useParams } from 'next/navigation'

import useOrigin from '@/hooks/useOrigin'

import React from 'react'
import { ApiAlert } from './api-alert'

interface ApiListProps{
    entityName:string,
    entityIdName?:string
}

const ApiList:React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`
  return (
    <>
     <ApiAlert
      title='GET'
      variant='public'
      description={`${baseUrl}/${entityName}`}
      />
        <ApiAlert
      title='POST'
      variant='public'
      description={`${baseUrl}/${entityIdName}`}
      />
        <ApiAlert
      title='PATCH'
      variant='public'
      description={`${baseUrl}/${entityName}/${entityIdName}`}
      />
        <ApiAlert
      title='DELETE'
      variant='public'
      description={`${baseUrl}/${entityName}/${entityIdName}`}
      />
    </>
  )
}

export default ApiList