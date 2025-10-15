'use client';

import { usePlantStore } from '@/lib/store';

export default function ProcessFlow() {
  const { stages, sensors } = usePlantStore();

  const StageBox = ({ name, data, color }: { name: string; data: any; color: string }) => (
    <div className={`card-industrial border-l-4 border-${color}`}>
      <div className="text-sm font-semibold text-gray-400 mb-1">{name}</div>
      <div className="grid grid-cols-2 gap-2 text-xs mono">
        <div>BOD: <span className="text-status-blue">{data.BOD.toFixed(1)}</span></div>
        <div>TSS: <span className="text-status-green">{data.TSS.toFixed(1)}</span></div>
      </div>
    </div>
  );

  return (
    <div className="card-industrial">
      <div className="text-lg font-bold mb-4 border-b border-industrial-border pb-2">
        PROCESS FLOW
      </div>

      <div className="space-y-2">
        <StageBox name="RAW INFLUENT" data={stages.raw} color="status-red" />

        <div className="flex justify-center">
          <div className="w-px h-8 bg-industrial-border relative overflow-hidden">
            <div className="absolute w-full h-2 bg-status-blue flow-particle" style={{ animationDelay: '0s' }} />
            <div className="absolute w-full h-2 bg-status-blue flow-particle" style={{ animationDelay: '1s' }} />
            <div className="absolute w-full h-2 bg-status-blue flow-particle" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        <StageBox name="PRIMARY (API/DAF)" data={stages.primary} color="status-yellow" />

        <div className="flex justify-center">
          <div className="w-px h-8 bg-industrial-border relative overflow-hidden">
            <div className="absolute w-full h-2 bg-status-blue flow-particle" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-full h-2 bg-status-blue flow-particle" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        <div className="card-industrial border-l-4 border-status-blue">
          <div className="text-sm font-semibold text-gray-400 mb-1">SECONDARY (MBBR)</div>
          <div className="grid grid-cols-3 gap-2 text-xs mono">
            <div>BOD: <span className="text-status-blue">{stages.secondary.BOD.toFixed(1)}</span></div>
            <div>TSS: <span className="text-status-green">{stages.secondary.TSS.toFixed(1)}</span></div>
            <div>DO: <span className="text-terminal-green">{sensors.DO.value.toFixed(1)}</span></div>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < Math.floor(sensors.DO.value / 1.67) ? 'bg-terminal-green' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-px h-8 bg-industrial-border relative overflow-hidden">
            <div className="absolute w-full h-2 bg-status-green flow-particle" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>

        <StageBox name="TERTIARY (UF+RO)" data={stages.tertiary} color="status-green" />

        <div className="flex justify-center">
          <div className="w-px h-8 bg-industrial-border relative overflow-hidden">
            <div className="absolute w-full h-2 bg-terminal-green flow-particle" style={{ animationDelay: '0.7s' }} />
          </div>
        </div>

        <StageBox name="TREATED OUTPUT" data={stages.treated} color="terminal-green" />
      </div>

      <div className="mt-4 pt-4 border-t border-industrial-border text-center">
        <div className="text-xs text-gray-400">
          BOD Removal: <span className="text-terminal-green font-bold">
            {(((stages.raw.BOD - stages.treated.BOD) / stages.raw.BOD) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
