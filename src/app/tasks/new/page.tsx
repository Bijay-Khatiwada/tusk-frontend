'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    priority: 'Medium', // Default priority
    status: 'ToDo',      // Corrected the typo
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT token not found.');
          return;
        }

        const [userRes, projectRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/user/list', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:5001/project/list', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await userRes.json();
        const projectsData = await projectRes.json();

        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        setProjects(Array.isArray(projectsData) ? projectsData : projectsData.projects || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('JWT token not found.');
      alert('You are not authenticated!');
      return;
    }

    const payload = {
      ...formData,
      createdBy: userId,
    };

    try {
      console.log('Token:', token);
      const res = await fetch('http://127.0.0.1:5001/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Attach token properly
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Task created successfully! 🚀');
        router.push('/tasks');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to create task');
      }
    } catch (err) {
      console.error('Task creation failed:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          className="w-full p-2 border rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        {/* Assign to User */}
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Assign to</option>
          {users.map((user: any) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        {/* Select Project */}
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Project</option>
          {projects.map((project: any) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Priority Field */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Priority</option>
          <option value="Low">Low 🔵</option>
          <option value="Medium">Medium 🟡</option>
          <option value="High">High 🔴</option>
        </select>

        {/* Status Field */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="ToDo">To Do</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Submit Button */}
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
