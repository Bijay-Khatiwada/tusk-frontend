'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type User = { _id: string; name: string };
type Team = { _id: string; name: string; members?: User[] };

type Project = {
  _id: string;
  name: string;
  description: string;
  createdBy?: User;
  team?: Team;
  createdAt?: string;
};

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => localStorage.getItem('jwtToken');

  // Fetch Project Details
  useEffect(() => {
    const fetchProject = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('JWT Token is missing!');
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:5001/project/list/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch project');

        const data = await res.json();
        setProject(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Fetch Teams
  useEffect(() => {
    const fetchTeams = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('JWT Token is missing!');
        return;
      }
      try {
        const res = await fetch('http://127.0.0.1:5001/team/list', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch teams');

        const teamsData = await res.json();
        setTeams(teamsData);
        setTeamLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Failed to load teams');
        setTeamLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Update Project
  const handleUpdate = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('JWT Token is missing!');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5001/project/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: project?.name,
          description: project?.description,
          team: project?.team?._id, // ✅ ONLY send the ID
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update project`);
      }

      alert('Project updated successfully! 🎯');
      router.push('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project.');
    }
  };

  // Delete Project
  const handleDelete = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('JWT Token is missing!');
      return;
    }

    try {
      await fetch(`http://127.0.0.1:5001/project/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      alert('Project deleted successfully! 🗑️');
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  if (loading || teamLoading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>

      {/* Name */}
      <div className="mb-4">
        <label className="font-semibold">Project Name</label>
        <input
          type="text"
          value={project?.name || ''}
          onChange={(e) => setProject({ ...project!, name: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Project Name"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="font-semibold">Description</label>
        <textarea
          value={project?.description || ''}
          onChange={(e) => setProject({ ...project!, description: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Description"
        />
      </div>

      {/* Created By (Read Only) */}
      <div className="mb-4">
        <label className="font-semibold">Created By</label>
        <input
          type="text"
          value={project?.createdBy?.name || ''}
          readOnly
          className="w-full p-2 mb-4 border rounded bg-gray-200"
          placeholder="Created By"
        />
      </div>

      {/* Team */}
      <div className="mb-4">
        <label className="font-semibold">Team</label>
        <select
          value={project?.team?._id || ''}
          onChange={(e) => {
            const selectedTeam = teams.find((team) => team._id === e.target.value);
            if (selectedTeam) {
              setProject({ ...project!, team: { _id: selectedTeam._id, name: selectedTeam.name } });
            }
          }}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
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

export default ProjectDetailsPage;
