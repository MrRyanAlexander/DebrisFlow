import { format, subDays, addDays, subMonths, addMonths } from 'date-fns';
import type { User, Project, Ticket, Equipment, ValidationRule, TicketEvent, EventStatus, TicketEventType } from '@/types';
import { TICKET_EVENTS_CONFIG, TICKET_EVENT_TYPES_ORDER } from './constants';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alice Wonderland', email: 'alice@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=AW', role: 'Admin' },
  { id: 'user-2', name: 'Bob The Builder', email: 'bob@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=BB', role: 'Manager' },
  { id: 'user-3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Operator' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Hurricane Zeta Cleanup',
    client: 'City of New Orleans',
    eventId: 'HZ-2023',
    region: 'Louisiana',
    serviceCodes: ['DC', 'HM', 'VEG'],
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 60), 'yyyy-MM-dd'),
    description: 'Large scale debris removal post-hurricane.',
    status: 'Active',
    progress: 65,
    errorCount: 3,
    transactionsGenerated: 1205,
    lastUpdatedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'proj-2',
    name: 'Tornado Recovery - Springfield',
    client: 'FEMA Region 7',
    eventId: 'TR-SF-2024',
    region: 'Missouri',
    serviceCodes: ['C&D', 'MSW'],
    startDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
    description: 'Urgent debris clearance and disposal.',
    status: 'Active',
    progress: 30,
    errorCount: 1,
    transactionsGenerated: 450,
    lastUpdatedAt: format(subDays(new Date(), 0), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'proj-3',
    name: 'Wildfire Debris Removal - CA',
    client: 'CalOES',
    region: 'California',
    serviceCodes: ['ASH', 'SOIL', 'CONC'],
    startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'Completed',
    progress: 100,
    errorCount: 0,
    transactionsGenerated: 2500,
    lastUpdatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
  },
    {
    id: 'proj-4',
    name: 'Flood Mitigation - River City',
    client: 'State DOT',
    eventId: 'FM-RC-2023',
    region: 'Iowa',
    serviceCodes: ['SILT', 'VEG'],
    startDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    description: 'Clearing waterways and surrounding areas.',
    status: 'On Hold',
    progress: 50,
    errorCount: 5,
    transactionsGenerated: 300,
    lastUpdatedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd HH:mm:ss'),
  },
];

const generateMockEvents = (ticketStatus: TicketStatus, creationDate: Date): TicketEvent[] => {
  let events: TicketEvent[] = [];
  let lastEventTime = creationDate;
  let allEventsCompleted = true;

  TICKET_EVENT_TYPES_ORDER.forEach((eventType, index) => {
    const config = TICKET_EVENTS_CONFIG[eventType];
    let status: EventStatus = config.defaultStatus;
    
    // Randomly advance event time by 1-4 hours
    lastEventTime = new Date(lastEventTime.getTime() + (Math.random() * 3 + 1) * 60 * 60 * 1000);
    
    if (new Date() < lastEventTime && status === 'pending') { // If event is in future, it's pending
        allEventsCompleted = false;
    } else if (status === 'pending') { // If event is in past but still 'pending' by default
        // Logic to determine if this pending event should be completed, active, or error based on ticketStatus
        if (ticketStatus === 'Closed' || ticketStatus === 'Resolved') {
            status = 'completed';
        } else if (ticketStatus === 'Error' && Math.random() < 0.3) { // 30% chance an event is an error for Error tickets
            status = 'error';
            allEventsCompleted = false;
        } else if (ticketStatus === 'In Progress' && index < TICKET_EVENT_TYPES_ORDER.length / 2 && Math.random() < 0.7) { // More likely to be completed if early stage
            status = 'completed';
        } else if (ticketStatus === 'In Progress' && index === Math.floor(TICKET_EVENT_TYPES_ORDER.length / 2) && Math.random() < 0.5) { // Current event might be active
             status = 'active';
             allEventsCompleted = false;
        }
         else { // Otherwise, stays pending or randomly completed
            status = Math.random() < 0.6 ? 'completed' : 'pending';
            if(status === 'pending') allEventsCompleted = false;
        }
    } else { // if defaultStatus is 'completed' (like 'Ticket Created')
        // it's already completed
    }
    
    if (status !== 'completed') allEventsCompleted = false;

    events.push({
      id: `evt-${eventType.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(7)}`,
      type: eventType,
      timestamp: format(lastEventTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      status: status,
      notes: status === 'error' ? `Error during ${eventType}` : undefined,
      userId: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].id,
    });
  });
  
  // If ticket is Closed/Resolved, all events must be completed.
  if (ticketStatus === 'Closed' || ticketStatus === 'Resolved') {
    events = events.map(e => ({ ...e, status: 'completed' }));
  } else if (allEventsCompleted && ticketStatus !== 'Closed' && ticketStatus !== 'Resolved') {
    // If all events are completed but ticket is not Closed/Resolved, make the last one active or pending
    if (events.length > 0) {
      const lastEventIdx = events.length -1;
      if (events[lastEventIdx].type !== 'Ticket Closed') {
         events[lastEventIdx].status = 'pending'; // Or 'active'
      } else if (events[lastEventIdx].type === 'Ticket Closed' && events[lastEventIdx].status === 'completed') {
        // This case means ticket should be Closed/Resolved, but isn't. This is a data inconsistency.
        // For mock data, we might just leave it, or force ticket to 'Closed'. For now, leave.
      }
    }
  }


  return events;
};


