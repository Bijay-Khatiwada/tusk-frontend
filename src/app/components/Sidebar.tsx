// src/app/components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li><Link href="/tasks">Tasks</Link></li>
        <li><Link href="/teams">Teams</Link></li>
        <li><Link href="/projects">Projects</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
