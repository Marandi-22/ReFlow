// Core data types for the wastewater treatment digital twin

export interface StageData {
  volume: number;
  BOD: number;
  TSS: number;
}

export interface SensorData {
  value: number;
  history: number[];
  alarm: boolean;
  trend: 'up' | 'down' | 'stable';
}

export interface Equipment {
  blower: {
    speed: number;
    running: boolean;
    hours: number;
  };
  feedPump: {
    running: boolean;
    hours: number;
  };
  recircPump: {
    running: boolean;
    hours: number;
  };
  dosingPump: {
    speed: number;
    running: boolean;
    hours: number;
  };
  bypassValve: {
    position: number;
  };
}

export interface PIDState {
  P: number;
  I: number;
  D: number;
  error: number;
  integral: number;
  derivative: number;
  lastError: number;
}

export interface DOControl {
  setpoint: number;
  mode: 'auto' | 'manual';
  PID: PIDState;
  output: number;
}

export interface AIState {
  enabled: boolean;
  recommendedSetpoint: number;
  predictedLoad: number;
  energySavings: number;
}

export type AlarmSeverity = 'info' | 'warning' | 'critical';

export interface Alarm {
  id: number;
  timestamp: number;
  severity: AlarmSeverity;
  message: string;
  acknowledged: boolean;
  cleared: boolean;
}

export type EventType = 'info' | 'warning' | 'alarm' | 'control';

export interface Event {
  timestamp: number;
  type: EventType;
  message: string;
}

export interface PlantState {
  timestamp: number;
  running: boolean;

  // Process stages
  stages: {
    raw: StageData;
    primary: StageData;
    secondary: StageData;
    tertiary: StageData;
    treated: StageData;
  };

  // Sensors (current + history)
  sensors: {
    DO: SensorData;
    pH: SensorData;
    TSS: SensorData;
    BOD: SensorData;
    flow: SensorData;
    TDS: SensorData;
    turbidity: SensorData;
    pressure: SensorData;
  };

  // Equipment
  equipment: Equipment;

  // Control
  control: {
    DO: DOControl;
  };

  // AI
  ai: AIState;

  // Alarms
  alarms: Alarm[];

  // Event log
  events: Event[];
}

export interface SensorThresholds {
  low?: number;
  high?: number;
}

export interface DailyReport {
  timestamp: number;
  avgBODRemoval: number;
  reuseRate: number;
  energyConsumption: number;
  uptime: number;
  warningCount: number;
  criticalCount: number;
}
