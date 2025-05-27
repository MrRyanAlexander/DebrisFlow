import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { PROJECT_STATUS_COLORS, DATE_FORMAT } from '@/lib/constants';
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const pageActions = (
    <Link href="/projects/new" passHref>
      <Button className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </Link>
  );

  return (
    <>
      <PageHeader title="Projects" description="Manage all your debris removal projects." actions={pageActions} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <CardTitle>Project List</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search projects..." className="pl-8 w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="hidden lg:table-cell">Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Progress</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PROJECTS.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{project.client}</TableCell>
                    <TableCell className="hidden lg:table-cell">{project.region}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${PROJECT_STATUS_COLORS[project.status] || 'border-gray-300 text-gray-700'}`}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">{project.progress}%</TableCell>
                    <TableCell className="hidden lg:table-cell">{format(new Date(project.lastUpdatedAt), DATE_FORMAT)}</TableCell>
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
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {MOCK_PROJECTS.length === 0 && (
            <div className="text-center text-muted-foreground p-6">No projects found.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
