import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service.service';
import { EventSummary, RecurrencePattern } from '../../DTO/events';
import { ToastService } from '../../services/toast-service.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  standalone: false
})
export class EventsListComponent implements OnInit {
  events: EventSummary[] = [];
  loading = true;
  includeInactive = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.apiService.getAllEvents(this.includeInactive).subscribe({
      next: (response) => {
        // Handle 204 No Content - no events configured
        if (response.status === 204 || !response.body) {
          this.events = [];
          this.loading = false;
          return;
        }

        // API returns AllEventsResponse directly with PascalCase properties
        this.events = response.body.Events || [];
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showStandardToast('Failed to load events', 500);
        this.events = [];
        this.loading = false;
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/events/new']);
  }

  editEvent(id: string): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  viewEvent(id: string): void {
    this.router.navigate(['/events', id]);
  }

  deleteEvent(event: EventSummary): void {
    if (confirm(`Are you sure you want to delete "${event.Title}"?`)) {
      this.apiService.deleteEvent(event.Id, false).subscribe({
        next: (response) => {
          if (response.body && !response.body.hasErrors) {
            this.toastService.showStandardToast('Event deleted successfully', 200);
            this.loadEvents();
          } else {
            this.toastService.showStandardToast(
              response.body?.errorMessage || 'Failed to delete event',
              400
            );
          }
        },
        error: () => {
          this.toastService.showStandardToast('Failed to delete event', 500);
        }
      });
    }
  }

  toggleEventStatus(event: EventSummary): void {
    if (event.IsActive) {
      // Deactivate
      this.apiService.deactivateEvent(event.Id).subscribe({
        next: (response) => {
          if (response.body && !response.body.hasErrors) {
            this.toastService.showStandardToast('Event deactivated', 200);
            this.loadEvents();
          } else {
            this.toastService.showStandardToast('Failed to update event', 400);
          }
        },
        error: () => {
          this.toastService.showStandardToast('Failed to update event', 500);
        }
      });
    } else {
      // Reactivate
      this.apiService.updateEvent(event.Id, { isActive: true }).subscribe({
        next: (response) => {
          if (response.body && !response.body.hasErrors) {
            this.toastService.showStandardToast('Event activated', 200);
            this.loadEvents();
          } else {
            this.toastService.showStandardToast('Failed to update event', 400);
          }
        },
        error: () => {
          this.toastService.showStandardToast('Failed to update event', 500);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  getDayName(dayOfWeek?: number): string {
    if (dayOfWeek === undefined || dayOfWeek === null) return '';
    const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
    return days[dayOfWeek] || '';
  }

  getRecurrenceDescription(event: EventSummary): string {
    if (!event.IsRecurring || !event.RecurrencePattern) return '';

    const dayName = this.getDayName(event.RecurrenceDayOfWeek);
    const time = this.formatTime(event.StartTime);

    switch (event.RecurrencePattern) {
      case 'Daily':
        return `Daily at ${time}`;
      case 'Weekly':
        return dayName ? `${dayName} at ${time}` : `Weekly at ${time}`;
      case 'BiWeekly':
        return dayName ? `Every other ${dayName.slice(0, -1)} at ${time}` : `Bi-weekly at ${time}`;
      case 'Monthly':
        return `Monthly at ${time}`;
      case 'Yearly':
        return `Yearly at ${time}`;
      default:
        return event.RecurrencePattern;
    }
  }
}

