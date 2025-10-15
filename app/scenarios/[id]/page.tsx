'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScenarioStore } from '@/lib/scenarioStore';
import { usePlantStore } from '@/lib/store';
import { getScenario } from '@/lib/scenarios';
import { ArrowLeft, Play, Pause, X } from 'lucide-react';
import TutorialOverlay from '@/components/TutorialOverlay';
import ScenarioResults from '@/components/ScenarioResults';
import { motion } from 'framer-motion';

// Import control room components
import ProcessFlow from '@/components/ProcessFlow';
import SensorCard from '@/components/SensorCard';
import ControlPanel from '@/components/ControlPanel';
import TrendChart from '@/components/TrendChart';
import AIInsights from '@/components/AIInsights';
import EventLog from '@/components/EventLog';

export default function ScenarioExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    activeScenario,
    progress,
    startScenario,
    endScenario,
    pauseScenario,
    resumeScenario,
    tickScenario,
    completeStep,
    updateObjective,
  } = useScenarioStore();

  const {
    running,
    startSimulation,
    stopSimulation,
    sensors,
    stages,
    control,
    events,
  } = usePlantStore();

  const [showResults, setShowResults] = useState(false);
  const [scenarioStarted, setScenarioStarted] = useState(false);

  const scenarioDefinition = getScenario(params.id as any);

  // Initialize scenario
  useEffect(() => {
    if (!scenarioStarted && scenarioDefinition) {
      startScenario(params.id as any);
      startSimulation();
      setScenarioStarted(true);
    }

    return () => {
      // Cleanup when leaving page
      if (!showResults) {
        stopSimulation();
      }
    };
  }, [params.id, scenarioDefinition, scenarioStarted]);

  // Scenario tick loop
  useEffect(() => {
    if (!activeScenario || activeScenario.paused || activeScenario.completed) return;

    const interval = setInterval(() => {
      tickScenario();

      // Check if time limit exceeded
      if (activeScenario.elapsedTime >= activeScenario.timeLimit) {
        handleScenarioEnd();
      }

      // Auto-complete objectives based on plant state
      if (params.id === 'tutorial') {
        checkTutorialObjectives();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeScenario, params.id]);

  // Tutorial-specific objective checking
  const checkTutorialObjectives = () => {
    if (!activeScenario) return;

    // Check if simulation is started
    if (running && activeScenario.objectives[0] && !activeScenario.objectives[0].completed) {
      updateObjective('start', 1);
      completeStep('start-sim');
    }

    // Check if DO setpoint was changed
    if (control.DO.setpoint === 5.0 && activeScenario.objectives[2] && !activeScenario.objectives[2].completed) {
      updateObjective('setpoint', 5.0);
      completeStep('change-setpoint');
    }
  };

  const handleScenarioEnd = () => {
    if (!activeScenario || !scenarioDefinition) return;

    // Calculate final score
    const finalScore = scenarioDefinition.scoringRules({ ...usePlantStore.getState(), scenario: activeScenario });

    const score = {
      performance: finalScore.performance || 0,
      efficiency: finalScore.efficiency || 0,
      speed: finalScore.speed || 0,
      total: finalScore.total || 0,
      stars: finalScore.stars || 0,
    };

    endScenario(score.total);
    setShowResults(true);
    stopSimulation();
  };

  const handleReplay = () => {
    setShowResults(false);
    setScenarioStarted(false);
    router.refresh();
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      stopSimulation();
      router.push('/scenarios');
    }
  };

  if (!scenarioDefinition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Scenario Not Found</h1>
          <button onClick={() => router.push('/scenarios')} className="btn btn-primary">
            Back to Scenarios
          </button>
        </div>
      </div>
    );
  }

  // Show results screen
  if (showResults && activeScenario) {
    const previousBest = progress[params.id]?.bestScore || 0;
    const isNewBest = activeScenario.score.total > previousBest;

    return (
      <ScenarioResults
        scenarioTitle={scenarioDefinition.title}
        score={activeScenario.score}
        elapsedTime={activeScenario.elapsedTime}
        timeLimit={activeScenario.timeLimit}
        isNewBest={isNewBest}
        onReplay={handleReplay}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Tutorial Overlay */}
      {params.id === 'tutorial' && <TutorialOverlay />}

      {/* Control Panel Area */}
      <div className="pt-6 p-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="btn btn-secondary flex items-center gap-2"
          >
            <X size={16} />
            Exit Scenario
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={activeScenario?.paused ? resumeScenario : pauseScenario}
              className="btn btn-secondary flex items-center gap-2"
            >
              {activeScenario?.paused ? (
                <>
                  <Play size={16} />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={16} />
                  Pause
                </>
              )}
            </button>

            {/* Manual complete for testing */}
            {params.id === 'tutorial' && (
              <button
                onClick={handleScenarioEnd}
                className="btn btn-primary"
              >
                Complete Scenario
              </button>
            )}
          </div>
        </div>

        {/* Simplified Control Room View */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Process Flow */}
          <div className="col-span-3">
            <ProcessFlow />
          </div>

          {/* Middle: Sensors + Charts */}
          <div className="col-span-6 space-y-6">
            {/* Sensor Grid */}
            <div className="grid grid-cols-4 gap-3">
              <SensorCard name="DO" value={sensors.DO.value} unit="mg/L" data={sensors.DO} decimals={2} />
              <SensorCard name="pH" value={sensors.pH.value} unit="" data={sensors.pH} decimals={2} />
              <SensorCard name="TSS" value={sensors.TSS.value} unit="mg/L" data={sensors.TSS} decimals={1} />
              <SensorCard name="BOD" value={sensors.BOD.value} unit="mg/L" data={sensors.BOD} decimals={1} />
            </div>

            {/* Mini Trends */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Right: Controls */}
          <div className="col-span-3 space-y-4">
            <div data-control="do-setpoint">
              <ControlPanel />
            </div>
            <div data-action="accept-ai">
              <AIInsights />
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="mt-6 h-48">
          <EventLog />
        </div>
      </div>
    </div>
  );
}
