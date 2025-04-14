export const dynamic = 'force-dynamic'; // disables caching

type Team = {
  _id: string;
  name: string;
  description: string;
};

export default async function TeamListPage() {
  const res = await fetch('http://127.0.0.1:5001/team/list', { cache: 'no-store' });
  const teams: Team[] = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <ul className="space-y-3">
        {teams.map((team) => (
          <li key={team._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p>{team.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
