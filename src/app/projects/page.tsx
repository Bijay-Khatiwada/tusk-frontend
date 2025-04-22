'use client';

import { useEffect, useState } from 'react';
import ProjectCardWrapper from '../components/ProjectCardWrapper';
import Link from 'next/link';

type Project = {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt?: string;
  createdBy?: {
    name: string;
  };
  team?: {
    name: string;
    members?: { name: string }[];
  };
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
          console.error('No token found. Please log in.');
          return;
        }

        const res = await fetch('http://127.0.0.1:5001/project/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('Expected projects array but got:', data);
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        <img
          id="icon-image"
          src="/images/folder.png"
          alt="Logo"
          className="w-12 h-12 inline-block"
        />{' '}
        Projects
      </h1>

      <ul className="space-y-3">
        {projects.map((project) => (
          <ProjectCardWrapper
            key={project._id}
            id={project._id}
            title={project.name}
            description={
              <>
                <p className="mb-1">{project.description}</p>
                <p className="text-sm">
                  <strong>Created By:</strong> {project.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-sm">
                  <strong>Team:</strong> {project.team?.name || 'No team'}
                </p>
                {project.team?.members?.length ? (
                  <p className="text-sm">
                    <strong>Team Members:</strong>{' '}
                    {project.team.members.map((member) => member.name).join(', ')}
                  </p>
                ) : null}
              </>
            }
            footer={project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}
          />
        ))}
      </ul>

      {/* Floating "Create Project" button */}
      <Link href="../projects/new">
        <div
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
          title="Create Project"
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '50px',
            }}
          >
            +
          </span>
        </div>
      </Link>
    </main>
  );
}
