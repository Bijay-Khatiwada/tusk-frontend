'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTeamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: '', // should come from logged in user later
    members: '',
    projects: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      members: formData.members.split(',').map((id) => id.trim()),
      projects: formData.projects.split(',').map((id) => id.trim()),
    };

    const res = await fetch('http://127.0.0.1:5001/team/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/team');
    } else {
      alert('Failed to create team');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Team Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="createdBy"
          placeholder="Created By (user ID)"
          value={formData.createdBy}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="members"
          placeholder="Member IDs (comma-separated)"
          value={formData.members}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="projects"
          placeholder="Project IDs (comma-separated)"
          value={formData.projects}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Team
        </button>
      </form>
    </main>
  );
}
