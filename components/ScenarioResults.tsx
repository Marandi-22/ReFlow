'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Star, TrendingUp, Zap, Clock, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { ScenarioScore } from '@/types/scenarios';

interface ScenarioResultsProps {
  scenarioTitle: string;
  score: ScenarioScore;
  elapsedTime: number;
  timeLimit: number;
  isNewBest?: boolean;
  onReplay: () => void;
}

export default function ScenarioResults({
  scenarioTitle,
  score,
  elapsedTime,
  timeLimit,
  isNewBest = false,
  onReplay,
}: ScenarioResultsProps) {
  const router = useRouter();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = (score: number) => {
    if (score >= 95) return { letter: 'S', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score >= 90) return { letter: 'A+', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 85) return { letter: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 80) return { letter: 'B+', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 75) return { letter: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 70) return { letter: 'C+', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    return { letter: 'C', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const grade = getGrade(score.total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        {/* Header with confetti effect */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy size={64} className="text-yellow-300 mx-auto mb-4" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {score.total >= 90 ? 'Outstanding!' : score.total >= 75 ? 'Well Done!' : 'Scenario Complete!'}
          </h2>
          <p className="text-blue-100">{scenarioTitle}</p>

          {isNewBest && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm font-semibold"
            >
              🎉 New Best Score!
            </motion.div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="p-8">
          {/* Total Score */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`text-7xl font-bold font-mono ${grade.color}`}>
                {score.total.toFixed(0)}
              </div>
              <div className="text-left">
                <div className="text-sm text-[var(--text-secondary)]">out of</div>
                <div className="text-3xl font-bold text-[var(--text-secondary)]">100</div>
              </div>
            </div>

            {/* Grade Badge */}
            <div className={`inline-block px-6 py-3 ${grade.bg} ${grade.color} rounded-lg font-bold text-2xl mb-4`}>
              Grade: {grade.letter}
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3].map((star) => (
                <motion.div
                  key={star}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + star * 0.1, type: 'spring' }}
                >
                  <Star
                    size={32}
                    className={star <= score.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
              <div className="text-sm text-[var(--text-secondary)] mb-1">Performance</div>
              <div className="text-2xl font-bold text-green-400">{score.performance.toFixed(0)}</div>
              <div className="text-xs text-[var(--text-secondary)]">/ 50</div>
            </div>

            <div className="card text-center">
              <Zap size={24} className="text-yellow-400 mx-auto mb-2" />
              <div className="text-sm text-[var(--text-secondary)] mb-1">Efficiency</div>
              <div className="text-2xl font-bold text-yellow-400">{score.efficiency.toFixed(0)}</div>
              <div className="text-xs text-[var(--text-secondary)]">/ 30</div>
            </div>

            <div className="card text-center">
              <Clock size={24} className="text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-[var(--text-secondary)] mb-1">Speed</div>
              <div className="text-2xl font-bold text-blue-400">{score.speed.toFixed(0)}</div>
              <div className="text-xs text-[var(--text-secondary)]">/ 20</div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-[var(--text-secondary)]">
            <Clock size={16} />
            <span>Completed in {formatTime(elapsedTime)} ({((elapsedTime / timeLimit) * 100).toFixed(0)}% of time limit)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onReplay}
              className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Play Again
            </button>
            <button
              onClick={() => router.push('/scenarios')}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Next Challenge
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
