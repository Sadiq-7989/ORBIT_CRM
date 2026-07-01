import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TaskPriorityItem {
  priority: string;
  count: number;
  completed: number;
  pending: number;
}

interface TaskCompletionChartProps {
  priorityData: TaskPriorityItem[];
}

export function TaskCompletionChart({ priorityData }: TaskCompletionChartProps) {
  const navigate = useNavigate();

  const handleChartClick = () => {
    navigate('/tasks');
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 border border-slate-700/50 backdrop-blur-md p-3 rounded-orbit-input text-xs font-bold text-white shadow-xl">
          <p className="mb-1.5 border-b border-white/10 pb-1 text-slate-300 uppercase tracking-wider">{label} Priority Tasks</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} style={{ color: p.color }} className="flex items-center justify-between gap-4">
              <span className="capitalize">{p.name}:</span>
              <span>{p.value} tasks</span>
            </p>
          ))}
          <p className="text-[9px] text-slate-400 mt-2 font-medium italic border-t border-white/5 pt-1 text-center">Click to view checklist</p>
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
            Task Status by Priority
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            Task completions and backlogs grouped by priority levels
          </p>
        </div>
        <span className="text-[9px] font-bold text-secondary bg-secondary/10 dark:bg-secondary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Workload
        </span>
      </div>

      <div className="flex-1 min-h-0 w-full cursor-pointer" onClick={handleChartClick}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData} margin={{ top: 10, right: 5, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.08)" vertical={false} />
            <XAxis
              dataKey="priority"
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
            <Tooltip content={customTooltip} cursor={{ fill: 'rgba(128, 128, 128, 0.05)' }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 10, fontWeight: 700 }}
            />
            <Bar name="completed" dataKey="completed" stackId="a" fill="var(--color-success)" maxBarSize={35} />
            <Bar name="pending" dataKey="pending" stackId="a" fill="var(--color-warning)" opacity={0.8} maxBarSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
