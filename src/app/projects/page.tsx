// src/app/projects/page.tsx

'use client';

import { useEffect, useState } from 'react';
import ProjectCardWrapper from '../components/ProjectCardWrapper';
import Link from 'next/link';

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('http://127.0.0.1:5001/project/list'); // Adjust to your endpoint
      const data = await res.json();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Projects</h1>
      <ul className="space-y-3">
        {projects.map((project: any) => (
          <ProjectCardWrapper
            key={project._id}
            id={project._id}
            title={project.title}
            description={project.description}
            footer={`Status: ${project.status}`}
          />
        ))}
      </ul>

      {/* Floating "Create Project" button */}
      <Link href="../projects/new">
        <div
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
          title="Create Project"
          style={{
            position: 'fixed',
            bottom: '6rem', // Adjust as needed
            right: '6rem', // Adjust as needed
            width: '80px',  // Circle size
            height: '80px', // Circle size
            fontSize: '90px', // Font size for the plus sign
          }}
        >
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '50px', // Adjust size to fit
          }}>
            +
          </span>
        </div>
      </Link>
    </main>
  );
}
