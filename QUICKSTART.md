# ReFlow - Quick Start Guide

## 🚀 Getting Started (2 minutes)

Your industrial wastewater treatment digital twin is ready to run!

### 1. The server is already running at:
```
http://localhost:3000
```

Open this URL in your browser to see the HMI interface.

### 2. What You'll See

**Top Bar**
- System status indicator (green = running)
- Current time (IST)
- Active alarm count

**Main Layout (3 columns)**
- **Left**: Process flow diagram with animated particles
- **Middle**: 8 sensor cards + 3 trend charts
- **Right**: DO control panel, equipment panel, AI optimizer
- **Bottom**: Event log

### 3. Key Controls

**Start/Stop Simulation**
- Click the green ▶ START button (top left)
- Simulation runs automatically at 1 tick/second

**DO Control**
- Toggle between AUTO (PID control) and MANUAL mode
- In AUTO: System maintains setpoint automatically
- In MANUAL: Use slider to control blower speed
- Watch the DO chart respond in real-time

**AI Optimizer**
- Click "ENABLED" to activate AI recommendations
- Click "ACCEPT" to apply AI-suggested setpoint
- AI predicts load changes based on time of day

**Equipment**
- Toggle pumps ON/OFF
- Adjust bypass valve position
- Monitor runtime hours

**Alarms**
- Red flashing banner appears when thresholds exceeded
- Click "ACKNOWLEDGE ALL" to silence
- Auto-clears when sensor returns to normal

## 🎯 Demo Features

### Live Physics Simulation
- BOD/TSS values change based on time of day
- Primary treatment: 20% BOD removal (instant)
- Secondary treatment: 85% BOD removal (6-hour exponential decay)
- Tertiary treatment: 95% BOD removal (2 hours)

### Real PID Control
- Kp = 15.0, Ki = 0.8, Kd = 2.0
- Anti-windup protection
- Updates every 5 seconds
- Response time: 2-3 minutes to stabilize

### Sensor Monitoring
- DO: Dissolved Oxygen (0-10 mg/L)
- pH: Acidity/Alkalinity (6-9)
- TSS: Total Suspended Solids (0-1000 mg/L)
- BOD: Biological Oxygen Demand (0-1000 mg/L)
- Flow: Flow rate (0-100 m³/h)
- TDS: Total Dissolved Solids (0-2000 ppm)
- Turbidity: Water clarity (0-100 NTU)
- Pressure: System pressure (0-10 bar)

Each sensor shows:
- Current value (large number)
- Trend arrow (↑ increasing, ↓ decreasing, → stable)
- Status LED (green = normal, red = alarm)
- Mini sparkline (last 60 data points)

## 🔧 Testing the System

### Test 1: Change DO Setpoint (3 minutes)
1. Set DO control to AUTO mode
2. Change setpoint from 4.5 to 6.0 mg/L
3. Watch blower speed increase
4. Monitor DO chart climbing
5. System stabilizes in ~2-3 minutes

### Test 2: Trigger an Alarm
1. Wait for TSS or BOD to naturally exceed threshold, OR
2. Adjust equipment to push sensors out of range
3. Red banner flashes at top
4. Event log shows alarm entry
5. Click ACKNOWLEDGE to silence

### Test 3: AI Optimization
1. Enable AI optimizer
2. Note the predicted load change
3. Click ACCEPT to apply recommendation
4. Watch DO setpoint update
5. See energy savings estimate

### Test 4: Manual Control
1. Switch DO control to MANUAL mode
2. Use blower slider to adjust speed
3. Watch DO respond (increases/decreases)
4. Trend chart shows immediate effect

## 📊 Key Metrics to Watch

**BOD Removal Efficiency**
- Target: >90%
- Displayed in top bar and process flow

**DO Level (Most Important)**
- Optimal range: 2-4 mg/L for MBBR
- Too low: Treatment efficiency drops
- Too high: Energy waste

**Flow Rate**
- Steady at ~50 m³/h
- Oscillates naturally ±10 m³/h

**TSS & BOD in Secondary**
- Should decrease over time
- Affected by DO level

## 🎨 Industrial HMI Features

**Dark Theme**
- Background: #1a1a1a (charcoal)
- Cards: #252525 (lighter gray)
- Text: #e0e0e0 (light gray)

**Status Colors**
- Green (#00ff00): Normal operation
- Yellow (#ffaa00): Warning
- Red (#ff0000): Critical alarm
- Blue (#00aaff): Information

**LED Indicators**
- Glow effect around status dots
- Green = running/normal
- Red = alarm/stopped
- Gray = disabled

**Animations**
- Flow particles moving down pipes
- Alarm banner flashing
- Chart scrolling left

## 🐛 Troubleshooting

**Server won't start?**
```bash
# Kill any existing process
taskkill /F /IM node.exe
# Restart
npm run dev
```

**Blank page?**
- Check browser console (F12) for errors
- Ensure you're on http://localhost:3000
- Try hard refresh (Ctrl+F5)

**Simulation not running?**
- Click the green ▶ START button
- Check browser console for errors
- Refresh page

**Charts not updating?**
- Simulation must be running
- Wait 30-60 seconds for data to accumulate
- Check event log for errors

## 📈 Performance Tips

- Works best in Chrome/Edge
- Fullscreen (F11) for best experience
- Zoom to 100% (Ctrl+0)
- Close other browser tabs for smooth animation

## 🎓 Next Steps

1. **Explore the code**: Check `/lib/simulator.ts` for physics engine
2. **Customize colors**: Edit `tailwind.config.ts`
3. **Add features**: New sensors, controls, or charts
4. **Deploy**: `npm run build` then deploy to Vercel

## 📞 Support

- Check README.md for detailed documentation
- Review water management.txt for original spec
- All code is well-commented for easy understanding

---

**Enjoy your industrial wastewater treatment digital twin! 🌊⚙️**
