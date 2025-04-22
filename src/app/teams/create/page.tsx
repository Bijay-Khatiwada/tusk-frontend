'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTeamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [] as string[],
    projects: [] as string[],
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken'); // Get the token from localStorage

      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const [usersRes, projectsRes] = await Promise.all([
        fetch('http://127.0.0.1:5001/user/list', {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the header
          }
        }),
        fetch('http://127.0.0.1:5001/project/list', {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the header
          }
        })
      ]);

      const usersData = await usersRes.json();
      const projectsData = await projectsRes.json();

      console.log('Fetched users data:', usersData);

      const maybeUsers = Array.isArray(usersData) ? usersData : usersData.users;
      setUsers(maybeUsers || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Failed to fetch users/projects:', error);
    }
  };

  fetchData();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      createdBy: userId,
    };

    try {
      const res = await fetch('http://localhost:5001/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/teams');
      } else {
        alert('Failed to create team');
      }
    } catch (error) {
      alert('Error occurred while creating the team');
      console.error(error);
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

        <select
          name="members"
          multiple
          value={formData.members}
          onChange={handleSelectChange}
          className="w-full p-2 border rounded"
        >
          <option disabled value="">
            Select Members
          </option>
          {Array.isArray(users) &&
            users.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
        </select>

        <select
          name="projects"
          multiple
          value={formData.projects}
          onChange={handleSelectChange}
          className="w-full p-2 border rounded"
        >
          <option disabled value="">
            Select Projects
          </option>
          {projects.map((project: any) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Team
        </button>
      </form>
    </main>
  );
}
