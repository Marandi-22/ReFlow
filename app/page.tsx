'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Droplet, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 2,
          }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <Droplet size={48} className="text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          ReFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-[var(--text-secondary)] mb-8"
        >
          Industrial Wastewater Treatment Digital Twin
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-8 justify-center mb-12 text-sm"
        >
          <div>
            <div className="text-2xl font-bold text-[var(--success)]">2.4M</div>
            <div className="text-[var(--text-secondary)]">Liters Treated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">94.2%</div>
            <div className="text-[var(--text-secondary)]">BOD Removal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">82%</div>
            <div className="text-[var(--text-secondary)]">Reuse Rate</div>
          </div>
        </motion.div>

        {/* Launch Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          className="btn btn-primary px-8 py-4 text-lg flex items-center gap-2 mx-auto shadow-xl"
        >
          Launch Simulator
          <ArrowRight size={20} />
        </motion.button>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs text-[var(--text-secondary)]"
        >
          Version 1.0.0 • Built with Claude Code
        </motion.div>
      </motion.div>
    </div>
  );
}
