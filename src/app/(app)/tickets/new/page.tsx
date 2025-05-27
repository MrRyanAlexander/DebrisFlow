'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ticketFormSchema } from '@/lib/schemas';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { ScanLine, UploadCloud, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

type TicketFormValues = z.infer<typeof ticketFormSchema>;

export default function NewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loadPhotoPreview, setLoadPhotoPreview] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      projectId: '',
      truckId: '',
      gpsLatitude: '',
      gpsLongitude: '',
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoadPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('loadPhoto', file); // For react-hook-form
    } else {
      setLoadPhotoPreview(null);
      form.setValue('loadPhoto', undefined);
    }
  };
  
  const handleGpsConfirm = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Geolocation Error', description: 'Geolocation is not supported by your browser.', variant: 'destructive' });
      return;
    }
    setIsFetchingLocation(true);
    setLocationConfirmed(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('gpsLatitude', position.coords.latitude.toString());
        form.setValue('gpsLongitude', position.coords.longitude.toString());
        setIsFetchingLocation(false);
        setLocationConfirmed(true);
        toast({ title: 'GPS Location Confirmed', description: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}` });
      },
      (error) => {
        setIsFetchingLocation(false);
        toast({ title: 'GPS Error', description: `Could not get location: ${error.message}`, variant: 'destructive' });
      }
    );
  };


  function onSubmit(data: TicketFormValues) {
    console.log('Ticket data submitted:', data);
    // TODO: Implement actual ticket creation logic
    toast({
      title: 'Ticket Created',
      description: `Ticket for project "${MOCK_PROJECTS.find(p=>p.id === data.projectId)?.name}" and truck "${data.truckId}" created.`,
    });
    router.push('/tickets');
  }

  const activeProjects = MOCK_PROJECTS.filter(p => p.status === 'Active' || p.status === 'On Hold');

  return (
    <>
      <PageHeader title="Create New Ticket" description="Log a new debris removal ticket." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>Provide the necessary information for this ticket.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Project</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an active project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} ({project.region})
                          </SelectItem>
                        ))}
                        {activeProjects.length === 0 && <SelectItem value="no-projects" disabled>No active projects</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Truck ID</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="Enter Truck ID (e.g., TRUCK-123)" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" size="icon" aria-label="Scan Truck ID">
                        <ScanLine className="h-5 w-5" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loadPhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Load Photo</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="w-full"
                    >
                      <UploadCloud className="mr-2 h-4 w-4" /> Choose Photo
                    </Button>
                    {loadPhotoPreview && (
                      <div className="mt-2 relative w-full aspect-video rounded-md overflow-hidden border">
                        <Image src={loadPhotoPreview} alt="Load photo preview" layout="fill" objectFit="contain" data-ai-hint="load truck" />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Confirm GPS Location</FormLabel>
                <Button type="button" onClick={handleGpsConfirm} variant="outline" className="w-full" disabled={isFetchingLocation}>
                  {isFetchingLocation ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Fetching Location...</>
                  ) : locationConfirmed ? (
                    <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />Location Confirmed</>
                  ) : (
                    <><MapPin className="mr-2 h-4 w-4" />Get Current Location</>
                  )}
                </Button>
                {(form.watch('gpsLatitude') && form.watch('gpsLongitude')) && !isFetchingLocation && (
                  <FormDescription className="text-xs">
                    Lat: {parseFloat(form.getValues('gpsLatitude') || '0').toFixed(6)}, Lon: {parseFloat(form.getValues('gpsLongitude') || '0').toFixed(6)}
                  </FormDescription>
                )}
                 <FormField control={form.control} name="gpsLatitude" render={() => <FormMessage />} />
                 <FormField control={form.control} name="gpsLongitude" render={() => <FormMessage />} />
              </FormItem>
            </CardContent>
            <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Link href="/tickets" passHref>
                <Button variant="outline" type="button" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Ticket'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
