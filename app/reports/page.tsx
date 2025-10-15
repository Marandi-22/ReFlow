'use client';

import { motion } from 'framer-motion';
import { usePlantStore } from '@/lib/store';
import { Download, FileText, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const { stages, sensors } = usePlantStore();

  const bodRemoval = ((stages.raw.BOD - stages.treated.BOD) / stages.raw.BOD) * 100;

  const exportCSV = () => {
    const data = [
      ['Timestamp', 'BOD_Raw', 'BOD_Treated', 'TSS_Raw', 'TSS_Treated', 'DO', 'pH', 'Flow'],
      [
        new Date().toISOString(),
        stages.raw.BOD.toFixed(2),
        stages.treated.BOD.toFixed(2),
        stages.raw.TSS.toFixed(2),
        stages.treated.TSS.toFixed(2),
        sensors.DO.value.toFixed(2),
        sensors.pH.value.toFixed(2),
        sensors.flow.value.toFixed(2),
      ],
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reflow_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-[var(--text-secondary)]">
          Generate and export performance reports
        </p>
      </div>

      {/* Daily Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Daily Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-sm text-[var(--text-secondary)] mb-1">BOD Removal</div>
            <div className="text-3xl font-bold text-green-400">{bodRemoval.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-[var(--text-secondary)] mb-1">Reuse Rate</div>
            <div className="text-3xl font-bold text-blue-400">82%</div>
          </div>
          <div>
            <div className="text-sm text-[var(--text-secondary)] mb-1">Energy Efficiency</div>
            <div className="text-3xl font-bold text-purple-400">1.8 kWh/m³</div>
          </div>
          <div>
            <div className="text-sm text-[var(--text-secondary)] mb-1">Uptime</div>
            <div className="text-3xl font-bold text-yellow-400">99.1%</div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4">
          <button
            onClick={exportCSV}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
          <button
            className="btn btn-secondary flex items-center gap-2"
            disabled
          >
            <FileText size={16} />
            Download PDF (Coming Soon)
          </button>
        </div>
      </motion.div>

      {/* Recent Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Current Readings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-color)]">
              <tr className="text-left">
                <th className="pb-3 font-semibold">Parameter</th>
                <th className="pb-3 font-semibold">Value</th>
                <th className="pb-3 font-semibold">Unit</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              <tr>
                <td className="py-3">DO (Dissolved Oxygen)</td>
                <td className="py-3 font-mono">{sensors.DO.value.toFixed(2)}</td>
                <td className="py-3">mg/L</td>
                <td className="py-3"><span className="badge badge-success">Normal</span></td>
              </tr>
              <tr>
                <td className="py-3">pH</td>
                <td className="py-3 font-mono">{sensors.pH.value.toFixed(2)}</td>
                <td className="py-3">-</td>
                <td className="py-3"><span className="badge badge-success">Normal</span></td>
              </tr>
              <tr>
                <td className="py-3">TSS (Total Suspended Solids)</td>
                <td className="py-3 font-mono">{sensors.TSS.value.toFixed(1)}</td>
                <td className="py-3">mg/L</td>
                <td className="py-3"><span className="badge badge-success">Normal</span></td>
              </tr>
              <tr>
                <td className="py-3">BOD (Biological Oxygen Demand)</td>
                <td className="py-3 font-mono">{sensors.BOD.value.toFixed(1)}</td>
                <td className="py-3">mg/L</td>
                <td className="py-3"><span className="badge badge-success">Normal</span></td>
              </tr>
              <tr>
                <td className="py-3">Flow Rate</td>
                <td className="py-3 font-mono">{sensors.flow.value.toFixed(1)}</td>
                <td className="py-3">m³/h</td>
                <td className="py-3"><span className="badge badge-success">Normal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
