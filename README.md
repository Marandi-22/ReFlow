# ReFlow - Professional Industrial Wastewater Treatment Digital Twin

A professional-grade SCADA-style digital twin simulator for industrial wastewater treatment plants. Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## 🎯 What Makes This Different

ReFlow is designed to feel like **$100K industrial software** (like Wonderware/Ignition SCADA) meets modern SaaS UX (like Grafana/Datadog). It's not just a simulator - it's an interactive learning platform with:

- ✨ **Multi-page application** with professional navigation
- 🎮 **Interactive scenario-based learning** (gamified challenges)
- 📊 **Real-time SCADA-style monitoring** with tabbed interface
- 🤖 **AI-powered optimization** recommendations
- 📈 **Professional reporting** with CSV/PDF export
- 🎨 **Modern industrial design system** (deep navy theme)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the welcome screen.

## 📱 Application Structure

### 1. Welcome Page (`/`)
- Animated splash screen with ReFlow logo
- Quick stats display (2.4M liters treated, 94.2% BOD removal, 82% reuse rate)
- "Launch Simulator" button
- Modern glassmorphism design

### 2. Dashboard (`/dashboard`)
**Main Hub - Your Command Center**

- **4 Live KPI Cards:**
  - Water Reuse Rate: 82% ↑
  - Energy Efficiency: 1.8 kWh/m³ ↓
  - BOD Removal: 94.2% →
  - Active Alarms: Count ⚠

- **Quick Actions:**
  - Enter Control Room (main simulator)
  - Run Scenario (practice challenges)
  - View Reports (performance data)
  - Export Data (CSV/PDF)

- **Plant Status & Recent Events**

### 3. Control Room (`/control-room`)
**The Actual Simulator - SCADA Interface**

**5 Tabs:**

**Tab 1: Overview**
- Process flow diagram (5-stage vertical)
- Key sensors (DO, pH, TSS, BOD)
- Mini trend charts
- Control panel and event log

**Tab 2: Sensors**
- All 8 sensors in detailed grid
- DO, pH, TSS, BOD, Flow, TDS, Turbidity, Pressure
- Each with sparkline, trend arrow, status LED

**Tab 3: Control**
- DO PID control panel
- Equipment controls (blowers, pumps, valves)
- Manual/Auto mode switching
- Real-time parameter adjustment

**Tab 4: Trends**
- 6 historical charts (last 5 minutes)
- Scrolling real-time data
- DO, pH, TSS, BOD, Flow, Pressure

**Tab 5: AI Insights**
- AI optimizer recommendations
- Predicted load changes
- Energy savings estimates
- Accept/Override controls

### 4. Scenarios (`/scenarios`)
**Interactive Challenge System**

**Available Scenarios:**

1. **Tutorial: Normal Operation** (⭐)
   - Learn basics in guided walkthrough
   - Duration: 10 minutes
   - Status: ✓ Completed (Score: 95)

2. **Challenge 1: Load Surge** (⭐⭐)
   - Handle 50% BOD increase from factory discharge
   - Objective: Maintain BOD < 30mg/L for 10 minutes
   - Duration: 15 minutes

3. **Challenge 2: Sensor Failure Recovery** (⭐⭐⭐)
   - Continue operations when DO sensor fails
   - Objective: Maintain treatment quality without DO
   - Duration: 20 minutes
   - Status: 🔒 Locked (complete previous challenges)

4. **Challenge 3: Energy Optimization** (⭐⭐)
   - Minimize energy while maintaining standards
   - Objective: Achieve < 1.5 kWh/m³ with BOD < 20mg/L
   - Duration: 30 minutes
   - Status: 🔒 Locked

5. **Challenge 4: Emergency Shutdown** (⭐⭐⭐)
   - Execute safe shutdown after pump trip
   - Objective: Complete all steps correctly
   - Duration: 10 minutes
   - Status: 🔒 Locked

6. **Challenge 5: Multi-fault Chaos** (⭐⭐⭐⭐⭐)
   - Handle multiple simultaneous failures
   - Objective: Survive and restore normal operation
   - Duration: 45 minutes
   - Status: 🔒 Locked

