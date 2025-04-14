// src/app/users/page.tsx
export const dynamic = 'force-dynamic'; // disables caching

type User = {
  _id: string;
  name: string;
  email: string;
};

export default async function UsersPage() {
  const res = await fetch('http://localhost:5001/user/list', {
    cache: 'no-store',
  });

  const users: User[] = await res.json();

  if (!Array.isArray(users)) {
    throw new Error('Expected array of users');
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border p-4 rounded shadow">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
