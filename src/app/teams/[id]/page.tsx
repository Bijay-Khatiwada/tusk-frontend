'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select from 'react-select';

type User = { _id: string; name: string };
type Project = { _id: string; name: string };

type Team = {
  _id: string;
  name: string;
  description: string;
  createdBy?: User;
  members?: User[];
  projects?: Project[];
  createdAt?: string;
  updatedAt?: string;
};

const TeamDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getAuthToken = () => localStorage.getItem('jwtToken');

  // Detect dark mode (adjust as needed)
  useEffect(() => {
    setIsDarkMode(document.body.classList.contains('dark-theme'));
  }, []);

  // Fetch Team Details
  useEffect(() => {
    const fetchTeam = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('JWT Token is missing!');
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:5001/team/list/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch team');

        const data = await res.json();
        setTeam(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team:', error);
        setLoading(false);
        setError('Failed to load team details');
      }
    };
    fetchTeam();
  }, [id]);

  // Fetch Users and Projects
  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('JWT Token is missing!');
        return;
      }
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch('http://127.0.0.1:5001/user/list', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:5001/project/list', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !projectsRes.ok) {
          throw new Error('Failed to fetch users or projects');
        }

        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();

        setUsers(usersData);
        setProjects(projectsData);
        setUserLoading(false);
        setProjectLoading(false);
      } catch (error) {
        console.error('Error fetching users/projects:', error);
        setUserLoading(false);
        setProjectLoading(false);
        setError('Failed to load users and projects');
      }
    };
    fetchUsersAndProjects();
  }, []);

  // Update Team
  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('JWT Token is missing!');
      return;
    }

    if (!team) {
      setError('No team data available to update.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5001/team/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: team.name,
          description: team.description,
          createdBy: team.createdBy?._id || null,
          members: team.members?.map((m) => m._id) || [],
          projects: team.projects?.map((p) => p._id) || [],
        }),
      });

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(`Failed to update team: ${errorDetails.message}`);
      }

      const updatedTeam = await res.json();
      console.log("Updated team response:", updatedTeam); // Log the response for debugging
      alert('Team updated successfully! 🚀');
      router.push('/teams');
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Failed to update team.');
    }
  };

  // Delete Team
  const handleDelete = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('JWT Token is missing!');
      return;
    }

    try {
      await fetch(`http://127.0.0.1:5001/team/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      alert('Team deleted successfully! 🗑️');
      router.push('/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team.');
    }
  };

  if (loading || userLoading || projectLoading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Team Details</h1>

      {/* Team Name */}
      <div className="mb-4">
        <label className="font-semibold">Team Name</label>
        <input
          type="text"
          value={team?.name || ''}
          onChange={(e) => setTeam(prev => prev ? { ...prev, name: e.target.value } : null)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Team Name"
        />
      </div>

      {/* Team Description */}
      <div className="mb-4">
        <label className="font-semibold">Description</label>
        <textarea
          value={team?.description || ''}
          onChange={(e) => setTeam(prev => prev ? { ...prev, description: e.target.value } : null)}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Description"
        />
      </div>

      {/* Created By */}
      <div className="mb-4">
        <label className="font-semibold">Created By</label>
        <input
          type="text"
          value={team?.createdBy?.name || ''}
          readOnly
          className="w-full p-2 mb-4 border rounded bg-gray-200"
          placeholder="Created By"
        />
      </div>

      {/* Members */}
      <div className="mb-4">
        <label className="font-semibold mb-2 block">Members</label>
        <Select
          isMulti
          options={users.map((user) => ({
            value: user._id,
            label: user.name,
          }))}
          value={team?.members?.map((m) => ({
            value: m._id,
            label: m.name,
          })) || []}
          onChange={(selectedOptions) => {
            setTeam(prev => prev ? {
              ...prev,
              members: selectedOptions.map(option => ({
                _id: option.value,
                name: option.label,
              })),
            } : null);
          }}
          className="mb-4"
          classNamePrefix="select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDarkMode ? '#4ade80' : '#ccf3d2',
              primary: isDarkMode ? '#22c55e' : '#2e7d60',
              neutral0: isDarkMode ? '#1f2937' : '#ffffff',
              neutral80: isDarkMode ? '#d1d5db' : '#1f2937',
            },
          })}
        />
      </div>

      {/* Projects */}
      <div className="mb-4">
        <label className="font-semibold">Projects</label>
        <select
          multiple
          value={team?.projects?.map((p) => p._id) || []}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
            setTeam(prev => prev ? { ...prev, projects: projects.filter((project) => selectedIds.includes(project._id)) } : null);
          }}
          className="w-full p-2 mb-4 border rounded"
        >
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </main>
  );
};

export default TeamDetailsPage;
