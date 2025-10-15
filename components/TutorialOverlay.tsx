'use client';

import { useState } from 'react';
import { useScenarioStore } from '@/lib/scenarioStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export default function TutorialOverlay() {
  const { activeScenario, completeStep } = useScenarioStore();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!activeScenario || activeScenario.steps.length === 0) return null;

  // Find current step (first incomplete step)
  const currentStepIndex = activeScenario.steps.findIndex(step => !step.completed);
  const currentStep = currentStepIndex >= 0 ? activeScenario.steps[currentStepIndex] : null;
  const completedSteps = activeScenario.steps.filter(s => s.completed).length;
  const totalSteps = activeScenario.steps.length;

  // All steps completed
  if (!currentStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-8 right-8 z-30 w-96 max-w-[calc(100vw-4rem)]"
      >
        <div className="bg-[var(--bg-elevated)]/95 backdrop-blur-lg border border-[var(--accent-blue)]/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-[var(--bg-primary)]">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
            />
          </div>

          {/* Header - Always visible */}
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={20} className="text-yellow-400" />
              <span className="text-sm font-semibold text-[var(--accent-blue)]">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-[var(--text-secondary)]">
                {completedSteps} completed
              </div>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">{/* Step Content */}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{currentStep.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>

                  {/* Checklist Preview */}
                  <div className="space-y-2 mb-6">
                    {activeScenario.steps.slice(0, currentStepIndex + 3).map((step, idx) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 text-sm ${
                          step.completed
                            ? 'text-green-400'
                            : idx === currentStepIndex
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 size={16} className="flex-shrink-0" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            idx === currentStepIndex ? 'border-blue-400' : 'border-gray-600'
                          }`} />
                        )}
                        <span className={idx === currentStepIndex ? 'font-semibold' : ''}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                    {activeScenario.steps.length > currentStepIndex + 3 && (
                      <div className="text-xs text-[var(--text-secondary)] pl-6">
                        +{activeScenario.steps.length - currentStepIndex - 3} more steps...
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => completeStep(currentStep.id)}
                      className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Mark Complete
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* Hint */}
                  {currentStep.highlight && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="text-xs text-blue-400">
                        💡 Look for the highlighted element on the screen
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
