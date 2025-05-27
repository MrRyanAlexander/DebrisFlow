import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }).max(100),
  client: z.string().min(2, { message: "Client name must be at least 2 characters." }).max(100),
  eventId: z.string().max(50).optional().or(z.literal('')),
  region: z.string().min(2, { message: "Region must be at least 2 characters." }).max(50),
  serviceCodes: z.string().refine(value => {
    if (!value) return true; // Allow empty if optional, or handle as needed
    const codes = value.split(',').map(code => code.trim());
    return codes.every(code => code.length > 0 && code.length < 10);
  }, { message: "Service codes must be comma-separated and each code between 1-10 characters."}),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  description: z.string().max(500).optional().or(z.literal('')),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

export const ticketFormSchema = z.object({
  projectId: z.string().min(1, { message: "Project selection is required." }),
  truckId: z.string().min(3, { message: "Truck ID must be at least 3 characters." }).max(50),
  loadPhoto: z.any().optional(), // Handle file validation separately if needed
  // Using string for lat/lng initially, can parse to number later
  gpsLatitude: z.string().optional().refine(val => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <=90), {message: "Invalid latitude"}),
  gpsLongitude: z.string().optional().refine(val => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <=180), {message: "Invalid longitude"}),
});

export const ruleFormSchema = z.object({
  name: z.string().min(3, "Rule name must be at least 3 characters.").max(100),
  description: z.string().min(5, "Description must be at least 5 characters.").max(255),
  conditions: z.string().refine(value => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, { message: "Conditions must be valid JSON." }),
  isActive: z.boolean().default(true),
});
