# Phase 2: Scenario System - Progress Report

## ✅ Completed

### 1. Scenario Type System (`types/scenarios.ts`)
- ✅ `ScenarioObjective` - Track individual goals (e.g., "Keep BOD < 30mg/L")
- ✅ `ScenarioStep` - Tutorial steps with highlights and completion
- ✅ `ScenarioEvent` - Timed events (load surge at t=60s, etc.)
- ✅ `ScenarioScore` - Performance/Efficiency/Speed breakdown (0-100)
- ✅ `ScenarioState` - Active scenario runtime state
- ✅ `ScenarioDefinition` - Scenario configuration/rules
- ✅ `ScenarioProgress` - Historical data (best scores, attempts)

### 2. Scenario Definitions (`lib/scenarios.ts`)
Complete definitions for all 6 scenarios:

**✅ Tutorial: Normal Operation**
- 6 guided steps
- Teaches: Start sim, observe sensors, adjust setpoint, use AI, handle alarms
- Scoring: Based on step completion

**✅ Challenge 1: Load Surge**
- Event at t=60s: BOD increases to 950 mg/L
- Objective: Keep outlet BOD < 30mg/L for 10 minutes
- Scoring: Compliance (50pts) + Energy (30pts) + Speed (20pts)

**✅ Challenge 2: Sensor Failure**
- Event at t=120s: DO sensor fails
- Objective: Continue operation using other sensors
- Scoring: Task completion based

**✅ Challenge 3: Energy Optimization**
- Goal: Achieve < 1.5 kWh/m³ while BOD < 20mg/L
- Duration: 30 minutes
- Scoring: Energy savings + compliance

**✅ Challenge 4: Emergency Shutdown**
- Event at t=10s: Pump trip
- Objective: Execute correct shutdown procedure
- Scoring: Binary (all steps correct = 100)

**✅ Challenge 5: Multi-fault Chaos**
- Multiple failures: Sensor (t=60s), Pump (t=180s), Load (t=300s)
- Objective: Handle all and restore operations
- Scoring: Based on objectives completed

### 3. Scenario Store (`lib/scenarioStore.ts`)
- ✅ Zustand store with localStorage persistence
- ✅ Actions: start, end, pause, resume, tick
- ✅ Objective tracking with progress updates
- ✅ Step completion tracking
- ✅ Score calculation and best score tracking
- ✅ Unlock progression (based on completion)

### 4. Updated Scenarios Page (`app/scenarios/page.tsx`)
- ✅ Progress overview card
- ✅ Scenario cards with metadata
- ✅ Lock system (visual indicators)
- ✅ Completion status and scores
- ✅ Star ratings display (⭐⭐⭐)

## 🚧 In Progress / Next Steps

### 5. Scenario Execution Page (`app/scenarios/[id]/page.tsx`)
Currently shows placeholder. Needs:
- [ ] Scenario HUD with objectives and timer
- [ ] Live objective tracking
- [ ] Step-by-step guidance (for tutorial)
- [ ] Event injection system
- [ ] Real-time scoring display
- [ ] End scenario results screen

### 6. Integration with Control Room
- [ ] Scenario mode indicator
- [ ] Highlighted elements for tutorial steps
- [ ] Scenario-specific overlays
- [ ] Event notifications

### 7. Scoring Engine
- [ ] Implement `scoringRules` execution
- [ ] Real-time score calculation
- [ ] Performance metrics tracking
- [ ] Results breakdown visualization

### 8. Tutorial Guidance System
- [ ] Step highlighting (CSS selectors)
- [ ] Tooltip arrows ("Click here")
- [ ] Progress checklist
- [ ] Auto-advance on completion

### 9. Load Surge Implementation
- [ ] BOD injection at t=60s
- [ ] Performance monitoring
- [ ] Compliance checking
- [ ] Energy usage calculation

## 📊 Data Flow

```
User clicks "Start Challenge"
    ↓
scenarioStore.startScenario(id)
    ↓
Create ScenarioState
    - Initialize objectives
    - Set timer
    - Load events
    ↓
Navigate to /scenarios/[id]
    ↓
Scenario Page Components:
    - HUD (timer, objectives)
    - Control Room (embedded)
    - Guidance overlays
    ↓
Every tick:
    - Update elapsed time
    - Check objectives
    - Trigger events
    - Calculate score
    ↓
On completion:
    - Show results
    - Save best score
    - Unlock next scenario
```

## 🎯 Next Development Priorities

### Priority 1: Tutorial Scenario (Guided Experience)
1. Create `ScenarioHUD` component (timer + objectives)
2. Create `TutorialOverlay` component (step guidance)
3. Update Control Room to accept scenario mode
4. Implement step completion detection
5. Add "Next" / "Complete" buttons

### Priority 2: Load Surge Scenario (First Real Challenge)
1. Implement event injection (BOD increase at t=60s)
2. Add objective monitoring (BOD threshold)
3. Create compliance tracker
4. Implement scoring calculation
5. Build results screen

### Priority 3: Score Persistence & Unlocks
1. Connect scenarioStore to scenarios page
2. Show actual progress from localStorage
3. Implement unlock logic
4. Display star ratings
5. Add "Replay" functionality

## 💡 Technical Notes

**Scenario State Management:**
- Separate store (`scenarioStore`) from plant store for clean separation
- Persists to localStorage (progress, scores, unlock status)
- Active scenario state is runtime-only

**Event System:**
- Events defined with time offsets (t=60s, t=120s)
- Types: inject (modify plant state), message (show notification), check (validation)
- Processed by scenario tick loop

**Scoring:**
- Three components: Performance (0-50), Efficiency (0-30), Speed (0-20)
- Stars: ⭐ (60+), ⭐⭐ (80+), ⭐⭐⭐ (95+)
- Custom rules per scenario

**Tutorial System:**
- Steps have optional `highlight` selector
- Completion detected by user actions
- Progress saved to allow resume

## 📝 Files Created This Phase

```
types/scenarios.ts              # Type definitions
lib/scenarios.ts                # Scenario definitions (6 scenarios)
lib/scenarioStore.ts            # State management + persistence
app/scenarios/[id]/page.tsx     # Scenario execution page (placeholder)
PHASE2_PROGRESS.md              # This file
```

## 🚀 How to Test Current Progress

1. Navigate to http://localhost:3001
2. Click "Launch Simulator" → Dashboard
3. Click "Run Scenario" or navigate to Scenarios page
4. See 6 scenarios with details
5. Click "Start Challenge" on Tutorial → Shows placeholder
6. Note: Actual scenario execution coming next!

## 🎮 Demo-Ready Features

- ✅ Scenarios page looks professional
- ✅ All 6 scenarios defined and displayed
- ✅ Lock/unlock system visual design
- ✅ Score tracking architecture in place
- ⏳ Execution page needs implementation (Priority 1)

---

**Status:** Phase 2 foundation complete. Ready to build execution pages!
