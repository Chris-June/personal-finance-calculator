import { XAxis as RechartsXAxis, YAxis as RechartsYAxis } from 'recharts';

interface AxisProps {
  dataKey?: string;
  tickFormatter?: (value: any) => string;
  label?: {
    value: string;
    position?: 'insideBottom' | 'insideLeft' | 'insideRight' | 'insideTop';
    offset?: number;
    angle?: number;
  };
}

export function XAxis({ dataKey, tickFormatter, label }: AxisProps) {
  return (
    <RechartsXAxis
      dataKey={dataKey}
      tickFormatter={tickFormatter}
      label={{
        value: label?.value ?? '',
        position: label?.position ?? 'insideBottom',
        offset: label?.offset ?? -5,
      }}
    />
  );
}

export function YAxis({ tickFormatter, label }: AxisProps) {
  return (
    <RechartsYAxis
      tickFormatter={tickFormatter}
      label={{
        value: label?.value ?? '',
        angle: label?.angle ?? -90,
        position: label?.position ?? 'insideLeft',
      }}
    />
  );
}