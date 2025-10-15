// Scenario system types

export type ScenarioId = 'tutorial' | 'load-surge' | 'sensor-failure' | 'energy-optimization' | 'emergency-shutdown' | 'multi-fault';

export interface ScenarioObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  highlight?: string; // CSS selector to highlight
  completed: boolean;
  optional?: boolean;
}

export interface ScenarioEvent {
  time: number; // Seconds into scenario
  type: 'inject' | 'message' | 'alarm' | 'check';
  description: string;
  action?: () => void;
}

export interface ScenarioScore {
  performance: number; // 0-50
  efficiency: number;   // 0-30
  speed: number;        // 0-20
  total: number;        // 0-100
  stars: number;        // 1-3
}

export interface ScenarioState {
  id: ScenarioId;
  active: boolean;
  startTime: number;
  elapsedTime: number;
  timeLimit: number; // seconds
  objectives: ScenarioObjective[];
  steps: ScenarioStep[];
  events: ScenarioEvent[];
  score: ScenarioScore;
  completed: boolean;
  paused: boolean;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  description: string;
  difficulty: number;
  duration: number; // minutes
  objective: string;
  objectives: Omit<ScenarioObjective, 'current' | 'completed'>[];
  steps?: Omit<ScenarioStep, 'completed'>[];
  events: ScenarioEvent[];
  initialConditions?: Partial<any>; // Plant state overrides
  successCriteria: (state: any) => boolean;
  scoringRules: (state: any) => Partial<ScenarioScore>;
}

export interface ScenarioProgress {
  [key: string]: {
    completed: boolean;
    bestScore: number;
    attempts: number;
    lastPlayed: number;
  };
}
