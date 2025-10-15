'use client';

import { usePlantStore } from '@/lib/store';

export default function AIInsights() {
  const { ai, toggleAI, acceptAIRecommendation } = usePlantStore();

  return (
    <div className="card-industrial">
      <div className="flex items-center justify-between mb-4 border-b border-industrial-border pb-2">
        <div className="text-lg font-bold">AI OPTIMIZER</div>
        <button
          onClick={toggleAI}
          className={`text-xs btn-industrial ${
            ai.enabled ? 'bg-terminal-green/20 border-terminal-green text-terminal-green' : ''
          }`}
        >
          {ai.enabled ? '● ENABLED' : '○ DISABLED'}
        </button>
      </div>

      {ai.enabled && (
        <div className="space-y-3">
          <div className="text-sm">
            <div className="text-gray-400 mb-1">Predicted Load (next 2h)</div>
            <div className="text-xl mono">
              {ai.predictedLoad > 1 ? '+' : ''}{((ai.predictedLoad - 1) * 100).toFixed(0)}%
              <span className={`ml-2 text-sm ${ai.predictedLoad > 1 ? 'text-status-yellow' : 'text-terminal-green'}`}>
                {ai.predictedLoad > 1 ? 'INCREASING' : 'DECREASING'}
              </span>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-gray-400 mb-1">Recommended DO Setpoint</div>
            <div className="text-2xl mono text-status-blue">
              {ai.recommendedSetpoint.toFixed(1)} <span className="text-sm text-gray-400">mg/L</span>
            </div>
          </div>

          <div className="text-sm">
            <div className="text-gray-400 mb-1">Estimated Energy Savings</div>
            <div className="text-xl mono text-terminal-green">
              {ai.energySavings}%
            </div>
          </div>

          <div className="pt-3 border-t border-industrial-border flex gap-2">
            <button
              onClick={acceptAIRecommendation}
              className="btn-industrial flex-1 bg-terminal-green/20 border-terminal-green text-terminal-green hover:bg-terminal-green/30"
            >
              ACCEPT
            </button>
            <button className="btn-industrial flex-1">
              OVERRIDE
            </button>
          </div>
        </div>
      )}

      {!ai.enabled && (
        <div className="text-center text-gray-500 py-8">
          AI Optimizer Disabled
        </div>
      )}
    </div>
  );
}
