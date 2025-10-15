// Alarm checking and management

import { PlantState, Alarm, SensorThresholds, AlarmSeverity } from '@/types';

// Sensor alarm thresholds
export const SENSOR_THRESHOLDS: Record<string, SensorThresholds> = {
  DO: { low: 1.5, high: 7.0 },
  pH: { low: 6.5, high: 8.5 },
  TSS: { high: 800 },
  BOD: { high: 850 },
  flow: { low: 10, high: 95 },
  TDS: { high: 1500 },
  turbidity: { high: 80 },
  pressure: { low: 2.0, high: 9.0 },
};

/**
 * Check all sensors for alarm conditions
 * Returns array of new alarms
 */
export function checkAlarms(state: PlantState): Alarm[] {
  const newAlarms: Alarm[] = [];
  const timestamp = Date.now();
  let alarmId = state.alarms.length > 0
    ? Math.max(...state.alarms.map(a => a.id)) + 1
    : 1;

  // Check each sensor
  Object.entries(state.sensors).forEach(([sensorName, sensorData]) => {
    const thresholds = SENSOR_THRESHOLDS[sensorName];
    if (!thresholds) return;

    const { value } = sensorData;
    let alarmMessage = '';
    let severity: AlarmSeverity = 'warning';

    // Check high threshold
    if (thresholds.high !== undefined && value > thresholds.high) {
      alarmMessage = `${sensorName.toUpperCase()} HIGH: ${value.toFixed(2)}`;
      severity = value > thresholds.high * 1.1 ? 'critical' : 'warning';
    }

    // Check low threshold
    if (thresholds.low !== undefined && value < thresholds.low) {
      alarmMessage = `${sensorName.toUpperCase()} LOW: ${value.toFixed(2)}`;
      severity = value < thresholds.low * 0.9 ? 'critical' : 'warning';
    }

    // Create alarm if condition exists
    if (alarmMessage) {
      // Check if this alarm already exists and is not cleared
      const existingAlarm = state.alarms.find(
        a => a.message === alarmMessage && !a.cleared
      );

      if (!existingAlarm) {
        newAlarms.push({
          id: alarmId++,
          timestamp,
          severity,
          message: alarmMessage,
          acknowledged: false,
          cleared: false,
        });
      }
    }
  });

  return newAlarms;
}

/**
 * Clear alarms that are no longer active
 */
export function clearInactiveAlarms(state: PlantState): Alarm[] {
  return state.alarms.map(alarm => {
    if (alarm.cleared) return alarm;

    // Parse alarm message to determine sensor and condition
    const match = alarm.message.match(/^(\w+)\s+(HIGH|LOW):/);
    if (!match) return alarm;

    const [, sensorName, condition] = match;
    const sensor = state.sensors[sensorName as keyof typeof state.sensors];
    if (!sensor) return alarm;

    const thresholds = SENSOR_THRESHOLDS[sensorName];
    if (!thresholds) return alarm;

    // Check if condition has cleared (with hysteresis)
    const { value } = sensor;
    let shouldClear = false;

    if (condition === 'HIGH' && thresholds.high !== undefined) {
      shouldClear = value < thresholds.high * 0.95; // 5% hysteresis
    } else if (condition === 'LOW' && thresholds.low !== undefined) {
      shouldClear = value > thresholds.low * 1.05; // 5% hysteresis
    }

    if (shouldClear) {
      return { ...alarm, cleared: true };
    }

    return alarm;
  });
}

/**
 * Acknowledge an alarm
 */
export function acknowledgeAlarm(alarms: Alarm[], alarmId: number): Alarm[] {
  return alarms.map(alarm =>
    alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
  );
}

/**
 * Get active (not cleared) alarms
 */
export function getActiveAlarms(alarms: Alarm[]): Alarm[] {
  return alarms.filter(alarm => !alarm.cleared);
}

/**
 * Get unacknowledged active alarms
 */
export function getUnacknowledgedAlarms(alarms: Alarm[]): Alarm[] {
  return alarms.filter(alarm => !alarm.cleared && !alarm.acknowledged);
}
