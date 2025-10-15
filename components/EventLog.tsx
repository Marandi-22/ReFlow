'use client';

import { usePlantStore } from '@/lib/store';
import { formatTime } from '@/lib/simulator';

export default function EventLog() {
  const { events } = usePlantStore();

  const getEventColor = (type: string) => {
    switch (type) {
      case 'alarm': return 'text-status-red';
      case 'warning': return 'text-status-yellow';
      case 'control': return 'text-terminal-green';
      case 'info': return 'text-status-blue';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="card-industrial h-full flex flex-col">
      <div className="text-lg font-bold mb-2 border-b border-industrial-border pb-2">
        EVENT LOG
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs">
        {events.slice(-20).reverse().map((event, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="text-gray-500">[{formatTime(event.timestamp)}]</span>
            <span className={`${getEventColor(event.type)} font-semibold`}>[{event.type.toUpperCase()}]</span>
            <span className="text-gray-300">{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
