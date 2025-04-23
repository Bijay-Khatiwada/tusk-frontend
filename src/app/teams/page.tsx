'use client';
import React, { useEffect, useState } from 'react';
import TeamCardWrapper from '../components/TeamCardWrapper';
import Link from 'next/link';

type User = { name: string };
type Project = { name: string };

type Team = {
  _id: string;
  name: string;
  description: string;
  createdBy?: User;
  members?: User[];
  projects?: Project[];
  createdAt?: string;
};

const TeamListPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No token found. Please login again.');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/team/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch teams');
        }

        const teamsData = await res.json();
        setTeams(teamsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchTeams();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <img
          id="icon-image"
          src="/images/team.png"
          alt="Logo"
          className="w-12 h-12 relative top-1"
        />
        Teams
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {teams.map((team) => (
          <TeamCardWrapper
            key={team._id}
            id={team._id}
            title={team.name}
            description={
              <>
                <p className="mb-1">{team.description}</p>
                <p className="text-sm"><strong>Created By:</strong> {team.createdBy?.name || 'Unknown'}</p>
                <p className="text-sm"><strong>Members:</strong> {team.members?.map(m => m.name).join(', ') || 'None'}</p>
                <p className="text-sm"><strong>Projects:</strong> {team.projects?.map(p => p.name).join(', ') || 'None'}</p>
                <p className="text-sm"><strong>Created At:</strong> {team.createdAt ? new Date(team.createdAt).toLocaleString() : 'N/A'}</p>
              </>
            }
          />
        ))}
      </ul>

      <Link href="../teams/create">
  <div className="create-button" title="Create Task">
    <span>+</span>
  </div>
</Link>
    </main>
  );
};

export default TeamListPage;
