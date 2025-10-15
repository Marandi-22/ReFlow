'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePlantStore } from '@/lib/store';
import {
  Gauge, Target, FileText, Download, TrendingUp,
  TrendingDown, Activity, AlertTriangle, Droplet, Zap
} from 'lucide-react';
import { getActiveAlarms } from '@/lib/alarms';

export default function DashboardPage() {
  const { running, stages, sensors, events, alarms } = usePlantStore();
  const activeAlarms = getActiveAlarms(alarms);

  // Calculate metrics
  const bodRemoval = ((stages.raw.BOD - stages.treated.BOD) / stages.raw.BOD) * 100;
  const reuseRate = 82;  // Mock for now
  const energyEfficiency = 1.8; // kWh/m³
  const uptime = 99.1;

  const kpiCards = [
    {
      title: 'Water Reuse Rate',
      value: `${reuseRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Droplet,
      color: 'text-blue-400',
    },
    {
      title: 'Energy Efficiency',
      value: `${energyEfficiency}`,
      unit: 'kWh/m³',
      change: '-0.3',
      trend: 'down',
      icon: Zap,
      color: 'text-green-400',
    },
    {
      title: 'BOD Removal',
      value: `${bodRemoval.toFixed(1)}%`,
      change: '→',
      trend: 'stable',
      icon: Activity,
      color: 'text-purple-400',
    },
    {
      title: 'Active Alarms',
      value: activeAlarms.length,
      change: activeAlarms.length > 0 ? '⚠' : '✓',
      trend: activeAlarms.length > 0 ? 'up' : 'stable',
      icon: AlertTriangle,
      color: activeAlarms.length > 0 ? 'text-red-400' : 'text-green-400',
    },
  ];

  const quickActions = [
    { title: 'Enter Control Room', href: '/control-room', icon: Gauge, description: 'Monitor and control plant operations', color: 'blue' },
    { title: 'Run Scenario', href: '/scenarios', icon: Target, description: 'Practice operational challenges', color: 'purple' },
    { title: 'View Reports', href: '/reports', icon: FileText, description: 'Generate performance reports', color: 'green' },
    { title: 'Export Data', href: '#', icon: Download, description: 'Download CSV/PDF data', color: 'yellow' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">
          Welcome to ReFlow. Plant status: <span className={running ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>{running ? 'Running' : 'Stopped'}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-[var(--bg-primary)] rounded-lg ${kpi.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-[var(--success)]' :
                  kpi.trend === 'down' ? 'text-[var(--danger)]' :
                  'text-[var(--text-secondary)]'
                }`}>
                  {kpi.change}
                </div>
              </div>
              <div className="text-sm text-[var(--text-secondary)] mb-1">{kpi.title}</div>
              <div className="text-3xl font-bold font-mono">
                {kpi.value}
                {kpi.unit && <span className="text-lg text-[var(--text-secondary)] ml-1">{kpi.unit}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            const colorMap: Record<string, string> = {
              blue: 'from-blue-500 to-blue-600',
              purple: 'from-purple-500 to-purple-600',
              green: 'from-green-500 to-green-600',
              yellow: 'from-yellow-500 to-yellow-600',
            };

            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="card h-full flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorMap[action.color]} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plant Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Plant Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">System State</span>
              <span className={`badge ${running ? 'badge-success' : 'badge-danger'}`}>
                {running ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Uptime</span>
              <span className="font-mono font-semibold">{uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Flow Rate</span>
              <span className="font-mono font-semibold">{sensors.flow.value.toFixed(1)} m³/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">DO Level</span>
              <span className="font-mono font-semibold">{sensors.DO.value.toFixed(2)} mg/L</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.slice(-10).reverse().map((event, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  event.type === 'alarm' ? 'bg-red-400' :
                  event.type === 'warning' ? 'bg-yellow-400' :
                  event.type === 'control' ? 'bg-green-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <span className="text-[var(--text-secondary)] mr-2">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                  <span>{event.message}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
