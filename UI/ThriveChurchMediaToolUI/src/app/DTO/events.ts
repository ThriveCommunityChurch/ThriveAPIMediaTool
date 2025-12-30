/**
 * Recurrence pattern enum - matches backend RecurrencePattern
 */
export enum RecurrencePattern {
  None = 0,
  Daily = 1,
  Weekly = 2,
  BiWeekly = 3,
  Monthly = 4,
  Yearly = 5
}

/**
 * Event location information
 */
export interface EventLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Event recurrence configuration
 */
export interface EventRecurrence {
  pattern: RecurrencePattern;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  interval: number;
  endDate?: string;
}

/**
 * Full Event model
 */
export interface Event {
  id: string;
  title: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  iconName?: string;
  startTime: string;
  endTime?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrence?: EventRecurrence;
  isOnline: boolean;
  onlineLink?: string;
  onlinePlatform?: string;
  location?: EventLocation;
  contactEmail?: string;
  contactPhone?: string;
  registrationUrl?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createDate: string;
  lastUpdated: string;
}

/**
 * Event summary for list views
 */
export interface EventSummary {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  iconName?: string;
  startTime: string;
  endTime?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  isOnline: boolean;
  locationName?: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
}

/**
 * Request to create a new event
 */
export interface CreateEventRequest {
  title: string;
  summary: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  iconName?: string;
  startTime: string;
  endTime?: string;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrence?: EventRecurrence;
  isOnline: boolean;
  onlineLink?: string;
  onlinePlatform?: string;
  location?: EventLocation;
  contactEmail?: string;
  contactPhone?: string;
  registrationUrl?: string;
  tags: string[];
  isFeatured: boolean;
}

/**
 * Request to update an existing event
 */
export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  isActive?: boolean;
}

/**
 * Response containing a list of events
 */
export interface AllEventsResponse {
  events: EventSummary[];
  totalCount: number;
}

/**
 * Response containing a single event
 */
export interface EventResponse {
  event: Event;
}

/**
 * System response wrapper (matches backend SystemResponse<T>)
 */
export interface SystemResponse<T> {
  result: T;
  hasErrors: boolean;
  errorMessage?: string;
}

