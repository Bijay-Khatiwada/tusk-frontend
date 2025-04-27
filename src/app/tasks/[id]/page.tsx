'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]); // Store users for dropdown
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const getAuthToken = () => {
    return localStorage.getItem('jwtToken');
  };

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      const token = getAuthToken();

      if (!token) {
        console.error('JWT Token is missing!');
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:5001/task/list/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch task');
        }

        const data = await res.json();
        
        // Ensure 'assignedTo' is populated with ObjectId, and 'createdBy' with name
        setTask({
          ...data,
          assignedTo: data.assignedTo ? data.assignedTo._id : '',
          createdBy: data.createdBy ? data.createdBy.name : '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task:', error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAuthToken();

      if (!token) {
        console.error('JWT Token is missing!');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5001/user/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
        setUserLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Update Task
  const handleUpdate = async () => {
    // Log the task data before sending the update request
    console.log("Updating task with the following data:", task);

    try {
      const res = await fetch(`http://127.0.0.1:5001/task/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo, // Sending ObjectId for assignedTo
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update task: ${res.statusText}`);
      }

      const updatedTask = await res.json();
      console.log('Updated Task:', updatedTask);
      alert('Task updated!');
      router.push('/tasks');  // Redirect to tasks page after update
    } catch (error) {
      console.error('Error:', error);  // Log error if update fails
      alert('Failed to update task.');
    }
  };

  // Handle Delete Task
  const handleDelete = async () => {
    const token = getAuthToken();

    if (!token) {
      console.error('JWT Token is missing!');
      return;
    }

    await fetch(`http://127.0.0.1:5001/task/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Task deleted!');
    router.push('/tasks');
  };

  // If loading or fetching users, show loading
  if (loading || userLoading) return <p>Loading...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="font-semibold">Task Title</label>
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Task Title"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="font-semibold">Description</label>
        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          placeholder="Task Description"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="font-semibold">Status</label>
        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Priority */}
      <div className="mb-4">
        <label className="font-semibold">Priority</label>
        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Assigned To */}
      <div className="mb-4">
        <label className="font-semibold">Assigned To</label>
        <select
          value={task.assignedTo || ''} // Use ObjectId or empty string if unassigned
          onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Unassigned</option>
          {users.map((user: any) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Created By (Read-only) */}
      <div className="mb-4">
        <label className="font-semibold">Created By</label>
        <input
          type="text"
          value={task.createdBy}
          readOnly
          className="w-full p-2 mb-4 border rounded bg-gray-200"
          placeholder="Created By"
        />
      </div>

      {/* Created At (Read-only) */}
      <div className="mb-4">
        <label className="font-semibold">Created At</label>
        <input
          type="text"
          value={new Date(task.createdAt).toLocaleString()}
          readOnly
          className="w-full p-2 mb-4 border rounded bg-gray-200"
          placeholder="Created At"
        />
      </div>

      {/* Updated At (Read-only) */}
      <div className="mb-4">
        <label className="font-semibold">Updated At</label>
        <input
          type="text"
          value={new Date(task.updatedAt).toLocaleString()}
          readOnly
          className="w-full p-2 mb-4 border rounded bg-gray-200"
          placeholder="Updated At"
        />
      </div>

      {/* Update and Delete Buttons */}
      <div className="flex gap-4">
        <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
          Update
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </main>
  );
}
