import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { UpdateMessagesInSermonSeriesRequest } from 'src/app/DTO/UpdateMessagesInSermonSeriesRequest';
import { ApiService } from 'src/app/services/api-service.service';
import { ToastService } from 'src/app/services/toast-service.service';

@Component({
    selector: 'app-edit-message',
    templateUrl: './edit-message.component.html',
    styleUrls: ['./edit-message.component.scss'],
    standalone: false
})
export class EditMessageComponent implements OnInit {

  seriesId: string | null = null;
  messageId: string | null = null;
  isLoading: boolean = true;
  sermonSeries: SermonSeries | null = null;
  message: SermonMessage | null = null;
  seriesName: string = '';

  // Form button text
  submitButtonMessage = "Update Message";
  cancelButtonMessage = "Cancel";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.seriesId = this.route.snapshot.paramMap.get('seriesId');
    this.messageId = this.route.snapshot.paramMap.get('messageId');

    if (this.seriesId && this.messageId) {
      this.loadSeriesAndMessage();
    }
  }

  loadSeriesAndMessage(): void {
    if (!this.seriesId || !this.messageId) return;

    this.apiService.getSeries(this.seriesId)
      .subscribe(resp => {
        if (resp.status > 200) {
          this.toastService.showStandardToast("An error occurred loading the series. Try again.", resp.status);
          this.isLoading = false;
        }
        else if (resp.body) {
          this.sermonSeries = resp.body;
          this.seriesName = resp.body.Name;
          
          // Find the specific message
          this.message = resp.body.Messages.find(m => m.MessageId === this.messageId) || null;
          
          if (!this.message) {
            this.toastService.showStandardToast("Message not found.", 404);
            this.router.navigate(['/view', this.seriesId]);
            return;
          }
          
          this.isLoading = false;
        }
      }, (error: any) => {
        this.toastService.showStandardToast("An error occurred loading the series. Try again.", 400);
        this.isLoading = false;
      });
  }

  updateMessageEventHandler(updatedMessage: SermonMessageRequest): void {
    if (!this.messageId) return;

    const updateRequest: UpdateMessagesInSermonSeriesRequest = {
      Message: updatedMessage
    };

    this.apiService.updateMessage(this.messageId, updateRequest)
      .subscribe(resp => {
        if (resp.status > 200) {
          this.toastService.showStandardToast("An error occurred updating the message. Try again.", resp.status);
        }
        else if (resp.body) {
          this.toastService.showStandardToast("Message was successfully updated.", 200);
          // Navigate back to series view
          this.router.navigate(['/view', this.seriesId]);
        }
      }, (error: any) => {
        this.toastService.showStandardToast("An error occurred updating the message. Try again.", 400);
      });
  }

  cancelEditEventHandler(): void {
    // Navigate back to series view
    this.router.navigate(['/view', this.seriesId]);
  }
}