export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-001',
    projectId: 'proj-1',
    projectName: MOCK_PROJECTS[0].name,
    truckId: 'TRUCK-A15',
    driverId: 'user-3',
    status: 'In Progress',
    loadPhotoUrl: 'https://placehold.co/600x400.png?text=Load+Photo+1',
    gpsCoordinates: { lat: 29.9511, lon: -90.0715 },
    errorNotes: undefined,
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    priority: 'High',
    events: generateMockEvents('In Progress', subDays(new Date(), 2)),
  },
  {
    id: 'ticket-002',
    projectId: 'proj-1',
    projectName: MOCK_PROJECTS[0].name,
    truckId: 'TRUCK-B07',
    status: 'Resolved',
    loadPhotoUrl: 'https://placehold.co/600x400.png?text=Load+Photo+2',
    createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    priority: 'Medium',
    events: generateMockEvents('Resolved', subDays(new Date(), 5)),
  },
  {
    id: 'ticket-003',
    projectId: 'proj-2',
    projectName: MOCK_PROJECTS[1].name,
    truckId: 'TRUCK-C22',
    status: 'Error',
    errorNotes: ['GPS mismatch >5 miles', 'Incorrect material type logged'],
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    priority: 'High',
    events: generateMockEvents('Error', subDays(new Date(), 1)),
  },
  {
    id: 'ticket-004',
    projectId: 'proj-2',
    projectName: MOCK_PROJECTS[1].name,
    truckId: 'TRUCK-A15',
    status: 'Open',
    createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    priority: 'Medium',
    events: generateMockEvents('Open', new Date()),
  },
   {
    id: 'ticket-005',
    projectId: 'proj-3',
    projectName: MOCK_PROJECTS[2].name,
    truckId: 'TRUCK-D01',
    driverId: 'user-3',
    status: 'Closed',
    loadPhotoUrl: 'https://placehold.co/600x400.png?text=Load+Photo+5',
    gpsCoordinates: { lat: 34.0522, lon: -118.2437 },
    errorNotes: undefined,
    createdAt: format(subDays(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 6), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    priority: 'Low',
    events: generateMockEvents('Closed', subDays(new Date(), 10)),
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'EQ-001', type: 'Truck', status: 'Available', contractor: 'Haulage Inc.', model: 'Mack Anthem', year: 2022 },
  { id: 'EQ-002', type: 'Loader', status: 'In Use', contractor: 'GroundForce LLC', currentProjectId: 'proj-1', model: 'CAT 950M', year: 2021 },
  { id: 'EQ-003', type: 'Excavator', status: 'Maintenance', contractor: 'DigIt Rentals', model: 'Komatsu PC210LC', year: 2019 },
  { id: 'EQ-004', type: 'GPS Unit', status: 'Available', contractor: 'TechTrack Solutions' },
  { id: 'EQ-005', type: 'Truck', status: 'Out of Service', contractor: 'Haulage Inc.', model: 'Peterbilt 579', year: 2020 },
];

export const MOCK_RULES: ValidationRule[] = [
  {
    id: 'rule-1',
    name: 'GPS Proximity Check',
    description: 'Ensures ticket GPS coordinates are within 2 miles of the project site.',
    isActive: true,
    conditions: {
      field: 'ticket.gpsCoordinates',
      operator: 'distanceLessThan',
      value: 2,
      unit: 'miles',
      reference: 'project.siteCoordinates',
    },
    createdAt: format(subDays(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
  {
    id: 'rule-2',
    name: 'Material Type Verification',
    description: 'Validates that the logged material type is allowed for the project.',
    isActive: true,
    conditions: {
      field: 'ticket.materialType',
      operator: 'in',
      valuePath: 'project.allowedMaterialTypes',
    },
    createdAt: format(subDays(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
  {
    id: 'rule-3',
    name: 'Max Load Capacity',
    description: 'Flags tickets where load volume exceeds equipment capacity.',
    isActive: false,
    conditions: {
      field: 'ticket.loadVolume',
      operator: 'lessThanOrEqualTo',
      valuePath: 'equipment.maxCapacity',
      unit: 'cubicYards'
    },
    createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    updatedAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
];


export const MOCK_CHART_DATA = [
  { month: format(subMonths(new Date(), 5), 'MMM'), "Tickets Created": 120, "Tickets Completed": 90 },
  { month: format(subMonths(new Date(), 4), 'MMM'), "Tickets Created": 150, "Tickets Completed": 110 },
  { month: format(subMonths(new Date(), 3), 'MMM'), "Tickets Created": 180, "Tickets Completed": 160 },
  { month: format(subMonths(new Date(), 2), 'MMM'), "Tickets Created": 130, "Tickets Completed": 100 },
  { month: format(subMonths(new Date(), 1), 'MMM'), "Tickets Created": 200, "Tickets Completed": 175 },
  { month: format(new Date(), 'MMM'), "Tickets Created": 90, "Tickets Completed": 60 }, // Current month, partial data
];
