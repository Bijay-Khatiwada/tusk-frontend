'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('Submitting:', { email: credentials.email, password: credentials.password });
  
    try {
      const res = await fetch('http://127.0.0.1:5001/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Login successful', data);
        localStorage.setItem('token', data.token);
        router.push('/users');
      } else {
        console.error('Login failed', data);
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An error occurred while logging in.');
    }
  };
  

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </main>
  );
}
