'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <aside className="sidebar flex flex-col justify-between h-screen p-4">
      {/* Top section with navigation links */}
      <ul className="sidebar-links space-y-2">
        <li><Link href="/tasks">Tasks</Link></li>
        <li><Link href="/teams">Teams</Link></li>
        <li><Link href="/projects">Projects</Link></li>
      </ul>

      {/* Bottom-anchored logout button */}
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
