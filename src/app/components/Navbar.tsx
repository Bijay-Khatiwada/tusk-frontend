'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import useLogout from '../utils/logout'; // Adjust path as needed

const Navbar = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const handleLogout = useLogout();

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="navbar">
  <div className="navbar-container flex items-center justify-between px-4 py-2">
    <h1 className="navbar-title text-xl font-bold">Tusk</h1>

    <nav>
      <ul className="navbar-links flex space-x-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about-second">About Us</Link></li>
      </ul>
    </nav>

    {/* FIX STARTS HERE */}
    <div className="navbar-actions">
  <div
    className="theme-toggle cursor-pointer"
    onClick={toggleTheme}
  >
    <div className={`toggle-thumb ${theme}`}></div>
  </div>

  <button
  aria-label="Logout"
  onClick={handleLogout}
  title="Logout"
  className="w-6 h-6 text-red-500 cursor-pointer transition-all duration-200 hover:text-red-700 hover:scale-110 hover:drop-shadow-md flex items-center justify-center bg-transparent border-none"
>
  <LogOut className="w-full h-full" />
</button>

</div>


    {/* FIX ENDS HERE */}
  </div>
</header>

  );
};

export default Navbar;
