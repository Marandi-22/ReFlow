'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--text-secondary)]">
          Configure plant parameters and display preferences
        </p>
      </div>

      {/* Plant Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Plant Configuration</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Plant Name</label>
            <input
              type="text"
              defaultValue="PLANT-01 SKID-A"
              className="w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Design Flow Rate (m³/h)</label>
            <input
              type="number"
              defaultValue="50"
              className="w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Simulation Speed</label>
            <select className="w-full max-w-md">
              <option value="1">1x (Real-time)</option>
              <option value="5">5x (Fast)</option>
              <option value="10">10x (Very Fast)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Control Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Control Parameters</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">PID Kp (Proportional)</label>
            <input
              type="number"
              step="0.1"
              defaultValue="15.0"
              className="w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PID Ki (Integral)</label>
            <input
              type="number"
              step="0.1"
              defaultValue="0.8"
              className="w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PID Kd (Derivative)</label>
            <input
              type="number"
              step="0.1"
              defaultValue="2.0"
              className="w-full max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default DO Setpoint (mg/L)</label>
            <input
              type="number"
              step="0.1"
              defaultValue="4.5"
              min="1.0"
              max="8.0"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </motion.div>

      {/* AI Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">AI Optimizer</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable AI Optimizer</div>
              <div className="text-sm text-[var(--text-secondary)]">Automatic optimization recommendations</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Display Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Display</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select className="w-full max-w-md">
              <option value="dark">Dark (Industrial)</option>
              <option value="light" disabled>Light (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Units</label>
            <select className="w-full max-w-md">
              <option value="metric">Metric (mg/L, m³/h)</option>
              <option value="imperial" disabled>Imperial (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chart Refresh Rate</label>
            <select className="w-full max-w-md">
              <option value="1">1 Hz (Real-time)</option>
              <option value="0.5">0.5 Hz (Slower)</option>
              <option value="2">2 Hz (Faster)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <button className="btn btn-primary flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
        <button className="btn btn-secondary">
          Reset to Defaults
        </button>
      </motion.div>
    </div>
  );
}
