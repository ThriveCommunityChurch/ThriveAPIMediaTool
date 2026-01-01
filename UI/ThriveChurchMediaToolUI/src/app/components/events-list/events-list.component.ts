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

        if (!response.body.hasErrors) {
          this.events = response.body.result?.events || [];
        } else {
          this.toastService.showStandardToast(
            response.body?.errorMessage || 'Failed to load events',
            400
          );
          this.events = [];
        }
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
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.apiService.deleteEvent(event.id, false).subscribe({
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
    if (event.isActive) {
      // Deactivate
      this.apiService.deactivateEvent(event.id).subscribe({
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
      this.apiService.updateEvent(event.id, { isActive: true }).subscribe({
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

  getRecurrenceLabel(pattern?: RecurrencePattern): string {
    if (pattern === undefined || pattern === null) return '';
    const labels: { [key: number]: string } = {
      [RecurrencePattern.Daily]: 'Daily',
      [RecurrencePattern.Weekly]: 'Weekly',
      [RecurrencePattern.BiWeekly]: 'Bi-weekly',
      [RecurrencePattern.Monthly]: 'Monthly',
      [RecurrencePattern.Yearly]: 'Yearly'
    };
    return labels[pattern] || '';
  }
}

