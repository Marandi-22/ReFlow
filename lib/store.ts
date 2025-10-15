// Zustand store for plant state management

import { create } from 'zustand';
import { PlantState, Event, Alarm } from '@/types';
import { PIDController } from './pid';
import {
  calculateInfluentBOD,
  calculateInfluentTSS,
  simulatePrimaryTreatment,
  simulateSecondaryTreatment,
  simulateTertiaryTreatment,
  simulateDO,
  addSensorNoise,
  calculateTrend,
  updateRuntimeHours,
  createEvent,
  calculateAIRecommendations,
} from './simulator';
import { checkAlarms, clearInactiveAlarms, acknowledgeAlarm } from './alarms';

// PID controller instance
const pidController = new PIDController(15.0, 0.8, 2.0);

// Initial state
const initialState: PlantState = {
  timestamp: Date.now(),
  running: false,

  stages: {
    raw: { volume: 50, BOD: 600, TSS: 400 },
    primary: { volume: 50, BOD: 480, TSS: 240 },
    secondary: { volume: 50, BOD: 72, TSS: 24 },
    tertiary: { volume: 50, BOD: 3.6, TSS: 0.24 },
    treated: { volume: 50, BOD: 2, TSS: 0.1 },
  },

  sensors: {
    DO: { value: 4.0, history: [4.0], alarm: false, trend: 'stable' },
    pH: { value: 7.2, history: [7.2], alarm: false, trend: 'stable' },
    TSS: { value: 24, history: [24], alarm: false, trend: 'stable' },
    BOD: { value: 72, history: [72], alarm: false, trend: 'stable' },
    flow: { value: 50, history: [50], alarm: false, trend: 'stable' },
    TDS: { value: 1200, history: [1200], alarm: false, trend: 'stable' },
    turbidity: { value: 45, history: [45], alarm: false, trend: 'stable' },
    pressure: { value: 5.5, history: [5.5], alarm: false, trend: 'stable' },
  },

  equipment: {
    blower: { speed: 50, running: true, hours: 1234 },
    feedPump: { running: true, hours: 5678 },
    recircPump: { running: true, hours: 3456 },
    dosingPump: { speed: 30, running: true, hours: 2345 },
    bypassValve: { position: 0 },
  },

  control: {
    DO: {
      setpoint: 4.5,
      mode: 'auto',
      PID: {
        P: 15.0,
        I: 0.8,
        D: 2.0,
        error: 0,
        integral: 0,
        derivative: 0,
        lastError: 0,
      },
      output: 50,
    },
  },

  ai: {
    enabled: true,
    recommendedSetpoint: 4.5,
    predictedLoad: 1.0,
    energySavings: 12,
  },

  alarms: [],
  events: [createEvent('info', 'System initialized')],
};

interface PlantStore extends PlantState {
  // Actions
  tick: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  setDOSetpoint: (setpoint: number) => void;
  setDOMode: (mode: 'auto' | 'manual') => void;
  setBlowerSpeed: (speed: number) => void;
  toggleEquipment: (equipment: 'feedPump' | 'recircPump' | 'dosingPump') => void;
  setDosingPumpSpeed: (speed: number) => void;
  setBypassValvePosition: (position: number) => void;
  acknowledgeAlarm: (alarmId: number) => void;
  toggleAI: () => void;
  acceptAIRecommendation: () => void;
  addEvent: (type: Event['type'], message: string) => void;
}

let tickInterval: NodeJS.Timeout | null = null;
let tickCount = 0;

