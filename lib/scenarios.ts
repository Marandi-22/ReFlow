// Scenario definitions and engine

import { ScenarioDefinition, ScenarioId } from '@/types/scenarios';

export const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  tutorial: {
    id: 'tutorial',
    title: 'Tutorial: Normal Operation',
    description: 'Learn the basics of plant operation in a guided walkthrough',
    difficulty: 1,
    duration: 10,
    objective: 'Complete all tutorial steps',
    objectives: [
      { id: 'start', description: 'Start the simulation', target: 1, unit: 'task' },
      { id: 'observe', description: 'Observe DO level for 30 seconds', target: 30, unit: 'sec' },
      { id: 'setpoint', description: 'Change DO setpoint to 5.0', target: 5.0, unit: 'mg/L' },
      { id: 'stabilize', description: 'Wait for DO to stabilize', target: 1, unit: 'task' },
      { id: 'ai', description: 'Accept AI recommendation', target: 1, unit: 'task' },
      { id: 'alarm', description: 'Acknowledge an alarm', target: 1, unit: 'task' },
    ],
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to ReFlow',
        description: 'This tutorial will guide you through the basic operations of the wastewater treatment plant.',
        optional: false,
      },
      {
        id: 'start-sim',
        title: 'Start Simulation',
        description: 'Click the START button in the top right to begin the simulation.',
        highlight: '[data-action="start-simulation"]',
        optional: false,
      },
      {
        id: 'observe-sensors',
        title: 'Observe Sensors',
        description: 'Watch the DO (Dissolved Oxygen) sensor for 30 seconds. Notice how the value changes over time.',
        optional: false,
      },
      {
        id: 'change-setpoint',
        title: 'Adjust DO Setpoint',
        description: 'In the Control panel, change the DO setpoint to 5.0 mg/L. Watch how the PID controller responds.',
        highlight: '[data-control="do-setpoint"]',
        optional: false,
      },
      {
        id: 'watch-stabilize',
        title: 'Watch Stabilization',
        description: 'Observe how the blower speed adjusts and DO gradually reaches the new setpoint.',
        optional: false,
      },
      {
        id: 'use-ai',
        title: 'Use AI Optimizer',
        description: 'Go to the AI Insights tab and click ACCEPT to apply the AI recommendation.',
        highlight: '[data-action="accept-ai"]',
        optional: false,
      },
      {
        id: 'handle-alarm',
        title: 'Handle Alarms',
        description: 'When an alarm appears, click ACKNOWLEDGE to silence it.',
        optional: false,
      },
    ],
    events: [],
    successCriteria: (state) => {
      return state.scenario?.steps?.every((s: any) => s.completed) || false;
    },
    scoringRules: (state) => {
      const steps = state.scenario?.steps || [];
      const completed = steps.filter((s: any) => s.completed).length;
      const total = steps.length;
      const performance = (completed / total) * 50;

      return {
        performance,
        efficiency: 30, // Full marks for tutorial
        speed: 20, // Full marks for tutorial
        total: performance + 50,
        stars: performance > 45 ? 3 : performance > 35 ? 2 : 1,
      };
    },
  },

  'load-surge': {
    id: 'load-surge',
    title: 'Challenge 1: Load Surge',
    description: 'Handle a sudden 50% increase in influent BOD from factory discharge',
    difficulty: 2,
    duration: 15,
    objective: 'Maintain outlet BOD < 30mg/L for 10 minutes',
    objectives: [
      { id: 'bod-compliance', description: 'Keep outlet BOD < 30 mg/L', target: 30, unit: 'mg/L' },
      { id: 'time-duration', description: 'Maintain for 10 minutes', target: 600, unit: 'sec' },
      { id: 'energy-efficiency', description: 'Energy < 2.5 kWh/m³', target: 2.5, unit: 'kWh/m³' },
    ],
    events: [
      {
        time: 60,
        type: 'inject',
        description: 'Factory discharge detected! Influent BOD increasing to 950 mg/L',
      },
      {
        time: 120,
        type: 'message',
        description: 'AI recommends increasing DO setpoint to 5.2 mg/L',
      },
      {
        time: 300,
        type: 'check',
        description: 'Midpoint check: Are you maintaining compliance?',
      },
    ],
    initialConditions: {
      sensors: {
        DO: { value: 4.5 },
      },
    },
    successCriteria: (state) => {
      // Check if BOD was kept below 30 for required duration
      return state.scenario?.objectives?.[0]?.completed || false;
    },
    scoringRules: (state) => {
      const bodCompliance = state.scenario?.objectives?.[0]?.completed ? 40 : 0;
      const timeCompliance = state.scenario?.objectives?.[1]?.completed ? 10 : 0;
      const energyScore = state.scenario?.objectives?.[2]?.completed ? 30 : 15;
      const speedBonus = Math.max(0, 20 - (state.scenario?.elapsedTime || 0) / 30);

      const total = bodCompliance + timeCompliance + energyScore + speedBonus;

      return {
        performance: bodCompliance + timeCompliance,
        efficiency: energyScore,
        speed: speedBonus,
        total,
        stars: total >= 90 ? 3 : total >= 70 ? 2 : 1,
      };
    },
  },

  'sensor-failure': {
    id: 'sensor-failure',
    title: 'Challenge 2: Sensor Failure Recovery',
    description: 'Continue operations when the DO sensor fails unexpectedly',
    difficulty: 3,
    duration: 20,
    objective: 'Maintain treatment quality without DO sensor',
    objectives: [
      { id: 'detect-failure', description: 'Recognize sensor failure', target: 1, unit: 'task' },
      { id: 'switch-manual', description: 'Switch to manual control', target: 1, unit: 'task' },
      { id: 'maintain-quality', description: 'Keep BOD < 50 mg/L', target: 50, unit: 'mg/L' },
    ],
    events: [
      {
        time: 120,
        type: 'inject',
        description: 'DO sensor failed! Showing "--" value',
      },
      {
        time: 180,
        type: 'message',
        description: 'Hint: Use pH and BOD trends to estimate DO needs',
      },
    ],
    successCriteria: (state) => {
      return state.scenario?.objectives?.every((o: any) => o.completed) || false;
    },
    scoringRules: (state) => {
      const objectives = state.scenario?.objectives || [];
      const completed = objectives.filter((o: any) => o.completed).length;

      return {
        performance: (completed / objectives.length) * 50,
        efficiency: 30,
        speed: 20,
        total: ((completed / objectives.length) * 100),
        stars: completed === objectives.length ? 3 : completed >= 2 ? 2 : 1,
      };
    },
  },

  'energy-optimization': {
    id: 'energy-optimization',
    title: 'Challenge 3: Energy Optimization',
    description: 'Minimize energy consumption while maintaining treatment standards',
    difficulty: 2,
    duration: 30,
    objective: 'Achieve < 1.5 kWh/m³ with BOD < 20mg/L',
    objectives: [
      { id: 'energy', description: 'Energy < 1.5 kWh/m³', target: 1.5, unit: 'kWh/m³' },
      { id: 'bod', description: 'BOD < 20 mg/L', target: 20, unit: 'mg/L' },
      { id: 'duration', description: 'Maintain for 20 minutes', target: 1200, unit: 'sec' },
    ],
    events: [],
    successCriteria: (state) => {
      return state.scenario?.objectives?.every((o: any) => o.completed) || false;
    },
    scoringRules: (state) => {
      const energySaved = Math.max(0, (1.8 - 1.5) / 1.8 * 50);
      const bodCompliance = state.stages?.treated?.BOD < 20 ? 30 : 0;

      return {
        performance: bodCompliance,
        efficiency: energySaved,
        speed: 20,
        total: energySaved + bodCompliance + 20,
        stars: energySaved + bodCompliance > 70 ? 3 : energySaved + bodCompliance > 50 ? 2 : 1,
      };
    },
  },

  'emergency-shutdown': {
    id: 'emergency-shutdown',
    title: 'Challenge 4: Emergency Shutdown',
    description: 'Execute safe shutdown procedure after pump trip',
    difficulty: 3,
    duration: 10,
    objective: 'Complete all shutdown steps correctly',
    objectives: [
      { id: 'stop-feed', description: 'Stop feed pump', target: 1, unit: 'task' },
      { id: 'maintain-aeration', description: 'Maintain aeration', target: 1, unit: 'task' },
      { id: 'activate-bypass', description: 'Activate bypass valve', target: 1, unit: 'task' },
    ],
    events: [
      {
        time: 10,
        type: 'inject',
        description: 'ALARM: Recirculation pump tripped!',
      },
    ],
    successCriteria: (state) => {
      return state.scenario?.objectives?.every((o: any) => o.completed) || false;
    },
    scoringRules: (state) => {
      const correctSteps = state.scenario?.objectives?.filter((o: any) => o.completed).length || 0;
      const total = correctSteps === 3 ? 100 : correctSteps * 30;

      return {
        performance: correctSteps * 20,
        efficiency: 30,
        speed: correctSteps === 3 ? 20 : 0,
        total,
        stars: total === 100 ? 3 : total >= 60 ? 2 : 1,
      };
    },
  },

  'multi-fault': {
    id: 'multi-fault',
    title: 'Challenge 5: Multi-fault Chaos',
    description: 'Handle multiple simultaneous failures in hard mode',
    difficulty: 5,
    duration: 45,
    objective: 'Survive all failures and restore normal operation',
    objectives: [
      { id: 'handle-sensor', description: 'Handle sensor failure', target: 1, unit: 'task' },
      { id: 'handle-pump', description: 'Handle pump trip', target: 1, unit: 'task' },
      { id: 'handle-surge', description: 'Handle load surge', target: 1, unit: 'task' },
      { id: 'restore', description: 'Restore normal operation', target: 1, unit: 'task' },
    ],
    events: [
      {
        time: 60,
        type: 'inject',
        description: 'DO sensor failure!',
      },
      {
        time: 180,
        type: 'inject',
        description: 'Dosing pump trip!',
      },
      {
        time: 300,
        type: 'inject',
        description: 'Massive load surge!',
      },
    ],
    successCriteria: (state) => {
      return state.scenario?.objectives?.every((o: any) => o.completed) || false;
    },
    scoringRules: (state) => {
      const completed = state.scenario?.objectives?.filter((o: any) => o.completed).length || 0;
      const total = (completed / 4) * 100;

      return {
        performance: (completed / 4) * 50,
        efficiency: 30,
        speed: 20,
        total,
        stars: total >= 95 ? 3 : total >= 75 ? 2 : 1,
      };
    },
  },
};

export function getScenario(id: ScenarioId): ScenarioDefinition | undefined {
  return SCENARIOS[id];
}

export function getAllScenarios(): ScenarioDefinition[] {
  return Object.values(SCENARIOS);
}
