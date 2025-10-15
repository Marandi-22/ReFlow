'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Lock, Star, Clock, Target } from 'lucide-react';
import { useScenarioStore } from '@/lib/scenarioStore';
import { getAllScenarios } from '@/lib/scenarios';

export default function ScenariosPage() {
  const { progress } = useScenarioStore();

  const scenarios = getAllScenarios();

  // Determine if scenario is unlocked
  const isUnlocked = (index: number) => {
    if (index === 0) return true; // Tutorial always unlocked

    // Unlock if previous scenario is completed
    const previousScenario = scenarios[index - 1];
    return progress[previousScenario.id]?.completed || false;
  };

  // Calculate average score
  const completedScenarios = Object.values(progress).filter(p => p.completed);
  const avgScore = completedScenarios.length > 0
    ? Math.round(completedScenarios.reduce((sum, p) => sum + p.bestScore, 0) / completedScenarios.length)
    : 0;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Scenarios</h1>
        <p className="text-[var(--text-secondary)]">
          Practice operational challenges and improve your skills
        </p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-blue-500/10 to-purple-500/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Your Progress</h3>
            <p className="text-[var(--text-secondary)]">
              {completedScenarios.length} of {scenarios.length} scenarios completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-400">
              {avgScore}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">Average Score</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(completedScenarios.length / scenarios.length) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, idx) => {
          const scenarioProgress = progress[scenario.id];
          const unlocked = isUnlocked(idx);
          const completed = scenarioProgress?.completed || false;
          const bestScore = scenarioProgress?.bestScore || 0;
          const attempts = scenarioProgress?.attempts || 0;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`card ${!unlocked ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{scenario.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{scenario.description}</p>
                </div>
                {completed && (
                  <CheckCircle2 size={24} className="text-green-400 flex-shrink-0 ml-2" />
                )}
                {!unlocked && (
                  <Lock size={24} className="text-[var(--text-secondary)] flex-shrink-0 ml-2" />
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-[var(--text-secondary)]">Difficulty:</span>
                  <span className="font-semibold">
                    {'⭐'.repeat(scenario.difficulty)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-blue-400" />
                  <span className="text-[var(--text-secondary)]">Duration:</span>
                  <span className="font-semibold">{scenario.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target size={16} className="text-purple-400" />
                  <span className="text-[var(--text-secondary)]">Objective:</span>
                </div>
                <p className="text-sm pl-6">{scenario.objective}</p>
              </div>

              {/* Stats */}
              {unlocked && attempts > 0 && (
                <div className="mb-4 p-3 bg-[var(--bg-primary)] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Best Score</span>
                    <span className="text-2xl font-bold text-green-400">{bestScore}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${bestScore}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Attempts: {attempts}</span>
                    <span className="flex gap-0.5">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= (bestScore >= 95 ? 3 : bestScore >= 80 ? 2 : 1)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Link
                href={!unlocked ? '#' : `/scenarios/${scenario.id}`}
                className={`btn w-full flex items-center justify-center gap-2 ${
                  !unlocked
                    ? 'btn-secondary opacity-50 cursor-not-allowed pointer-events-none'
                    : completed
                    ? 'btn-secondary'
                    : 'btn-primary'
                }`}
              >
                {!unlocked ? (
                  <>
                    <Lock size={16} />
                    Complete Previous Scenario
                  </>
                ) : completed ? (
                  <>
                    <span>⭐</span>
                    Play Again (Best: {bestScore})
                  </>
                ) : (
                  'Start Challenge'
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card bg-blue-500/10"
      >
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span className="text-blue-400">💡</span>
          Pro Tips
        </h3>
        <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
          <li>• Complete the tutorial first to unlock other challenges</li>
          <li>• Each scenario unlocks the next one upon completion</li>
          <li>• Use AI recommendations to optimize your responses</li>
          <li>• Monitor trends closely to anticipate problems</li>
          <li>• Replay scenarios to improve your score and earn 3 stars ⭐⭐⭐</li>
          <li>• Your best score is automatically saved for each scenario</li>
        </ul>
      </motion.div>
    </div>
  );
}
