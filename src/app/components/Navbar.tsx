// src/app/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Task Manager</h1>
        <nav>
          <ul className="navbar-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tasks">Tasks</Link></li>
            <li><Link href="/teams">Teams</Link></li>
            <li><Link href="/projects">Projects</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
