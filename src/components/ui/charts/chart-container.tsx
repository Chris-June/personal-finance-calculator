import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title?: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartContainer({
  title,
  children,
  height = 400,
}: ChartContainerProps) {
  return (
    <div className="h-[400px]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}