'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const getBackgroundImage = (pathname: string): string => {
  return '/images/white.png'; // Simplified for now
};

const PUBLIC_ROUTES = ['/login', '/signup'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const backgroundImage = getBackgroundImage(pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublic) {
      router.push('/login'); // Redirect if not logged in
    }

    setIsAuthenticated(!!token);
  }, [pathname]);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // If on public route (signup/login), show only content
  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated routes: show full layout
  return (
    <div className="layout" style={{ position: 'relative' }}>
      <div
        className="background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          zIndex: -1,
          filter: 'grayscale(50%)',
        }}
      />
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
