import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { ToastService } from '../../services/toast-service.service';
import {
  CreateEventRequest,
  Event,
  EventLocation,
  EventRecurrence,
  RecurrencePattern,
  UpdateEventRequest
} from '../../DTO/events';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  standalone: false
})
export class EventFormComponent implements OnInit {
  isEditMode = false;
  eventId: string | null = null;
  loading = false;
  saving = false;

  // Form fields
  title = '';
  summary = '';
  description = '';
  imageUrl = '';
  thumbnailUrl = '';
  iconName = '';
  startTime = '';
  endTime = '';
  isAllDay = false;
  isRecurring = false;
  isOnline = false;
  onlineLink = '';
  onlinePlatform = '';
  contactEmail = '';
  contactPhone = '';
  registrationUrl = '';
  tags: string[] = [];
  tagInput = '';
  isFeatured = false;
  isActive = true;

  // Location fields
  locationName = '';
  locationAddress = '';
  locationCity = '';
  locationState = '';
  locationZipCode = '';

  // Recurrence fields
  recurrencePattern: RecurrencePattern = RecurrencePattern.None;
  recurrenceInterval = 1;
  recurrenceDayOfWeek: number | null = null;
  recurrenceDayOfMonth: number | null = null;
  recurrenceEndDate = '';

  // Options
  recurrencePatterns = [
    { value: RecurrencePattern.None, label: 'None' },
    { value: RecurrencePattern.Daily, label: 'Daily' },
    { value: RecurrencePattern.Weekly, label: 'Weekly' },
    { value: RecurrencePattern.BiWeekly, label: 'Bi-Weekly' },
    { value: RecurrencePattern.Monthly, label: 'Monthly' },
    { value: RecurrencePattern.Yearly, label: 'Yearly' }
  ];

  daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId && this.eventId !== 'new') {
      this.isEditMode = true;
      this.loadEvent();
    }
  }

  loadEvent(): void {
    if (!this.eventId) return;
    this.loading = true;

    this.apiService.getEventById(this.eventId).subscribe({
      next: (response) => {
        // API returns EventResponse directly (not wrapped in SystemResponse)
        if (response.body && response.body.Event) {
          this.populateForm(response.body.Event);
        } else {
          this.toastService.showStandardToast('Failed to load event', 400);
          this.router.navigate(['/events']);
        }
        this.loading = false;
      },
      error: () => {
        this.toastService.showStandardToast('Failed to load event', 500);
        this.loading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  populateForm(event: Event): void {
    // API returns PascalCase properties
    this.title = event.Title;
    this.summary = event.Summary;
    this.description = event.Description || '';
    this.imageUrl = event.ImageUrl || '';
    this.thumbnailUrl = event.ThumbnailUrl || '';
    this.iconName = event.IconName || '';
    this.startTime = this.formatDateTimeLocal(event.StartTime);
    this.endTime = event.EndTime ? this.formatDateTimeLocal(event.EndTime) : '';
    this.isAllDay = event.IsAllDay;
    this.isRecurring = event.IsRecurring;
    this.isOnline = event.IsOnline;
    this.onlineLink = event.OnlineLink || '';
    this.onlinePlatform = event.OnlinePlatform || '';
    this.contactEmail = event.ContactEmail || '';
    this.contactPhone = event.ContactPhone || '';
    this.registrationUrl = event.RegistrationUrl || '';
    this.tags = event.Tags || [];
    this.isFeatured = event.IsFeatured;
    this.isActive = event.IsActive;

    if (event.Location) {
      this.locationName = event.Location.name || '';
      this.locationAddress = event.Location.address || '';
      this.locationCity = event.Location.city || '';
      this.locationState = event.Location.state || '';
      this.locationZipCode = event.Location.zipCode || '';
    }

    if (event.Recurrence) {
      // API returns PascalCase properties
      this.recurrencePattern = event.Recurrence.Pattern ?? event.Recurrence.pattern;
      this.recurrenceInterval = event.Recurrence.Interval ?? event.Recurrence.interval;
      this.recurrenceDayOfWeek = event.Recurrence.DayOfWeek ?? event.Recurrence.dayOfWeek ?? null;
      this.recurrenceDayOfMonth = event.Recurrence.DayOfMonth ?? event.Recurrence.dayOfMonth ?? null;
      const endDate = event.Recurrence.EndDate ?? event.Recurrence.endDate;
      this.recurrenceEndDate = endDate ? this.formatDateTimeLocal(endDate) : '';
    }
  }

  formatDateTimeLocal(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  addTag(): void {
    const tag = this.tagInput.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  buildRequest(): CreateEventRequest | UpdateEventRequest {
    const request: CreateEventRequest = {
      title: this.title,
      summary: this.summary,
      description: this.description || undefined,
      imageUrl: this.imageUrl || undefined,
      thumbnailUrl: this.thumbnailUrl || undefined,
      iconName: this.iconName || undefined,
      startTime: new Date(this.startTime).toISOString(),
      endTime: this.endTime ? new Date(this.endTime).toISOString() : undefined,
      isAllDay: this.isAllDay,
      isRecurring: this.isRecurring,
      isOnline: this.isOnline,
      onlineLink: this.onlineLink || undefined,
      onlinePlatform: this.onlinePlatform || undefined,
      contactEmail: this.contactEmail || undefined,
      contactPhone: this.contactPhone || undefined,
      registrationUrl: this.registrationUrl || undefined,
      tags: this.tags,
      isFeatured: this.isFeatured
    };

    // Add location if not online and has location data
    if (!this.isOnline && this.locationName) {
      request.location = {
        name: this.locationName,
        address: this.locationAddress,
        city: this.locationCity,
        state: this.locationState,
        zipCode: this.locationZipCode
      };
    }

    // Add recurrence if recurring
    if (this.isRecurring && this.recurrencePattern !== RecurrencePattern.None) {
      // For weekly/bi-weekly patterns, derive dayOfWeek from startTime if not explicitly set
      let dayOfWeek = this.recurrenceDayOfWeek;
      if ((this.recurrencePattern === RecurrencePattern.Weekly ||
           this.recurrencePattern === RecurrencePattern.BiWeekly) &&
          dayOfWeek === null) {
        dayOfWeek = new Date(this.startTime).getDay();
      }

      // For monthly patterns, derive dayOfMonth from startTime if not explicitly set
      let dayOfMonth = this.recurrenceDayOfMonth;
      if (this.recurrencePattern === RecurrencePattern.Monthly && dayOfMonth === null) {
        dayOfMonth = new Date(this.startTime).getDate();
      }

      request.recurrence = {
        pattern: this.recurrencePattern,
        interval: this.recurrenceInterval,
        dayOfWeek: dayOfWeek ?? undefined,
        dayOfMonth: dayOfMonth ?? undefined,
        endDate: this.recurrenceEndDate ? new Date(this.recurrenceEndDate).toISOString() : undefined
      };
    }

    if (this.isEditMode) {
      return { ...request, isActive: this.isActive } as UpdateEventRequest;
    }

    return request;
  }

  submitForm(): void {
    if (!this.title || !this.summary || !this.startTime) {
      this.toastService.showStandardToast('Please fill in required fields', 400);
      return;
    }

    this.saving = true;
    const request = this.buildRequest();

    if (this.isEditMode && this.eventId) {
      this.apiService.updateEvent(this.eventId, request as UpdateEventRequest).subscribe({
        next: (response) => {
          if (response.body && !response.body.hasErrors) {
            this.toastService.showStandardToast('Event updated successfully', 200);
            this.router.navigate(['/events']);
          } else {
            this.toastService.showStandardToast(response.body?.errorMessage || 'Failed to update event', 400);
          }
          this.saving = false;
        },
        error: () => {
          this.toastService.showStandardToast('Failed to update event', 500);
          this.saving = false;
        }
      });
    } else {
      this.apiService.createEvent(request as CreateEventRequest).subscribe({
        next: (response) => {
          if (response.body && !response.body.hasErrors) {
            this.toastService.showStandardToast('Event created successfully', 200);
            this.router.navigate(['/events']);
          } else {
            this.toastService.showStandardToast(response.body?.errorMessage || 'Failed to create event', 400);
          }
          this.saving = false;
        },
        error: () => {
          this.toastService.showStandardToast('Failed to create event', 500);
          this.saving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}

