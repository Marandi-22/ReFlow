// Core physics simulation engine for wastewater treatment

import { PlantState, StageData, Event } from '@/types';
import { PIDController } from './pid';

/**
 * Calculate influent BOD based on time of day
 * Simulates industrial production patterns
 */
export function calculateInfluentBOD(timestamp: number): number {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const baseBOD = 600;

  let multiplier = 1.0;
  if (hour >= 0 && hour < 6) {
    multiplier = 0.6; // Night shift, low production
  } else if (hour >= 6 && hour < 12) {
    multiplier = 1.2; // Morning peak
  } else if (hour >= 12 && hour < 18) {
    multiplier = 1.4; // Day shift peak
  } else {
    multiplier = 0.8; // Evening cleanup
  }

  // Add random noise ±10%
  const noise = 1.0 + (Math.random() - 0.5) * 0.2;

  return baseBOD * multiplier * noise;
}

/**
 * Calculate influent TSS based on BOD
 */
export function calculateInfluentTSS(BOD: number): number {
  // TSS is typically 60-70% of BOD for industrial wastewater
  return BOD * (0.65 + Math.random() * 0.1);
}

/**
 * Simulate primary treatment (API/DAF)
 * Instant removal of BOD and TSS
 */
export function simulatePrimaryTreatment(raw: StageData): StageData {
  return {
    volume: raw.volume,
    BOD: raw.BOD * 0.8, // 20% removal
    TSS: raw.TSS * 0.6, // 40% removal
  };
}

/**
 * Simulate secondary treatment (MBBR)
 * Exponential decay over time, affected by DO level
 */
export function simulateSecondaryTreatment(
  current: StageData,
  DO: number,
  dt: number
): StageData {
  // Optimal DO is 2-4 mg/L
  const DOefficiency = Math.max(0.5, Math.min(1.0, DO / 3.0));

  // Exponential decay rate (85% removal over 6 hours = rate constant)
  const BODdecayRate = -Math.log(0.15) / (6 * 3600); // per second
  const TSSdecayRate = -Math.log(0.10) / (6 * 3600); // 90% removal

  return {
    volume: current.volume,
    BOD: current.BOD * Math.exp(-BODdecayRate * dt * DOefficiency),
    TSS: current.TSS * Math.exp(-TSSdecayRate * dt * DOefficiency),
  };
}

/**
 * Simulate tertiary treatment (UF+RO)
 * High removal efficiency
 */
export function simulateTertiaryTreatment(
  current: StageData,
  dt: number
): StageData {
  // 95% BOD removal, 99% TSS removal over 2 hours
  const BODdecayRate = -Math.log(0.05) / (2 * 3600);
  const TSSdecayRate = -Math.log(0.01) / (2 * 3600);

  return {
    volume: current.volume,
    BOD: Math.max(0.5, current.BOD * Math.exp(-BODdecayRate * dt)),
    TSS: Math.max(0.1, current.TSS * Math.exp(-TSSdecayRate * dt)),
  };
}

/**
 * Simulate DO dynamics
 * Consumption by microbes, addition by blower, natural decay
 */
export function simulateDO(
  currentDO: number,
  BOD: number,
  blowerSpeed: number,
  dt: number
): number {
  // DO consumption: 0.5 mg/L per 100 mg/L BOD per hour
  const consumption = (BOD / 100) * 0.5 * (dt / 3600);

  // Blower addition: (speed/100) * 2.0 mg/L per hour
  const addition = (blowerSpeed / 100) * 2.0 * (dt / 3600);

  // Natural decay
  const decay = 0.1 * (dt / 3600);

  const newDO = currentDO - consumption + addition - decay;

  // Clamp to physical limits
  return Math.max(0, Math.min(10, newDO));
}

/**
 * Add realistic sensor noise
 */
export function addSensorNoise(value: number, sensor: string): number {
  let noise = 0;

  switch(sensor) {
    case 'DO':
      noise = (Math.random() - 0.5) * 0.4; // ±0.2
      break;
    case 'pH':
      noise = (Math.random() - 0.5) * 0.2; // ±0.1
      break;
    case 'flow':
      noise = (Math.random() - 0.5) * 4.0; // ±2
      break;
    default:
      noise = value * (Math.random() - 0.5) * 0.1; // ±5%
  }

  return value + noise;
}

/**
 * Calculate sensor trend (up, down, stable)
 */
export function calculateTrend(history: number[]): 'up' | 'down' | 'stable' {
  if (history.length < 10) return 'stable';

  const recent = history.slice(-10);
  const avg1 = recent.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
  const avg2 = recent.slice(5, 10).reduce((a, b) => a + b, 0) / 5;

  const change = (avg2 - avg1) / avg1;

  if (change > 0.02) return 'up';
  if (change < -0.02) return 'down';
  return 'stable';
}

/**
 * Update equipment runtime hours
 */
export function updateRuntimeHours(
  currentHours: number,
  running: boolean,
  dt: number
): number {
  if (!running) return currentHours;
  return currentHours + (dt / 3600); // Convert seconds to hours
}

/**
 * Create event log entry
 */
export function createEvent(
  type: 'info' | 'warning' | 'alarm' | 'control',
  message: string
): Event {
  return {
    timestamp: Date.now(),
    type,
    message,
  };
}

/**
 * Format timestamp for display
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Calculate time-of-day AI recommendations
 */
export function calculateAIRecommendations(timestamp: number) {
  const date = new Date(timestamp);
  const hour = date.getHours();

  let predictedLoad = 1.0;
  let recommendedSetpoint = 4.0;
  let energySavings = 0;

  // Predict load increase in next 2 hours
  const futureHour = (hour + 2) % 24;
  if (futureHour >= 6 && futureHour < 12) {
    predictedLoad = 1.15; // Morning peak incoming
    recommendedSetpoint = 4.8;
    energySavings = 8;
  } else if (futureHour >= 12 && futureHour < 18) {
    predictedLoad = 1.20; // Day shift peak
    recommendedSetpoint = 5.0;
    energySavings = 10;
  } else if (futureHour >= 0 && futureHour < 6) {
    predictedLoad = 0.85; // Night shift low
    recommendedSetpoint = 3.5;
    energySavings = 15;
  } else {
    predictedLoad = 0.95;
    recommendedSetpoint = 4.2;
    energySavings = 12;
  }

  return {
    predictedLoad,
    recommendedSetpoint,
    energySavings,
  };
}
