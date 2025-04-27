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
  const [loading, setLoading] = useState(false); // For handling the loading state
  const [error, setError] = useState(""); // For error messages
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('No token found, please log in.');
          return;
        }

        const res = await fetch('http://127.0.0.1:5001/team/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          const maybeTeams = Array.isArray(data) ? data : data.teams;
          setTeams(maybeTeams || []);
        } else {
          setError(data.message || 'Failed to fetch teams');
        }
      } catch (error) {
        setError('Failed to fetch teams: ' + error);
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
  const token = localStorage.getItem('jwtToken');


  try {
    const res = await fetch('http://127.0.0.1:5001/project/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
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
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Team</option>
          {teams.map((team: any) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </main>
  );
}
