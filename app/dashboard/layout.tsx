'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import OnboardingModal from '@/components/OnboardingModal';
import { usePlantStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { startSimulation, stopSimulation } = usePlantStore();

  useEffect(() => {
    // Auto-start simulation when entering dashboard
    startSimulation();

    return () => {
      // Keep simulation running when navigating within dashboard
    };
  }, [startSimulation]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <OnboardingModal />
    </div>
  );
}
