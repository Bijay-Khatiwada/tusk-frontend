'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '../utils/auth'; // Make sure this path is correct
import { refreshToken } from '../utils/refreshToken';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      scheduleTokenRefresh(token, router); // Pass router as an argument
    }
  }, [router]);

  const scheduleTokenRefresh = (token: string, router: any) => {
    const decoded = decodeJWT(token);
    if (!decoded) return;

    const expiry = decoded.exp * 1000; // JWT gives seconds, JS uses ms
    const now = Date.now();
    const timeout = expiry - now - (60 * 1000); // Refresh 1 min before expiry

    if (timeout <= 0) {
      console.warn('Token already expired or expiring too soon.');
      return;
    }

    console.log(`Token will refresh in ${timeout / 1000}s`);

    setTimeout(async () => {
      const newToken = await refreshToken(token);

      if (newToken) {
        localStorage.setItem('jwtToken', newToken);
        scheduleTokenRefresh(newToken, router); // Pass router as an argument
      } else {
        console.warn('Failed to refresh token, redirecting to login.');
        router.push('/login');
      }
    }, timeout);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:5001/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok && data.token) {
      const decoded = decodeJWT(data.token);

      if (decoded) {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('userId', decoded.userId);
        localStorage.setItem('user', JSON.stringify(data.user));

        scheduleTokenRefresh(data.token, router); // Pass router as an argument
        router.push('/');
      } else {
        alert('Failed to decode token.');
      }
    } else {
      console.error('Login failed:', data.message || 'Unknown error');
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>

      {/* Sign Up Redirect */}
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;