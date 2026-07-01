import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PipelineStageAnalytics } from '../../../services/analyticsService';

interface PipelineAnalyticsChartProps {
  stagesData: PipelineStageAnalytics[];
}

export function PipelineAnalyticsChart({ stagesData }: PipelineAnalyticsChartProps) {
  const navigate = useNavigate();

  const handleBarClick = () => {
    navigate('/deals');
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  // Maps stages to custom OrbitOS colors
  const stageColors: Record<string, string> = {
    Lead: 'var(--color-accent)',         // Cyan
    Contacted: 'var(--color-secondary)',  // Violet
    Negotiation: 'var(--color-primary)', // Indigo
    Won: 'var(--color-success)',        // Green
    Lost: 'var(--color-error)',         // Rose
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 border border-slate-700/50 backdrop-blur-md p-3 rounded-orbit-input text-xs font-bold text-white shadow-xl">
          <p className="mb-1.5 border-b border-white/10 pb-1 text-slate-300 uppercase tracking-wider">{label} Stage</p>
          <p className="flex items-center justify-between gap-4">
            <span>Portfolio Value:</span>
            <span style={{ color: payload[0].color }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.value)}
            </span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Deals Count:</span>
            <span className="text-slate-200">{data.count} deals</span>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span>Avg Close Probability:</span>
            <span className="text-slate-200">{data.averageProbability.toFixed(0)}%</span>
          </p>
          <p className="text-[9px] text-slate-400 mt-2 font-medium italic border-t border-white/5 pt-1 text-center">Click to view deals</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Pipeline Value by Stage
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Aggregated valuation across current deal lifecycle stages
          </p>
        </div>
        <span className="text-[9px] font-bold text-accent bg-accent/10 dark:bg-accent/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Deal Stages
        </span>
      </div>

      <div className="flex-1 min-h-0 w-full cursor-pointer" onClick={handleBarClick}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stagesData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.08)" vertical={false} />
            <XAxis
              dataKey="stage"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              style={{ fontWeight: 700 }}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              style={{ fontWeight: 700 }}
            />
            <Tooltip content={customTooltip} cursor={{ fill: 'rgba(128, 128, 128, 0.05)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
              {stagesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={stageColors[entry.stage] || 'var(--color-primary)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
