import { Component } from "@angular/core";
import { CreateSermonSeriesRequest } from 'src/app/DTO/CreateSermonSeriesRequest';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { ApiService } from 'src/app/services/api-service.service';
import { ToastService } from "src/app/services/toast-service.service";

@Component({
    selector: 'app-create-series',
    templateUrl: './create-series.component.html',
    styleUrls: ['./create-series.component.scss'],
    standalone: false
})
export class CreateSeriesComponent {

  // Element display booleans
  showAddItem: boolean = false;
  confirmCancelPrompt: boolean = false;

  // Form errors
  FormErrors: Record<string, unknown> = {};

  // Create series form fields
  seriesName: string;
  startDate: string;
  endDate: string | null = null;
  seriesThumbnailUrl: string;
  seriesArtUrl: string;
  mediaItemsToAdd: SermonMessageRequest[] = [];

  // services
  apiService: ApiService;
  toastService: ToastService;

  // Item form
  submitButtonMessage = "Add item";
  cancelButtonMessage = "Cancel adding item";

  constructor(apiService: ApiService,
    toastService: ToastService) {
    this.apiService = apiService;         
    this.toastService = toastService;         
  }

  submitSeries(): void {

    // if something is set as the highest date, we will use that as the date that we want... otherwise we will just use what someone set in the UI
    const endingDate = this.mediaItemsToAdd.length > 0 ? this.findEndDate() : this.endDate;
    
    const seriesRequest: CreateSermonSeriesRequest = {
      Name: this.seriesName,
      ArtUrl: this.seriesArtUrl,
      EndDate: endingDate,
      Messages: this.mediaItemsToAdd,
      Slug: this.seriesName.split(' ').join('-').toLowerCase(),
      StartDate: this.startDate,
      Thumbnail: this.seriesThumbnailUrl,
      Year: `${this.startDate.split('-')[0]}`
    };
  
    this.apiService.createSeries(seriesRequest)
    .subscribe({
      next: (resp) => {
        // display its headers
        if (resp.status > 200) {
          if (resp.status === 204) {
            this.toastService.showStandardToast("Another series is already active.", resp.status);
          }
          else {
            this.toastService.showStandardToast("An error occurred creating this series. Try again.", resp.status);
          }
        }
        else if (resp.body) {
          this.toastService.showStandardToast(`Created series with ID: ${resp.body.Id}.`, 200);
        }
      },
      error: (_error) => {
        this.toastService.showStandardToast("An error occurred creating this series. Try again.", 400);
      }
    });
  }
  
  private findEndDate(): string | null {
    let end: string | null = null;

    const itemMarkedAsEnd = this.mediaItemsToAdd.find(i => i.LastInSeries);

    if (itemMarkedAsEnd) 
    {
      end = itemMarkedAsEnd.Date;
    }

    return end;
  }

  /**
   * Method to reset the start of the form.
   */
  resetFormState(): void {
    window.location.reload();
  }

  /**
   * Method to show AddItem sub form.
   */
  showAddItemSubForm(): void {
    this.showAddItem = true
  }

  /**
   * Method to hide AddItem sub form.
   */
  hideAddItemSubForm(): void {
    this.showAddItem = false;
  }

  /**
   * Method to add new Series Media.
   * @param item - `SeriesMedia`: to create
   */
  addItemEventHandler(item: SermonMessageRequest): void {
    this.mediaItemsToAdd.push(item);
    this.hideAddItemSubForm();
  }

  /**
   * Method to remove item added to the creation object.
   * @param itemIndex - `number`: Index of the item to remove
   */
  removeItem(itemIndex: number): void {
    this.mediaItemsToAdd.splice(itemIndex, 1);
  }

  /**
   * Handler method to close AddItem sub form from the child component.
   */
  cancelAddItemEventHandler(): void {
    this.hideAddItemSubForm();
  }

}
