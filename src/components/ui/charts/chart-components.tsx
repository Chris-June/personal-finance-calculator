import {
  CartesianGrid,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Line as RechartsLine,
  XAxisProps,
  YAxisProps,
  TooltipProps,
  LegendProps,
  LineProps,
} from 'recharts';

export function ChartGrid() {
  return <CartesianGrid strokeDasharray="3 3" />;
}

export function ChartXAxis(props: XAxisProps) {
  return (
    <RechartsXAxis
      {...props}
      label={props.label || { position: 'insideBottom', offset: -5 }}
    />
  );
}

export function ChartYAxis(props: YAxisProps) {
  return (
    <RechartsYAxis
      {...props}
      label={props.label || { angle: -90, position: 'insideLeft' }}
    />
  );
}

export function ChartTooltip(props: TooltipProps<any, any>) {
  return <RechartsTooltip {...props} />;
}

export function ChartLegend(props: LegendProps) {
  return <RechartsLegend {...props} />;
}

export function ChartLine(props: LineProps) {
  return (
    <RechartsLine
      {...props}
      strokeWidth={props.strokeWidth || 2}
      dot={props.dot ?? false}
    />
  );
}