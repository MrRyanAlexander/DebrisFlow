import type { TicketStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { TICKET_STATUS_COLORS } from '@/lib/constants';

interface StatusChipProps {
  status: TicketStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  const colorClasses = TICKET_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  return (
    <Badge variant="outline" className={`px-2 py-0.5 text-xs ${colorClasses}`}>
      {status}
    </Badge>
  );
}
