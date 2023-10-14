import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ToastMessage } from 'src/app/Domain/ToastMessage';
import { ToastService } from 'src/app/services/toast-service.service';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss']
})
export class ToastMessageComponent {

  @ViewChildren('toastElement') toastElements: QueryList<ElementRef>;
  private toastsSubscription: Subscription;

  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastsSubscription = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap Toast for each toast element
    this.toastElements.changes.subscribe((changes: QueryList<ElementRef>) => {
      changes.forEach((elementRef: ElementRef) => {
        new bootstrap.Toast(elementRef.nativeElement).show();
      });
    });
  }

  ngOnDestroy(): void {
    this.toastsSubscription.unsubscribe();
  }

  removeToast(toast: ToastMessage): void {
    this.toastService.remove(toast);
  }

}
