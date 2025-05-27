'use client'; // For recharts and AiProjectSummary client interactions

import PageHeader from '@/components/PageHeader';
import ProjectSummaryCard from '@/components/dashboard/ProjectSummaryCard';
import AiProjectSummary from '@/components/dashboard/AiProjectSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_PROJECTS, MOCK_CHART_DATA } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const activeProjects = MOCK_PROJECTS.filter(p => p.status === 'Active').slice(0, 4); // Display up to 4 active projects

  const pageActions = (
    <>
      <Button variant="outline" className="w-full sm:w-auto">
        <FileText className="mr-2 h-4 w-4" />
        Export Report
      </Button>
      <Button className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Project
      </Button>
    </>
  );

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your debris removal operations." actions={pageActions} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content area (larger on lg screens) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Activity Overview</CardTitle>
              <CardDescription>Monthly tickets created vs. completed.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}} />
                  <Bar dataKey="Tickets Created" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Tickets Completed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
            {activeProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activeProjects.map((project) => (
                  <ProjectSummaryCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">No active projects found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar content area (smaller on lg screens) */}
        <div className="lg:col-span-1">
          <AiProjectSummary />
        </div>
      </div>
    </>
  );
}
