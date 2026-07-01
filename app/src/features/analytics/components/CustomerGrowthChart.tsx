import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthTrendItem {
  month: string;
  count: number;
}

interface CustomerGrowthChartProps {
  growthTrends: GrowthTrendItem[];
}

export function CustomerGrowthChart({ growthTrends }: CustomerGrowthChartProps) {
  const navigate = useNavigate();

  const handleChartClick = () => {
    navigate('/customers');
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 border border-slate-700/50 backdrop-blur-md p-3 rounded-orbit-input text-xs font-bold text-white shadow-xl">
          <p className="mb-1.5 border-b border-white/10 pb-1 text-slate-300">{label}</p>
          <p className="flex items-center justify-between gap-4">
            <span className="text-secondary">Cumulative Clients:</span>
            <span>{payload[0].value} customers</span>
          </p>
          <p className="text-[9px] text-slate-400 mt-2 font-medium italic border-t border-white/5 pt-1 text-center">Click to view directory</p>
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
            Customer Growth Curve
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Cumulative expansion of registered customers in the CRM
          </p>
        </div>
        <span className="text-[9px] font-bold text-secondary bg-secondary/10 dark:bg-secondary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Client base
        </span>
      </div>

      <div className="flex-1 min-h-0 w-full cursor-pointer" onClick={handleChartClick}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthTrends} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCustomerGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.08)" vertical={false} />
            <XAxis
              dataKey="month"
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
              allowDecimals={false}
              style={{ fontWeight: 700 }}
            />
            <Tooltip content={customTooltip} cursor={{ stroke: 'rgba(128,128,128,0.15)', strokeWidth: 1.5 }} />
            <Area
              type="monotone"
              name="total customers"
              dataKey="count"
              stroke="var(--color-secondary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCustomerGrowth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
