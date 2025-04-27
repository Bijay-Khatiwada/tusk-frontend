// src/app/layout.tsx

import './global.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'TUSK',
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