**Features:**
- Progress tracking with scores
- Star ratings (⭐-⭐⭐⭐⭐)
- Unlock system (complete to unlock next)
- Replay to improve scores

### 5. Reports (`/reports`)
**Performance Analytics & Data Export**

- Daily summary with key metrics
- Current readings table
- **CSV Export:**
  - Timestamp, BOD, TSS, DO, pH, Flow
  - Downloads as `reflow_report_YYYY-MM-DD.csv`
- **PDF Export:** (Coming soon)

### 6. Settings (`/settings`)
**Configuration & Preferences**

**Tabs:**
- **Plant Config:** Name, flow rate, simulation speed
- **Control Parameters:** PID tuning (Kp, Ki, Kd), DO setpoint
- **AI Settings:** Enable/disable optimizer
- **Display:** Theme, units, refresh rate

## 🎨 Design System

### Color Palette (Industrial + Modern)
```css
Background: #0a0e27 (deep navy)
Surface: #1a1f3a (cards)
Elevated: #252b4a (hover)
Border: #2d3548
Text Primary: #e8eaed
Text Secondary: #9aa0b8
Accent Blue: #3b82f6
Success: #10b981
Warning: #f59e0b
Danger: #ef4444
AI Purple: #8b5cf6
```

### Typography
- **Headings:** Inter (semibold)
- **Body:** Inter (regular)
- **Numbers:** JetBrains Mono (monospace, tabular)

### Components
- All cards: `rounded-xl` (12px radius)
- Buttons: `rounded-lg` (8px), hover scale 1.02
- LED indicators: Pulse glow animations
- Smooth transitions: 200ms

## 🔧 Technical Architecture

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **State:** Zustand
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Icons:** Lucide React

### File Structure
```
reflow/
├── app/
│   ├── page.tsx                    # Welcome page
│   ├── dashboard/
│   │   ├── layout.tsx              # Shared layout with sidebar
│   │   └── page.tsx                # Dashboard hub
│   ├── control-room/
│   │   └── page.tsx                # Main simulator (5 tabs)
│   ├── scenarios/
│   │   ├── page.tsx                # Scenario list
│   │   └── [id]/page.tsx           # Individual scenario
│   ├── reports/
│   │   └── page.tsx                # Reports & export
│   ├── settings/
│   │   └── page.tsx                # Configuration
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Design system styles
├── components/
│   ├── Sidebar.tsx                 # Navigation sidebar
│   ├── ProcessFlow.tsx             # Vertical flow diagram
│   ├── SensorCard.tsx              # Sensor display
│   ├── ControlPanel.tsx            # DO PID control
│   ├── EquipmentPanel.tsx          # Equipment controls
│   ├── TrendChart.tsx              # Recharts wrapper
│   ├── AIInsights.tsx              # AI optimizer
│   ├── EventLog.tsx                # Event feed
│   ├── StatusBar.tsx               # Top status bar
│   └── AlarmBanner.tsx             # Alarm notifications
├── lib/
│   ├── simulator.ts                # Physics engine
│   ├── pid.ts                      # PID controller
│   ├── alarms.ts                   # Alarm logic
│   └── store.ts                    # Zustand state
└── types/
    └── index.ts                    # TypeScript interfaces
```

### State Management
- **Zustand store** manages entire plant state
- Simulation runs at 1 tick/second
- 300 data points stored per sensor (5 minutes @ 1Hz)
- Auto-starts on dashboard entry
- Persists across page navigation

### Physics Simulation

**Treatment Process:**
1. **Raw Influent:** Time-varying BOD (600 base, 0.6x-1.4x multiplier)
2. **Primary (API/DAF):** 20% BOD, 40% TSS removal (instant)
3. **Secondary (MBBR):** 85% BOD, 90% TSS removal (6hr exponential decay, DO-dependent)
4. **Tertiary (UF+RO):** 95% BOD, 99% TSS removal (2hr exponential)
5. **Treated Output:** < 5 mg/L BOD typical

**DO Dynamics:**
- Consumption: 0.5 mg/L per 100mg/L BOD per hour
- Blower addition: (speed/100) × 2.0 mg/L/hr
- Natural decay: 0.1 mg/L/hr

