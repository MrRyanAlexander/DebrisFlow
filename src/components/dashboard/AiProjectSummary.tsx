'use client';
import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { generateProjectSummary, type GenerateProjectSummaryInput } from '@/ai/flows/project-summary';

export default function AiProjectSummary() {
  const [projectDetails, setProjectDetails] = useState('');
  const [recentChanges, setRecentChanges] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    setError(null);
    setSummary(null);

    startTransition(async () => {
      try {
        const input: GenerateProjectSummaryInput = { projectDetails, recentChanges };
        const result = await generateProjectSummary(input);
        setSummary(result.summary);
      } catch (e) {
        console.error("Error generating summary:", e);
        setError((e as Error).message || 'Failed to generate summary. Please try again.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI-Powered Project Insights
        </CardTitle>
        <CardDescription>
          Provide project details and recent updates to generate an AI-powered summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter project overview, objectives, current status, key stakeholders, etc."
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            rows={5}
            disabled={isPending}
          />
        </div>
        <div>
          <Textarea
            placeholder="List recent changes, completed milestones, new issues, team updates, etc."
            value={recentChanges}
            onChange={(e) => setRecentChanges(e.target.value)}
            rows={5}
            disabled={isPending}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {summary && (
          <Alert variant="default" className="bg-accent/20 border-accent/50">
            <Sparkles className="h-4 w-4 text-accent" />
            <AlertTitle>Generated Summary</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">{summary}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isPending || !projectDetails || !recentChanges} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
