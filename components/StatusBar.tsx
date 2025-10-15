'use client';

import { usePlantStore } from '@/lib/store';
import { formatTime } from '@/lib/simulator';
import { getActiveAlarms } from '@/lib/alarms';

export default function StatusBar() {
  const { running, timestamp, alarms } = usePlantStore();
  const activeAlarms = getActiveAlarms(alarms);

  return (
    <div className="bg-industrial-card border-b border-industrial-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${running ? 'bg-status-green led-green' : 'bg-gray-600 led-gray'}`} />
          <span className="text-lg font-semibold">PLANT-01 SKID-A</span>
        </div>
        <div className="text-sm text-gray-400">
          {running ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="mono text-lg">
          {formatTime(timestamp)} IST
        </div>
        {activeAlarms.length > 0 && (
          <div className="flex items-center gap-2 text-status-red">
            <span>⚠</span>
            <span className="font-semibold">{activeAlarms.length} ALARM{activeAlarms.length > 1 ? 'S' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
