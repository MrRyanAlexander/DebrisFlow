import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  tooltip?: string;
  subItems?: NavItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Admin' | 'Manager' | 'Operator';
}

export type ProjectStatus = 'Pending' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Error';

export interface Project {
  id: string;
  name: string;
  client: string;
  eventId?: string;
  region: string;
  serviceCodes: string[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description?: string;
  status: ProjectStatus;
  progress: number; // 0-100
  errorCount: number;
  transactionsGenerated: number;
  lastUpdatedAt: string; // ISO date string
}

export type TicketEventType = 
  | 'Ticket Created' 
  | 'Load Call' 
  | 'Arrival at Load Site' 
  | 'Load Complete' 
  | 'Departure from Load Site' 
  | 'Arrival at Disposal Site' 
  | 'Disposal Complete' 
  | 'Departure from Disposal Site'
  | 'Ticket Closed';

export type EventStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';

export interface TicketEvent {
  id: string;
  type: TicketEventType;
  timestamp: string; // ISO date string
  status: EventStatus;
  notes?: string;
  userId?: string; // User who performed the event
  location?: { lat: number; lon: number };
}

export type TicketStatus = 'Open' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed' | 'Error' | 'Requires Attention';

export interface Ticket {
  id: string;
  projectId: string;
  projectName?: string; // denormalized for display
  truckId: string;
  driverId?: string;
  status: TicketStatus;
  events: TicketEvent[];
  loadPhotoUrl?: string;
  gpsCoordinates?: { lat: number; lon: number };
  errorNotes?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  priority?: 'Low' | 'Medium' | 'High';
}

export type EquipmentStatus = 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
export type EquipmentType = 'Truck' | 'Loader' | 'Excavator' | 'Roller' | 'GPS Unit';

export interface Equipment {
  id: string;
  type: EquipmentType;
  status: EquipmentStatus;
  contractor: string;
  model?: string;
  year?: number;
  lastMaintenanceDate?: string; // ISO date string
  currentProjectId?: string;
  currentTicketId?: string;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  conditions: Record<string, any>; // JSON defining the rule
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Transaction {
  id: string;
  ticketId: string;
  type: 'Load' | 'Disposal' | 'Adjustment';
  amount: number; // Could be volume, weight, or monetary value
  unit: string; // e.g., 'cubic yards', 'tons', 'USD'
  timestamp: string; // ISO date string
  approvedBy?: string; // User ID
}
