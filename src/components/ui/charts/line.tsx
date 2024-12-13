import { Line as RechartsLine } from 'recharts';

interface LineProps {
  dataKey: string;
  name: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  dot?: boolean;
}

export function Line({
  dataKey,
  name,
  stroke = '#4ade80',
  strokeWidth = 2,
  strokeDasharray,
  dot = false,
}: LineProps) {
  return (
    <RechartsLine
      type="monotone"
      dataKey={dataKey}
      name={name}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      dot={dot}
    />
  );
}