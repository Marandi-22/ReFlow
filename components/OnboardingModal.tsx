'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Droplet, Gauge, Target, Sparkles, ArrowRight, X } from 'lucide-react';

export default function OnboardingModal() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('reflow-onboarding-complete');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const steps = [
    {
      icon: Droplet,
      title: 'Welcome to ReFlow',
      description: 'Your industrial wastewater treatment digital twin simulator. Experience real-time SCADA-style monitoring and control.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Gauge,
      title: 'Monitor & Control',
      description: 'Track 8 real-time sensors, adjust PID controllers, and manage equipment. See how your actions affect treatment efficiency.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Master Through Scenarios',
      description: 'Complete interactive challenges to learn plant operations. Start with the tutorial, then unlock more difficult scenarios.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Optimization',
      description: 'Use AI recommendations to optimize energy usage and treatment quality. Learn from intelligent suggestions.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const handleComplete = () => {
    localStorage.setItem('reflow-onboarding-complete', 'true');
    setShowOnboarding(false);
    router.push('/scenarios'); // Direct to tutorial
  };

  const handleSkip = () => {
    localStorage.setItem('reflow-onboarding-complete', 'true');
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          key={currentStep}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Animated gradient header */}
          <div className={`bg-gradient-to-r ${step.color} p-8 text-center relative overflow-hidden`}>
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
              <Icon size={64} className="text-white mx-auto mb-4" />
            </motion.div>

            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-8 bg-blue-500'
                      : idx < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="btn btn-secondary flex-1"
                >
                  Skip
                </button>
              )}

              <button
                onClick={isLastStep ? handleComplete : () => setCurrentStep(currentStep + 1)}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isLastStep ? (
                  <>
                    Start Tutorial
                    <Target size={16} />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Step counter */}
            <div className="text-center mt-4 text-sm text-[var(--text-secondary)]">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
