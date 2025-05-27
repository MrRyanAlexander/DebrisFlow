import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_EQUIPMENT } from '@/lib/mock-data';
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, Wrench } from 'lucide-react';

const EQUIPMENT_STATUS_COLORS: Record<string, string> = {
  Available: 'bg-green-100 text-green-700 border-green-300',
  'In Use': 'bg-blue-100 text-blue-700 border-blue-300',
  Maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Out of Service': 'bg-red-100 text-red-700 border-red-300',
};


export default function EquipmentPage() {
  const pageActions = (
    // Placeholder for Link to new equipment page
    // <Link href="/equipment/new" passHref> 
      <Button className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Equipment
      </Button>
    // </Link>
  );

  return (
    <>
      <PageHeader title="Equipment Management" description="Track and manage all your equipment." actions={pageActions} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <CardTitle>Equipment List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search equipment..." className="pl-8 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Contractor</TableHead>
                  <TableHead className="hidden lg:table-cell">Model</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_EQUIPMENT.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${EQUIPMENT_STATUS_COLORS[item.status] || 'border-gray-300 text-gray-700'}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.contractor}</TableCell>
                    <TableCell className="hidden lg:table-cell">{item.model || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Wrench className="mr-2 h-4 w-4" />
                            Log Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {MOCK_EQUIPMENT.length === 0 && (
            <div className="text-center text-muted-foreground p-6">No equipment found.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
