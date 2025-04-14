'use client';

import { useEffect, useState } from 'react';

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
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ul className="space-y-2">
        {projects.map((project: any) => (
          <li key={project._id} className="border p-4 rounded">
            <h2 className="text-xl">{project.name}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
