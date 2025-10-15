'use client';

import { usePlantStore } from '@/lib/store';
import { getUnacknowledgedAlarms } from '@/lib/alarms';
import { formatTime } from '@/lib/simulator';

export default function AlarmBanner() {
  const { alarms, acknowledgeAlarm } = usePlantStore();
  const unacknowledgedAlarms = getUnacknowledgedAlarms(alarms);

  if (unacknowledgedAlarms.length === 0) return null;

  return (
    <div className="bg-status-red/20 border-y border-status-red px-6 py-3 alarm-flash">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-status-red text-2xl">⚠</span>
          <div>
            <div className="text-status-red font-bold text-lg">ACTIVE ALARMS</div>
            <div className="text-sm text-gray-300">
              {unacknowledgedAlarms.map((alarm, idx) => (
                <div key={alarm.id}>
                  [{formatTime(alarm.timestamp)}] {alarm.message}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => unacknowledgedAlarms.forEach(a => acknowledgeAlarm(a.id))}
          className="btn-industrial bg-status-red/30 border-status-red hover:bg-status-red/50"
        >
          ACKNOWLEDGE ALL
        </button>
      </div>
    </div>
  );
}
