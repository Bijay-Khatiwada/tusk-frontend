'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('🚫 No token found. Redirecting to login.');
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
};

export default Dashboard;
