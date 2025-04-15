export const dynamic = 'force-dynamic'; // disables caching
import TeamCardWrapper from '../components/TeamCardWrapper';
import Link from 'next/link';

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
      <h1 className="text-2xl font-bold mb-4">👾 Teams</h1>

      <ul className="space-y-3">
        {teams.map((team) => (
          <TeamCardWrapper
            key={team._id}
            id={team._id}
            title={team.name}
            description={team.description}
          />
        ))}
      </ul>

      {/* Floating "Create Team" button */}
      <Link href="../teams/create">
  <div
    className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110"
    title="Create Team"
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
