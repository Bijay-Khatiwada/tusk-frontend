'use client';

import { useRouter } from 'next/navigation';

 const useLogout = () => {
  const router = useRouter();

  return () => {
    localStorage.clear();
    router.push('/login');
  };
};

export default useLogout;