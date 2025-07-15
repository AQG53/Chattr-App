import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey:["authUser"],
    queryFn: getAuthUser,
    retry: false //with false the website will not refresh. If true tenstack will try 3 times
  });

  return {isLoading: authUser.isLoading, authUser: authUser.data?.user}
}

export default useAuthUser