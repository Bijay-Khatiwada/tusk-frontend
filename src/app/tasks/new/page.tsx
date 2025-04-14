// src/app/tasks/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://127.0.0.1:5001/task/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        assignedTo: '6621923f4c1e2f97d9f75a12', // Replace with a real user ID
        status: 'todo',
      }),
    });

    if (res.ok) {
      router.push('/tasks');
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </main>
  );
}
