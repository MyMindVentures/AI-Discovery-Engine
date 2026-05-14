import { MetricCard3D } from './MetricCard3D';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function StatCard(props: StatCardProps) {
  return <MetricCard3D {...props} depth="sm" interactive={false} />;
}