**PID Control:**
- Kp = 15.0, Ki = 0.8, Kd = 2.0
- Anti-windup: Integral clamped at ±50
- Update frequency: Every 5 simulation ticks
- Response time: 2-3 minutes to stabilize

## 🎯 Key Features

### Real-time Simulation
- 8 sensors with realistic noise
- Exponential decay models (not linear!)
- Time-of-day load patterns
- Equipment runtime tracking

### PID Control
- Auto mode: Maintains DO setpoint
- Manual mode: Direct blower control
- Real PID mathematics with anti-windup
- Visible integral/derivative terms

### AI Optimizer
- Time-based load prediction
- Optimal setpoint recommendations
- Energy savings estimation
- Accept/override functionality

### Alarm System
- High/low thresholds per sensor
- Flashing red banner
- Auto-clear with hysteresis (5%)
- Acknowledge functionality
- Event log integration

### Data Export
- **CSV:** Real-time data download
- **PDF:** Professional reports (planned)
- **JSON:** Full state export

## 🎮 Demo Script

### 5-Minute Demo
1. **Welcome → Dashboard** (30s)
   - Show animated welcome
   - Click "Launch Simulator"
   - Point out KPI cards updating

2. **Dashboard → Control Room** (2min)
   - Click "Enter Control Room"
   - Show Overview tab (process flow + sensors)
   - Switch to Sensors tab (all 8 detailed)
   - Show Trends tab (live scrolling charts)

3. **Control Demonstration** (1.5min)
   - Go to Control tab
   - Change DO setpoint from 4.5 to 6.0
   - Watch blower speed increase (PID)
   - Show DO climbing in real-time

4. **AI & Features** (1min)
   - Show AI Insights tab
   - Click "Accept" AI recommendation
   - Go to Scenarios page
   - Briefly show Reports & Settings

### 20-Minute Full Demo
Follow 5-min script, then:
- Complete Tutorial scenario (10min)
- Generate and export CSV report (2min)
- Show Settings customization (2min)
- Trigger alarm and demonstrate response (3min)
- Show Dashboard overview and metrics (3min)

## 📈 Performance

- **Load time:** < 2s on localhost
- **FPS:** 60fps animations (Framer Motion)
- **Simulation:** 1 tick/second (no lag)
- **Charts:** Smooth scrolling (Recharts)
- **Memory:** Efficient with 300-point histories

## 🌐 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- Responsive: 1280px minimum width

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t reflow .
docker run -p 3000:3000 reflow
```

## 🎓 Learning Objectives

ReFlow teaches:
1. **SCADA/HMI interface patterns** (industrial software)
2. **Process control fundamentals** (PID controllers)
3. **Wastewater treatment processes** (real physics)
4. **Operational decision-making** (scenarios)
5. **Data-driven optimization** (AI recommendations)
6. **Alarm management** (safety-critical systems)

## 🔮 Roadmap

**Phase 1: Core (Complete)**
- ✅ Multi-page architecture
- ✅ Professional navigation
- ✅ Control Room with tabs
- ✅ Dashboard hub
- ✅ Scenarios list

**Phase 2: Scenarios (In Progress)**
- 🚧 Tutorial scenario implementation
- 🚧 Challenge 1: Load Surge
- 🚧 Scoring system
- 🚧 Unlock progression

**Phase 3: Advanced (Planned)**
- 📋 PDF report generation
- 📋 Onboarding tutorial flow
- 📋 Guided tours (help system)
- 📋 Demo mode (10x speed)
- 📋 Presentation mode
- 📋 CSV live streaming

**Phase 4: Polish (Planned)**
- 📋 Settings persistence (localStorage)
- 📋 Custom PID tuning
- 📋 Multiple plant profiles
- 📋 Historical playback
- 📋 Mobile responsive (tablet)

## 📝 License

MIT

## 🙏 Credits

Built with Claude Code - Professional industrial wastewater treatment digital twin simulator designed for hackathon demonstrations and interactive learning.

**Design Inspiration:**
- Wonderware/AVEVA SCADA
- Ignition by Inductive Automation
- Grafana Dashboards
- Datadog Monitoring

---

**ReFlow v1.0.0** - Making industrial software beautiful and accessible
