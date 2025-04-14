// src/app/tasks/page.tsx

async function getTasks() {
  const res = await fetch("http://127.0.0.1:5001/task/list", {
    cache: "no-store", // So we always get fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 All Tasks</h1>
      <ul className="space-y-3">
        {tasks.map((task: any) => (
          <li key={task._id} className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <span className="text-sm text-gray-600">Status: {task.status}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
