import { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

interface BaseChartProps {
  children: ReactNode;
  height?: number;
  title?: string;
}

export function BaseChart({ children, height = 400, title }: BaseChartProps) {
  return (
    <div className="h-[400px]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}