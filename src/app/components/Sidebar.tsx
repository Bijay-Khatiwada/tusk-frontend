import React from 'react';
import Link from 'next/link';
import useLogout from '../utils/logout'; // Adjust path if needed

const Sidebar = () => {
  const handleLogout = useLogout();

  return (
    <aside className="sidebar">
      <div className="flex-grow">
        <ul className="sidebar-links space-y-2">
          <li><Link href="/tasks">Tasks</Link></li>
          <li><Link href="/teams">Teams</Link></li>
          <li><Link href="/projects">Projects</Link></li>
        </ul>
      </div>
      <div className="pt-4 border-t">
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