export const usePlantStore = create<PlantStore>((set, get) => ({
  ...initialState,

  startSimulation: () => {
    if (tickInterval) return;

    set({ running: true });
    get().addEvent('info', 'Simulation started');

    tickInterval = setInterval(() => {
      get().tick();
    }, 1000); // 1 tick per second
  },

  stopSimulation: () => {
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
    set({ running: false });
    get().addEvent('info', 'Simulation stopped');
  },

  tick: () => {
    const state = get();
    const dt = 1.0; // 1 second per tick
    tickCount++;

    // Update influent based on time of day
    const influentBOD = calculateInfluentBOD(Date.now());
    const influentTSS = calculateInfluentTSS(influentBOD);

    // Process stages
    const raw = { volume: 50, BOD: influentBOD, TSS: influentTSS };
    const primary = simulatePrimaryTreatment(raw);
    const secondary = simulateSecondaryTreatment(
      state.stages.secondary,
      state.sensors.DO.value,
      dt
    );
    const tertiary = simulateTertiaryTreatment(state.stages.tertiary, dt);
    const treated = { ...tertiary };

    // Update DO with PID control
    let blowerSpeed = state.equipment.blower.speed;

    if (state.control.DO.mode === 'auto' && tickCount % 5 === 0) {
      // Update PID every 5 seconds
      blowerSpeed = pidController.calculate(
        state.control.DO.setpoint,
        state.sensors.DO.value,
        5.0
      );
    }

    const newDO = simulateDO(
      state.sensors.DO.value,
      state.stages.secondary.BOD,
      blowerSpeed,
      dt
    );

    // Calculate other sensor values
    const pH = 7.0 + Math.sin(Date.now() / 60000) * 0.3; // Oscillates around 7.0
    const flow = 50 + Math.sin(Date.now() / 30000) * 10; // Oscillates around 50
    const TDS = 1200 + Math.random() * 100;
    const turbidity = secondary.TSS * 1.8;
    const pressure = 5.0 + (blowerSpeed / 100) * 2.0;

    // Update sensor histories (keep last 300 points = 5 minutes)
    const updateHistory = (history: number[], value: number) => {
      const newHistory = [...history, value];
      return newHistory.slice(-300);
    };

    // Add sensor noise
    const sensors = {
      DO: {
        value: addSensorNoise(newDO, 'DO'),
        history: updateHistory(state.sensors.DO.history, newDO),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.DO.history, newDO)),
      },
      pH: {
        value: addSensorNoise(pH, 'pH'),
        history: updateHistory(state.sensors.pH.history, pH),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.pH.history, pH)),
      },
      TSS: {
        value: addSensorNoise(secondary.TSS, 'TSS'),
        history: updateHistory(state.sensors.TSS.history, secondary.TSS),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.TSS.history, secondary.TSS)),
      },
      BOD: {
        value: addSensorNoise(secondary.BOD, 'BOD'),
        history: updateHistory(state.sensors.BOD.history, secondary.BOD),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.BOD.history, secondary.BOD)),
      },
      flow: {
        value: addSensorNoise(flow, 'flow'),
        history: updateHistory(state.sensors.flow.history, flow),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.flow.history, flow)),
      },
      TDS: {
        value: addSensorNoise(TDS, 'TDS'),
        history: updateHistory(state.sensors.TDS.history, TDS),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.TDS.history, TDS)),
      },
      turbidity: {
        value: addSensorNoise(turbidity, 'turbidity'),
        history: updateHistory(state.sensors.turbidity.history, turbidity),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.turbidity.history, turbidity)),
      },
      pressure: {
        value: addSensorNoise(pressure, 'pressure'),
        history: updateHistory(state.sensors.pressure.history, pressure),
        alarm: false,
        trend: calculateTrend(updateHistory(state.sensors.pressure.history, pressure)),
      },
    };

    // Update equipment runtime hours
    const equipment = {
      blower: {
        ...state.equipment.blower,
        speed: blowerSpeed,
        hours: updateRuntimeHours(state.equipment.blower.hours, state.equipment.blower.running, dt),
      },
      feedPump: {
        ...state.equipment.feedPump,
        hours: updateRuntimeHours(state.equipment.feedPump.hours, state.equipment.feedPump.running, dt),
      },
      recircPump: {
        ...state.equipment.recircPump,
        hours: updateRuntimeHours(state.equipment.recircPump.hours, state.equipment.recircPump.running, dt),
      },
      dosingPump: {
        ...state.equipment.dosingPump,
        hours: updateRuntimeHours(state.equipment.dosingPump.hours, state.equipment.dosingPump.running, dt),
      },
      bypassValve: state.equipment.bypassValve,
    };

    // Update AI recommendations every minute
    let ai = state.ai;
    if (tickCount % 60 === 0 && state.ai.enabled) {
      const aiRec = calculateAIRecommendations(Date.now());
      ai = {
        enabled: true,
        recommendedSetpoint: aiRec.recommendedSetpoint,
        predictedLoad: aiRec.predictedLoad,
        energySavings: aiRec.energySavings,
      };
    }

    // Create new state for alarm checking
    const newState: PlantState = {
      ...state,
      timestamp: Date.now(),
      stages: { raw, primary, secondary, tertiary, treated },
      sensors,
      equipment,
      control: {
        DO: {
          ...state.control.DO,
          PID: pidController.getState(),
          output: blowerSpeed,
        },
      },
      ai,
    };

    // Check for new alarms
    const newAlarms = checkAlarms(newState);
    if (newAlarms.length > 0) {
      newAlarms.forEach(alarm => {
        get().addEvent('alarm', alarm.message);
      });
    }

    // Clear inactive alarms
    const clearedAlarms = clearInactiveAlarms({
      ...newState,
      alarms: [...state.alarms, ...newAlarms],
    });

    // Update events (keep last 50)
    const events = state.events.slice(-50);

    set({
      ...newState,
      alarms: clearedAlarms,
      events,
    });
  },

  setDOSetpoint: (setpoint: number) => {
    set((state) => ({
      control: {
        ...state.control,
        DO: {
          ...state.control.DO,
          setpoint,
        },
      },
    }));
    get().addEvent('control', `DO setpoint changed to ${setpoint.toFixed(1)} mg/L`);
  },

  setDOMode: (mode: 'auto' | 'manual') => {
    set((state) => ({
      control: {
        ...state.control,
        DO: {
          ...state.control.DO,
          mode,
        },
      },
    }));
    get().addEvent('control', `DO control mode: ${mode.toUpperCase()}`);
  },

  setBlowerSpeed: (speed: number) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        blower: {
          ...state.equipment.blower,
          speed,
        },
      },
    }));
    get().addEvent('control', `Blower speed set to ${speed}%`);
  },

  toggleEquipment: (equipment: 'feedPump' | 'recircPump' | 'dosingPump') => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        [equipment]: {
          ...state.equipment[equipment],
          running: !state.equipment[equipment].running,
        },
      },
    }));
    const isRunning = !get().equipment[equipment].running;
    get().addEvent('control', `${equipment} ${isRunning ? 'stopped' : 'started'}`);
  },

  setDosingPumpSpeed: (speed: number) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        dosingPump: {
          ...state.equipment.dosingPump,
          speed,
        },
      },
    }));
  },

  setBypassValvePosition: (position: number) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        bypassValve: {
          position,
        },
      },
    }));
  },

  acknowledgeAlarm: (alarmId: number) => {
    set((state) => ({
      alarms: acknowledgeAlarm(state.alarms, alarmId),
    }));
  },

  toggleAI: () => {
    set((state) => ({
      ai: {
        ...state.ai,
        enabled: !state.ai.enabled,
      },
    }));
    const enabled = !get().ai.enabled;
    get().addEvent('info', `AI optimizer ${enabled ? 'enabled' : 'disabled'}`);
  },

  acceptAIRecommendation: () => {
    const state = get();
    get().setDOSetpoint(state.ai.recommendedSetpoint);
    get().addEvent('control', `AI recommendation accepted: DO setpoint ${state.ai.recommendedSetpoint.toFixed(1)} mg/L`);
  },

  addEvent: (type: Event['type'], message: string) => {
    set((state) => ({
      events: [...state.events, createEvent(type, message)],
    }));
  },
}));
