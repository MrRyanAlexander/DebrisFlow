import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StatusChip from '@/components/tickets/StatusChip';
import EventProgressIndicator from '@/components/tickets/EventProgressIndicator';
import { MOCK_TICKETS } from '@/lib/mock-data';
import { PlusCircle, Filter, Search, AlertCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/lib/constants';

export default function TicketsPage() {
  const pageActions = (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter Tickets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Error'].map(status => (
            <DropdownMenuCheckboxItem key={status} > {/* Add checked and onCheckedChange for actual filtering */}
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/tickets/new" passHref>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </Link>
    </>
  );

  return (
    <>
      <PageHeader title="Tickets" description="Manage and track all debris removal tickets." actions={pageActions} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <CardTitle>Ticket Queue</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search tickets..." className="pl-8 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {MOCK_TICKETS.length > 0 ? (
            MOCK_TICKETS.map((ticket) => (
              <Card key={ticket.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div>
                      <CardTitle className="text-lg">Ticket ID: {ticket.id}</CardTitle>
                      <CardDescription>
                        Project: {ticket.projectName || ticket.projectId} &bull; Truck: {ticket.truckId}
                      </CardDescription>
                    </div>
                    <StatusChip status={ticket.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EventProgressIndicator events={ticket.events} />
                  {ticket.errorNotes && ticket.errorNotes.length > 0 && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-700">Error Notes:</h4>
                          <ul className="list-disc list-inside text-red-600">
                            {ticket.errorNotes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <span>Created: {format(new Date(ticket.createdAt), DATE_TIME_FORMAT)}</span>
                    <span>Updated: {format(new Date(ticket.updatedAt), DATE_TIME_FORMAT)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">No tickets found.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
