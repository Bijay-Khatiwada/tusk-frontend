// src/app/components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Tusk</h1>
        <nav>
          <ul className="navbar-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about-second">About Us</Link></li>
          </ul>
        </nav>
        <div className="theme-toggle" onClick={toggleTheme}>
          <div className={`toggle-thumb ${theme}`}></div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
