import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReFlow - Industrial Wastewater Digital Twin',
  description: 'Professional SCADA-style monitoring and control for wastewater treatment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
