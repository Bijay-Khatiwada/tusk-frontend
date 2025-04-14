// src/app/layout.tsx
import './globals.css';
import ClientLayout from './ClientLayout';



export const metadata = {
  title: 'Alien Task HQ',
  description: 'Manage your team across the stars.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
