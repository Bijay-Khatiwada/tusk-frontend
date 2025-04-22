'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); // Prevent rendering before we check

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwtToken');

      if (token) {
        console.log('✅ Token found, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('⛔️ No token, redirecting to login');
        router.push('/login');
      }
    }

    // Even if window doesn't exist initially, we still wait a moment
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <div>Loading...</div>; // Prevent flickering
  }

  return null;
};

export default HomePage;
