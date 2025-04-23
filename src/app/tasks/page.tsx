'use client';

import React, { useEffect, useState } from 'react';
import TaskCardWrapper from '../components/TaskCardWrapper';
import Link from 'next/link';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        const res = await fetch('http://localhost:5001/task/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await res.json();
        setTasks(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };

    getTasks();
  }, []);

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error: {error}</h1>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        <img
          id="icon-image"
          src="/images/task.png"
          alt="Logo"
          className="w-24 h-24 inline-block"
        />
        All Tasks
      </h1>

      <div className="flex flex-wrap gap-4">
        {tasks.map((task: any) => (
          <TaskCardWrapper
            key={task._id}
            id={task._id}
            title={task.title}
            description={
              <>
                <p className="mb-1">{task.description}</p>
                <p className="text-sm">
                  <strong>Priority:</strong> {task.priority}
                </p>
                <p className="text-sm">
                  <strong>Created By:</strong> {task.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-sm">
                  <strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}
                </p>
                <p className="text-sm">
                  <strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}
                </p>
              </>
            }
            footer={`Status: ${task.status}`}
          />
        ))}
      </div>

      {/* Floating "Create Task" button */}
      <Link href="../tasks/new">
  <div className="create-button" title="Create Task">
    <span>+</span>
  </div>
</Link>
    </main>
  );
}
