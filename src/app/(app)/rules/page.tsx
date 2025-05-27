'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z as Zod } from 'zod';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MOCK_RULES } from '@/lib/mock-data';
import type { ValidationRule } from '@/types';
import { ruleFormSchema } from '@/lib/schemas';
import { PlusCircle, ListChecks, FileJson, AlertTriangle, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type RuleFormValues = Zod.infer<typeof ruleFormSchema>;

export default function RulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<ValidationRule[]>(MOCK_RULES);
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [ruleJsonContent, setRuleJsonContent] = useState('');
  const [isNewRuleDialogOpen, setIsNewRuleDialogOpen] = useState(false);

  const newRuleForm = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: { name: '', description: '', conditions: '{}', isActive: true },
  });

  const handleSelectRule = (rule: ValidationRule) => {
    setSelectedRule(rule);
    setRuleJsonContent(JSON.stringify(rule.conditions, null, 2));
  };

  const handleSaveRule = () => {
    if (!selectedRule) return;
    try {
      const updatedConditions = JSON.parse(ruleJsonContent);
      const updatedRule = { ...selectedRule, conditions: updatedConditions };
      // TODO: Implement actual rule saving logic
      setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
      setSelectedRule(updatedRule); // Keep selection on the updated rule
      toast({ title: 'Rule Saved', description: `Rule "${updatedRule.name}" has been updated.` });
    } catch (error) {
      toast({ title: 'Invalid JSON', description: 'Rule conditions must be valid JSON.', variant: 'destructive' });
    }
  };
  
  const handleDeleteRule = () => {
    if(!selectedRule) return;
    // TODO: Implement actual delete logic
    setRules(rules.filter(r => r.id !== selectedRule.id));
    setSelectedRule(null);
    setRuleJsonContent('');
    toast({ title: 'Rule Deleted', description: `Rule "${selectedRule.name}" has been deleted.` });
  };

  const handleNewRuleSubmit = (data: RuleFormValues) => {
    try {
      const conditions = JSON.parse(data.conditions);
      const newRule: ValidationRule = {
        id: `rule-${Date.now()}`, // Simple ID generation for mock
        name: data.name,
        description: data.description,
        conditions,
        isActive: data.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // TODO: Implement actual new rule creation logic
      setRules([...rules, newRule]);
      setIsNewRuleDialogOpen(false);
      newRuleForm.reset();
      toast({ title: 'Rule Created', description: `Rule "${newRule.name}" has been created.` });
    } catch (error) {
      newRuleForm.setError('conditions', { type: 'manual', message: 'Invalid JSON format.' });
      toast({ title: 'Invalid JSON', description: 'Rule conditions must be valid JSON.', variant: 'destructive' });
    }
  };

  const pageActions = (
    <Dialog open={isNewRuleDialogOpen} onOpenChange={setIsNewRuleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> New Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <Form {...newRuleForm}>
          <form onSubmit={newRuleForm.handleSubmit(handleNewRuleSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Validation Rule</DialogTitle>
              <DialogDescription>Define a new rule for data validation.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={newRuleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newRuleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newRuleForm.control}
                name="conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions (JSON)</FormLabel>
                    <FormControl><Textarea {...field} rows={5} placeholder='{ "field": "value", "operator": "equals" }' /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={newRuleForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable this rule for validation.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={newRuleForm.formState.isSubmitting}>Create Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <PageHeader title="Validation Rule Engine" description="Manage and configure data validation rules." actions={pageActions} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5" /> Validation Rules</CardTitle>
              <CardDescription>Select a rule to view or edit its details.</CardDescription>
            </CardHeader>
            <CardContent>
              {rules.length > 0 ? (
                <ScrollArea className="h-[400px] pr-3">
                  <ul className="space-y-2">
                    {rules.map(rule => (
                      <li key={rule.id}>
                        <Button
                          variant={selectedRule?.id === rule.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => handleSelectRule(rule)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{rule.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{rule.description}</span>
                          </div>
                          <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">No rules defined yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><FileJson className="mr-2 h-5 w-5" /> Rule Editor</CardTitle>
              <CardDescription>
                {selectedRule ? `Editing rule: ${selectedRule.name}` : 'Select a rule to edit or create a new one.'}
              </CardDescription>
            </CardHeader>
            {selectedRule ? (
              <>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input id="ruleName" value={selectedRule.name} onChange={(e) => setSelectedRule({...selectedRule, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="ruleDescription">Description</Label>
                    <Textarea id="ruleDescription" value={selectedRule.description} onChange={(e) => setSelectedRule({...selectedRule, description: e.target.value })} rows={3} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="ruleActive" 
                      checked={selectedRule.isActive} 
                      onCheckedChange={(checked) => setSelectedRule({...selectedRule, isActive: checked})}
                    />
                    <Label htmlFor="ruleActive">Active</Label>
                  </div>
                  <div>
                    <Label htmlFor="ruleConditions">Conditions (JSON)</Label>
                    <Textarea
                      id="ruleConditions"
                      value={ruleJsonContent}
                      onChange={(e) => setRuleJsonContent(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                      placeholder='{ "field": "value", "operator": "equals" }'
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <CheckCircle className="mr-2 h-4 w-4" /> Test Rule (Placeholder)
                  </Button>
                  <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="destructive" onClick={handleDeleteRule} className="w-full sm:w-auto">Delete Rule</Button>
                    <Button onClick={handleSaveRule} className="w-full sm:w-auto">Save Rule</Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Select a rule from the list to edit its details.</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
