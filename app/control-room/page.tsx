'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlantStore } from '@/lib/store';
import { Play, Pause, Gauge, BarChart3, Settings as SettingsIcon, Sparkles, Eye } from 'lucide-react';

// Import existing components
import ProcessFlow from '@/components/ProcessFlow';
import SensorCard from '@/components/SensorCard';
import ControlPanel from '@/components/ControlPanel';
import EquipmentPanel from '@/components/EquipmentPanel';
import TrendChart from '@/components/TrendChart';
import AIInsights from '@/components/AIInsights';
import EventLog from '@/components/EventLog';

export default function ControlRoomPage() {
  const { running, startSimulation, stopSimulation, sensors } = usePlantStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'control' | 'trends' | 'ai'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Eye },
    { id: 'sensors' as const, label: 'Sensors', icon: Gauge },
    { id: 'control' as const, label: 'Control', icon: SettingsIcon },
    { id: 'trends' as const, label: 'Trends', icon: BarChart3 },
    { id: 'ai' as const, label: 'AI Insights', icon: Sparkles },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Control Room</h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              running ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${running ? 'bg-green-400 led-green' : 'bg-red-400'}`} />
              <span className="text-sm font-semibold">{running ? 'RUNNING' : 'STOPPED'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-[var(--text-secondary)]">
              {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={running ? stopSimulation : startSimulation}
              className={`btn ${running ? 'btn-danger' : 'btn-success'} flex items-center gap-2`}
            >
              {running ? (
                <>
                  <Pause size={16} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} />
                  Start
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-[var(--border-color)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'tab-active' : ''} flex items-center gap-2`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-6"
          >
            {/* Process Flow */}
            <div className="col-span-3">
              <ProcessFlow />
            </div>

            {/* Key Sensors */}
            <div className="col-span-6 space-y-6">
              <div className="grid grid-cols-4 gap-3">
                <SensorCard name="DO" value={sensors.DO.value} unit="mg/L" data={sensors.DO} decimals={2} />
                <SensorCard name="pH" value={sensors.pH.value} unit="" data={sensors.pH} decimals={2} />
                <SensorCard name="TSS" value={sensors.TSS.value} unit="mg/L" data={sensors.TSS} decimals={1} />
                <SensorCard name="BOD" value={sensors.BOD.value} unit="mg/L" data={sensors.BOD} decimals={1} />
              </div>

              {/* Mini Trends */}
              <div className="grid grid-cols-3 gap-4">
                <TrendChart
                  title="DO (mg/L)"
                  data={sensors.DO.history}
                  color="#3b82f6"
                  unit="mg/L"
                  domain={[0, 10]}
                />
                <TrendChart
                  title="BOD (mg/L)"
                  data={sensors.BOD.history}
                  color="#f59e0b"
                  unit="mg/L"
                />
                <TrendChart
                  title="Flow (m³/h)"
                  data={sensors.flow.history}
                  color="#10b981"
                  unit="m³/h"
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-3 space-y-4">
              <ControlPanel />
              <EventLog />
            </div>
          </motion.div>
        )}

        {activeTab === 'sensors' && (
          <motion.div
            key="sensors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-4"
          >
            <SensorCard name="DO" value={sensors.DO.value} unit="mg/L" data={sensors.DO} decimals={2} />
            <SensorCard name="pH" value={sensors.pH.value} unit="" data={sensors.pH} decimals={2} />
            <SensorCard name="TSS" value={sensors.TSS.value} unit="mg/L" data={sensors.TSS} decimals={1} />
            <SensorCard name="BOD" value={sensors.BOD.value} unit="mg/L" data={sensors.BOD} decimals={1} />
            <SensorCard name="Flow" value={sensors.flow.value} unit="m³/h" data={sensors.flow} decimals={1} />
            <SensorCard name="TDS" value={sensors.TDS.value} unit="ppm" data={sensors.TDS} decimals={0} />
            <SensorCard name="Turbidity" value={sensors.turbidity.value} unit="NTU" data={sensors.turbidity} decimals={1} />
            <SensorCard name="Pressure" value={sensors.pressure.value} unit="bar" data={sensors.pressure} decimals={2} />
          </motion.div>
        )}

        {activeTab === 'control' && (
          <motion.div
            key="control"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            <ControlPanel />
            <EquipmentPanel />
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            <TrendChart title="DO (mg/L)" data={sensors.DO.history} color="#3b82f6" unit="mg/L" domain={[0, 10]} />
            <TrendChart title="pH" data={sensors.pH.history} color="#10b981" unit="" domain={[6, 9]} />
            <TrendChart title="TSS (mg/L)" data={sensors.TSS.history} color="#8b5cf6" unit="mg/L" />
            <TrendChart title="BOD (mg/L)" data={sensors.BOD.history} color="#f59e0b" unit="mg/L" />
            <TrendChart title="Flow (m³/h)" data={sensors.flow.history} color="#06b6d4" unit="m³/h" />
            <TrendChart title="Pressure (bar)" data={sensors.pressure.history} color="#ec4899" unit="bar" />
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-6"
          >
            <div className="col-span-2">
              <AIInsights />
            </div>
            <EventLog />
          </motion.div>
        )}
      </div>
    </div>
  );
}
