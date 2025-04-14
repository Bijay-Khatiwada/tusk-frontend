'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await fetch('http://127.0.0.1:5001/project/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      
        if (res.ok) {
          router.push('/projects');
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to create project');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('Something went wrong while connecting to the server.');
      }
  };      

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Project Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </main>
  );
}
