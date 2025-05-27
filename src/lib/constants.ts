import type { NavItem, ProjectStatus, TicketStatus, EventStatus, TicketEventType } from '@/types';
import {
  LayoutDashboard,
  FolderKanban,
  Ticket as TicketIcon,
  Truck,
  FileCog,
  UserCircle,
  Settings,
  LogOut,
  Briefcase, // Placeholder for client icon
  MapPin as RegionIcon, // Placeholder for region icon
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Paperclip,
  Navigation,
  Anchor,
  DownloadCloud,
  UploadCloud,
  Landmark
} from 'lucide-react';

export const APP_NAME = 'DebrisFlow';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tickets', href: '/tickets', icon: TicketIcon },
  { label: 'Equipment', href: '/equipment', icon: Truck },
  { label: 'Rules', href: '/rules', icon: FileCog },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { label: 'Profile', href: '/profile', icon: UserCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
];

export const TICKET_EVENT_TYPES_ORDER: TicketEventType[] = [
  'Ticket Created',
  'Load Call',
  'Arrival at Load Site',
  'Load Complete',
  'Departure from Load Site',
  'Arrival at Disposal Site',
  'Disposal Complete',
  'Departure from Disposal Site',
  'Ticket Closed'
];


export const TICKET_EVENTS_CONFIG: Record<TicketEventType, { icon: LucideIcon, defaultStatus: EventStatus }> = {
  'Ticket Created': { icon: Paperclip, defaultStatus: 'completed' },
  'Load Call': { icon: DownloadCloud, defaultStatus: 'pending' },
  'Arrival at Load Site': { icon: Anchor, defaultStatus: 'pending' },
  'Load Complete': { icon: UploadCloud, defaultStatus: 'pending' },
  'Departure from Load Site': { icon: Navigation, defaultStatus: 'pending' },
  'Arrival at Disposal Site': { icon: Landmark, defaultStatus: 'pending' },
  'Disposal Complete': { icon: CheckCircle2, defaultStatus: 'pending' },
  'Departure from Disposal Site': { icon: Navigation, defaultStatus: 'pending' },
  'Ticket Closed': { icon: CheckCircle2, defaultStatus: 'pending' }
};


export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Active: 'bg-green-100 text-green-700 border-green-300',
  'On Hold': 'bg-orange-100 text-orange-700 border-orange-300',
  Completed: 'bg-blue-100 text-blue-700 border-blue-300',
  Cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
  Error: 'bg-red-100 text-red-700 border-red-300',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  Open: 'bg-blue-100 text-blue-700 border-blue-300',
  'In Progress': 'bg-teal-100 text-teal-700 border-teal-300',
  'On Hold': 'bg-orange-100 text-orange-700 border-orange-300',
  Resolved: 'bg-green-100 text-green-700 border-green-300',
  Closed: 'bg-gray-100 text-gray-700 border-gray-300',
  Error: 'bg-red-100 text-red-700 border-red-300',
  'Requires Attention': 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

export const EVENT_STATUS_COLORS: Record<EventStatus, { icon: LucideIcon, colorClasses: string, iconClasses?: string }> = {
  pending: { icon: Clock, colorClasses: 'text-gray-500', iconClasses: 'text-gray-400' },
  active: { icon: Loader2, colorClasses: 'text-blue-500 animate-spin', iconClasses: 'text-blue-500' },
  completed: { icon: CheckCircle2, colorClasses: 'text-green-500', iconClasses: 'text-green-500' },
  error: { icon: XCircle, colorClasses: 'text-red-500', iconClasses: 'text-red-500' },
  skipped: { icon: AlertCircle, colorClasses: 'text-orange-500', iconClasses: 'text-orange-400' },
};

// Placeholder icons for project summary card
export const ClientIcon = Briefcase;
export const RegionSummaryIcon = RegionIcon; // Using MapPin as RegionIcon for summary card
export const ErrorIcon = AlertCircle;
export const TransactionIcon = FileCog; // Using FileCog for transactions icon

// Other constants
export const DATE_FORMAT = "MMM d, yyyy";
export const DATE_TIME_FORMAT = "MMM d, yyyy, h:mm a";
