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
 * Note: Uses camelCase for request DTOs, API returns PascalCase
 */
export interface EventRecurrence {
  pattern: RecurrencePattern;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  interval: number;
  endDate?: string;
  // PascalCase variants for API response parsing
  Pattern?: RecurrencePattern;
  DayOfWeek?: number;
  DayOfMonth?: number;
  MonthOfYear?: number;
  Interval?: number;
  EndDate?: string;
}

/**
 * Full Event model (PascalCase to match API response)
 */
export interface Event {
  Id: string;
  Title: string;
  Summary: string;
  Description?: string;
  ImageUrl?: string;
  ThumbnailUrl?: string;
  IconName?: string;
  StartTime: string;
  EndTime?: string;
  IsAllDay: boolean;
  IsRecurring: boolean;
  Recurrence?: EventRecurrence;
  IsOnline: boolean;
  OnlineLink?: string;
  OnlinePlatform?: string;
  Location?: EventLocation;
  ContactEmail?: string;
  ContactPhone?: string;
  RegistrationUrl?: string;
  Tags: string[];
  IsActive: boolean;
  IsFeatured: boolean;
  CreateDate: string;
  LastUpdated: string;
}

/**
 * Event summary for list views (PascalCase to match API response)
 */
export interface EventSummary {
  Id: string;
  Title: string;
  Summary: string;
  ThumbnailUrl?: string;
  IconName?: string;
  StartTime: string;
  EndTime?: string;
  IsRecurring: boolean;
  RecurrencePattern?: string;
  RecurrenceDayOfWeek?: number;  // 0=Sunday, 6=Saturday
  IsOnline: boolean;
  LocationName?: string;
  IsFeatured: boolean;
  IsActive: boolean;
  Tags: string[];
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
 * Response containing a list of events (PascalCase to match API response)
 */
export interface AllEventsResponse {
  Events: EventSummary[];
  TotalCount: number;
}

/**
 * Response containing a single event (PascalCase to match API response)
 */
export interface EventResponse {
  Event: Event;
}

/**
 * System response wrapper (matches backend SystemResponse<T>)
 */
export interface SystemResponse<T> {
  result: T;
  hasErrors: boolean;
  errorMessage?: string;
}

