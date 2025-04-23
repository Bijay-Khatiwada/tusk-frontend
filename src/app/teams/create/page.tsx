'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#1f2937', // Tailwind dark: bg-gray-800
    borderColor: '#374151',     // dark: border-gray-700
    color: '#fff',
    minHeight: '36px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2563eb' // blue-600
      : state.isFocused
      ? '#374151' // gray-700
      : '#1f2937', // gray-800
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4b5563', // gray-600
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#4b5563',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#f87171',
    ':hover': {
      backgroundColor: '#f87171',
      color: '#fff',
    },
  }),
};


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
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.error("No token found, please log in.");
          return;
        }

        const [usersRes, projectsRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/user/list', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://127.0.0.1:5001/project/list', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();

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
  const handleMultiSelectChange = (selectedOptions: any, name: string) => {
  const values = selectedOptions.map((option: any) => option.value);
  setFormData((prev) => ({
    ...prev,
    [name]: values,
  }));
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
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        />

        <div>
          <label className="block mb-1 font-semibold">Select Members</label>
          <Select
  isMulti
  options={users.map((user: any) => ({
    value: user._id,
    label: `${user.name} (${user.email})`
  }))}
  styles={customSelectStyles}
  onChange={(options) => handleMultiSelectChange(options, 'members')}
/>
<label className="block mb-1 font-semibold">Select Project</label>
<Select
  isMulti
  options={projects.map((project: any) => ({
    value: project._id,
    label: project.name
  }))}
  styles={customSelectStyles}
  onChange={(options) => handleMultiSelectChange(options, 'projects')}
/>

        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Create Team
        </button>
      </form>
    </main>
  );
}
