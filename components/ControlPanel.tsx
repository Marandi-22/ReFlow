'use client';

import { usePlantStore } from '@/lib/store';

export default function ControlPanel() {
  const { control, sensors, setDOSetpoint, setDOMode, setBlowerSpeed } = usePlantStore();
  const { DO } = control;

  return (
    <div className="card-industrial">
      <div className="text-lg font-bold mb-4 border-b border-industrial-border pb-2">
        DO CONTROL
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400 block mb-1">Target Setpoint (mg/L)</label>
            <input
              type="number"
              min="1.0"
              max="8.0"
              step="0.1"
              value={DO.setpoint.toFixed(1)}
              onChange={(e) => setDOSetpoint(parseFloat(e.target.value))}
              className="w-full bg-industrial-bg border border-industrial-border px-3 py-2 mono text-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Mode</label>
            <button
              onClick={() => setDOMode(DO.mode === 'auto' ? 'manual' : 'auto')}
              className={`btn-industrial ${
                DO.mode === 'auto' ? 'bg-terminal-green/20 border-terminal-green text-terminal-green' : ''
              }`}
            >
              {DO.mode.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Current DO</div>
            <div className="text-2xl mono text-status-blue">{sensors.DO.value.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400">Error</div>
            <div className={`text-2xl mono ${DO.PID.error > 0 ? 'text-status-yellow' : 'text-status-green'}`}>
              {DO.PID.error > 0 ? '+' : ''}{DO.PID.error.toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Blower Speed</span>
            <span className="mono text-terminal-green">{DO.output.toFixed(0)}%</span>
          </div>
          <div className="w-full h-6 bg-industrial-bg rounded overflow-hidden">
            <div
              className="h-full bg-terminal-green transition-all duration-500"
              style={{ width: `${DO.output}%` }}
            />
          </div>
        </div>

        {DO.mode === 'manual' && (
          <div>
            <label className="text-sm text-gray-400 block mb-1">Manual Blower Control</label>
            <input
              type="range"
              min="0"
              max="100"
              value={DO.output}
              onChange={(e) => setBlowerSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="pt-3 border-t border-industrial-border">
          <div className="text-xs text-gray-400 mb-2">PID Parameters</div>
          <div className="grid grid-cols-3 gap-2 text-xs mono">
            <div>Kp: <span className="text-terminal-green">{DO.PID.P.toFixed(1)}</span></div>
            <div>Ki: <span className="text-terminal-green">{DO.PID.I.toFixed(1)}</span></div>
            <div>Kd: <span className="text-terminal-green">{DO.PID.D.toFixed(1)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
