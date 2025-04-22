'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    team: '',
  });

  const [teams, setTeams] = useState([]);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
          console.error('No token found, please log in.');
          return;
        }

        const res = await fetch('http://127.0.0.1:5001/team/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const maybeTeams = Array.isArray(data) ? data : data.teams;
        setTeams(maybeTeams || []);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('You must be logged in to create a project');
      return;
    }

    const payload = {
      ...form,
      createdBy: userId,
    };

    try {
      const res = await fetch('http://127.0.0.1:5001/project/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        <input
          name="name"
          placeholder="Project Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Team</option>
          {teams.map((team: any) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </main>
  );
}
