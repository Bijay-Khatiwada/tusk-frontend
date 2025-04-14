'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const getBackgroundImage = (pathname: string): string => {
  if (pathname.startsWith('/tasks')) return '/images/tasks-bg.jpg';
  if (pathname.startsWith('/teams')) return '/images/teams-bg.jpg';
  if (pathname.startsWith('/projects')) return '/images/projects-bg.jpg';
  return '/images/default-alien-bg.jpg';
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const backgroundImage = getBackgroundImage(pathname);

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
export { ClientLayout };