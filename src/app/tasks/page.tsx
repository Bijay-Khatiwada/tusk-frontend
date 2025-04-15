// src/app/tasks/page.tsx

import React from 'react';
import TaskCardWrapper from '../components/TaskCardWrapper';
import Link from 'next/link';

async function getTasks() {
  const res = await fetch('http://127.0.0.1:5001/task/list', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">📝 All Tasks</h1>
      <div className="flex flex-wrap gap-4">
        {tasks.map((task: any) => (
          <TaskCardWrapper
            key={task._id}
            id={task._id}
            title={task.title}
            description={task.description}
            footer={`Status: ${task.status}`}
          />
        ))}
      </div>

      {/* Floating "Create Task" button */}
      <Link href="../tasks/create">
        <div
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
          title="Create Task"
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
