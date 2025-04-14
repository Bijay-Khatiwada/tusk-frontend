// src/app/tasks/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`http://127.0.0.1:5001/task/list/${id}`);
      const data = await res.json();
      setTask(data);
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`http://127.0.0.1:5001/task/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task }),
    });
    alert('Task updated!');
    router.push('/tasks');
  };

  const handleDelete = async () => {
    await fetch(`http://127.0.0.1:5001/task/delete/${id}`, { method: 'DELETE' });
    alert('Task deleted!');
    router.push('/tasks');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>
      <input
        type="text"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <select
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <div className="flex gap-4">
        <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
          Update
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </main>
  );
}
