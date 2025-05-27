import type { Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ClientIcon, RegionSummaryIcon, ErrorIcon, TransactionIcon, Clock } from '@/lib/constants';
import { PROJECT_STATUS_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/lib/constants';

interface ProjectSummaryCardProps {
  project: Project;
}

export default function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const statusColor = PROJECT_STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-700';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{project.name}</CardTitle>
        <CardDescription>Event ID: {project.eventId || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex items-center">
            <ClientIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center">
            <RegionSummaryIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{project.region}</span>
          </div>
          <div className="flex items-center">
            <ErrorIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Errors: {project.errorCount}</span>
          </div>
          <div className="flex items-center">
            <TransactionIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Transactions: {project.transactionsGenerated}</span>
          </div>
           <div className="flex items-center sm:col-span-2">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Last Update: {format(new Date(project.lastUpdatedAt), DATE_FORMAT)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <Badge className={`${statusColor} text-xs`} variant="outline">{project.status}</Badge>
            <span className="text-xs text-muted-foreground">{project.progress}% Complete</span>
          </div>
          <Progress value={project.progress} aria-label={`${project.progress}% complete`} className="h-2" />
        </div>

      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
