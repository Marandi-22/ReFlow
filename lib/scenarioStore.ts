// Separate Zustand store for scenario management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScenarioState, ScenarioProgress, ScenarioId } from '@/types/scenarios';
import { getScenario } from './scenarios';

interface ScenarioStore {
  // Current active scenario
  activeScenario: ScenarioState | null;

  // Progress tracking (persisted)
  progress: ScenarioProgress;

  // Actions
  startScenario: (id: ScenarioId) => void;
  endScenario: (score: number) => void;
  updateObjective: (objectiveId: string, current: number) => void;
  completeStep: (stepId: string) => void;
  pauseScenario: () => void;
  resumeScenario: () => void;
  tickScenario: () => void;
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      activeScenario: null,
      progress: {},

      startScenario: (id: ScenarioId) => {
        const definition = getScenario(id);
        if (!definition) return;

        const scenario: ScenarioState = {
          id,
          active: true,
          startTime: Date.now(),
          elapsedTime: 0,
          timeLimit: definition.duration * 60, // Convert minutes to seconds
          objectives: definition.objectives.map(obj => ({
            ...obj,
            current: 0,
            completed: false,
          })),
          steps: definition.steps?.map(step => ({
            ...step,
            completed: false,
          })) || [],
          events: definition.events,
          score: {
            performance: 0,
            efficiency: 0,
            speed: 0,
            total: 0,
            stars: 0,
          },
          completed: false,
          paused: false,
        };

        set({ activeScenario: scenario });

        // Update progress
        set(state => ({
          progress: {
            ...state.progress,
            [id]: {
              ...(state.progress[id] || { bestScore: 0, attempts: 0 }),
              attempts: (state.progress[id]?.attempts || 0) + 1,
              lastPlayed: Date.now(),
              completed: false,
            },
          },
        }));
      },

      endScenario: (score: number) => {
        const scenario = get().activeScenario;
        if (!scenario) return;

        set(state => ({
          activeScenario: { ...scenario, completed: true, active: false },
          progress: {
            ...state.progress,
            [scenario.id]: {
              ...state.progress[scenario.id],
              completed: true,
              bestScore: Math.max(state.progress[scenario.id]?.bestScore || 0, score),
              lastPlayed: Date.now(),
            },
          },
        }));
      },

      updateObjective: (objectiveId: string, current: number) => {
        set(state => {
          if (!state.activeScenario) return state;

          const objectives = state.activeScenario.objectives.map(obj =>
            obj.id === objectiveId
              ? {
                  ...obj,
                  current,
                  completed: current >= obj.target,
                }
              : obj
          );

          return {
            activeScenario: {
              ...state.activeScenario,
              objectives,
            },
          };
        });
      },

      completeStep: (stepId: string) => {
        set(state => {
          if (!state.activeScenario) return state;

          const steps = state.activeScenario.steps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          );

          return {
            activeScenario: {
              ...state.activeScenario,
              steps,
            },
          };
        });
      },

      pauseScenario: () => {
        set(state => {
          if (!state.activeScenario) return state;
          return {
            activeScenario: {
              ...state.activeScenario,
              paused: true,
            },
          };
        });
      },

      resumeScenario: () => {
        set(state => {
          if (!state.activeScenario) return state;
          return {
            activeScenario: {
              ...state.activeScenario,
              paused: false,
            },
          };
        });
      },

      tickScenario: () => {
        set(state => {
          if (!state.activeScenario || state.activeScenario.paused) return state;

          const elapsedTime = Math.floor((Date.now() - state.activeScenario.startTime) / 1000);

          return {
            activeScenario: {
              ...state.activeScenario,
              elapsedTime,
            },
          };
        });
      },
    }),
    {
      name: 'scenario-storage',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
