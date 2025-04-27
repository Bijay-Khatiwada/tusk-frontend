'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#1f2937', 
    borderColor: '#374151',
    color: '#fff',
    minHeight: '36px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2563eb'
      : state.isFocused
      ? '#374151'
      : '#1f2937',
    color: '#fff',
    '&:hover': { backgroundColor: '#4b5563' },
  }),
  input: (provided: any) => ({ ...provided, color: '#fff' }),
  singleValue: (provided: any) => ({ ...provided, color: '#fff' }),
  multiValue: (provided: any) => ({ ...provided, backgroundColor: '#4b5563' }),
  multiValueLabel: (provided: any) => ({ ...provided, color: '#fff' }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#f87171',
    ':hover': { backgroundColor: '#f87171', color: '#fff' },
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

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (!token) {
      console.error('JWT Token missing');
      return;
    }

    const fetchUsersAndProjects = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/user/list', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://127.0.0.1:5001/project/list', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();

        setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        setProjects(Array.isArray(projectsData) ? projectsData : projectsData.projects || []);
      } catch (error) {
        console.error('Error fetching users/projects:', error);
      }
    };

    fetchUsersAndProjects();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions: any, fieldName: 'members' | 'projects') => {
    const values = selectedOptions.map((option: any) => option.value);
    setFormData((prev) => ({ ...prev, [fieldName]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) {
      alert('You must be logged in to create a team.');
      return;
    }

    const payload = { ...formData, createdBy: userId };

    try {
      const res = await fetch('http://127.0.0.1:5001/team/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Team created successfully 🎉');
        router.push('/teams');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Team</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Name */}
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Team Name"
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Team Description"
          rows={4}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        />

        {/* Members Select */}
        <div>
          <label className="block mb-1 font-semibold text-white">Select Members</label>
          <Select
            isMulti
            options={users.map((user) => ({
              value: user._id,
              label: `${user.name} (${user.email})`,
            }))}
            styles={customSelectStyles}
            onChange={(options) => handleMultiSelectChange(options, 'members')}
          />
        </div>

        {/* Projects Select */}
        <div>
          <label className="block mb-1 font-semibold text-white mt-4">Select Projects</label>
          <Select
            isMulti
            options={projects.map((project) => ({
              value: project._id,
              label: project.name,
            }))}
            styles={customSelectStyles}
            onChange={(options) => handleMultiSelectChange(options, 'projects')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Create Team
        </button>
      </form>
    </main>
  );
}
