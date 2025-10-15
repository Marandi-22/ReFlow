'use client';

import { usePlantStore } from '@/lib/store';

export default function EquipmentPanel() {
  const { equipment, toggleEquipment, setDosingPumpSpeed, setBypassValvePosition } = usePlantStore();

  const EquipmentRow = ({
    name,
    running,
    hours,
    onToggle,
  }: {
    name: string;
    running: boolean;
    hours: number;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-industrial-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${running ? 'bg-terminal-green led-green' : 'bg-gray-600 led-gray'}`} />
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 mono">{hours.toFixed(0)}h</span>
        <button
          onClick={onToggle}
          className={`btn-industrial text-xs px-3 py-1 ${
            running ? 'bg-terminal-green/20 border-terminal-green text-terminal-green' : ''
          }`}
        >
          {running ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="card-industrial">
      <div className="text-lg font-bold mb-4 border-b border-industrial-border pb-2">
        EQUIPMENT
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex items-center justify-between py-2 border-b border-industrial-border">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${equipment.blower.running ? 'bg-terminal-green led-green' : 'bg-gray-600 led-gray'}`} />
            <span className="text-sm">Blower</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 mono">{equipment.blower.hours.toFixed(0)}h</span>
            <span className="text-xs text-terminal-green mono">{equipment.blower.speed.toFixed(0)}%</span>
          </div>
        </div>

        <EquipmentRow
          name="Feed Pump"
          running={equipment.feedPump.running}
          hours={equipment.feedPump.hours}
          onToggle={() => toggleEquipment('feedPump')}
        />

        <EquipmentRow
          name="Recirculation Pump"
          running={equipment.recircPump.running}
          hours={equipment.recircPump.hours}
          onToggle={() => toggleEquipment('recircPump')}
        />

        <div className="flex items-center justify-between py-2 border-b border-industrial-border">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${equipment.dosingPump.running ? 'bg-terminal-green led-green' : 'bg-gray-600 led-gray'}`} />
            <span className="text-sm">Dosing Pump</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 mono">{equipment.dosingPump.hours.toFixed(0)}h</span>
            <span className="text-xs text-terminal-green mono">{equipment.dosingPump.speed.toFixed(0)}%</span>
          </div>
        </div>

        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Bypass Valve</span>
            <span className="text-xs text-terminal-green mono">{equipment.bypassValve.position.toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={equipment.bypassValve.position}
            onChange={(e) => setBypassValvePosition(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
