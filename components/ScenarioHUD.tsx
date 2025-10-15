'use client';

import { useScenarioStore } from '@/lib/scenarioStore';
import { Clock, Target, Star, CheckCircle2, Circle } from 'lucide-react';

export default function ScenarioHUD() {
  const { activeScenario } = useScenarioStore();

  if (!activeScenario) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeRemaining = Math.max(0, activeScenario.timeLimit - activeScenario.elapsedTime);
  const timePercentage = (activeScenario.elapsedTime / activeScenario.timeLimit) * 100;
  const isTimeWarning = timeRemaining < 60; // Less than 1 minute
  const isTimeCritical = timeRemaining < 30; // Less than 30 seconds

  const completedObjectives = activeScenario.objectives.filter(o => o.completed).length;
  const totalObjectives = activeScenario.objectives.length;

  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] shadow-lg pointer-events-none">
      <div className="pointer-events-auto">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        {/* Top Row: Timer and Score */}
        <div className="flex items-center justify-between mb-4">
          {/* Timer */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isTimeCritical ? 'bg-red-500/20 text-red-400' :
              isTimeWarning ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              <Clock size={20} className={isTimeCritical ? 'animate-pulse' : ''} />
              <span className="font-mono text-xl font-bold">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-sm opacity-75">/ {formatTime(activeScenario.timeLimit)}</span>
            </div>

            {/* Time Progress Bar */}
            <div className="w-32 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  isTimeCritical ? 'bg-red-500' :
                  isTimeWarning ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, timePercentage)}%` }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-[var(--text-secondary)]">Current Score</div>
              <div className="text-3xl font-bold font-mono text-[var(--accent-blue)]">
                {activeScenario.score.total.toFixed(0)}
                <span className="text-lg text-[var(--text-secondary)]">/100</span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= activeScenario.score.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target size={16} />
              Objectives ({completedObjectives}/{totalObjectives})
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Complete all objectives to finish the scenario
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeScenario.objectives.map((objective) => (
              <div
                key={objective.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  objective.completed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-color)]'
                }`}
              >
                {objective.completed ? (
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle size={20} className="text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1">{objective.description}</div>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-mono text-lg font-bold ${
                      objective.completed ? 'text-green-400' : 'text-[var(--accent-blue)]'
                    }`}>
                      {objective.current.toFixed(objective.unit === 'task' ? 0 : 1)}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      / {objective.target} {objective.unit}
                    </span>
                  </div>

                  {/* Progress bar for non-task objectives */}
                  {objective.unit !== 'task' && (
                    <div className="mt-2 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          objective.completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (objective.current / objective.target) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
