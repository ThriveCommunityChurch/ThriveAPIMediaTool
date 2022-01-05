import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CreateSermonSeriesRequest } from 'src/app/DTO/CreateSermonSeriesRequest';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { ApiService } from 'src/app/services/api-service.service';

declare let $: any;

@Component({
  selector: 'app-create-series',
  templateUrl: './create-series.component.html',
  styleUrls: ['./create-series.component.scss']
})
export class CreateSeriesComponent implements OnInit {

  // Element display booleans
  showAddItem: boolean = false;
  confirmCancelPrompt: boolean = false;

  // Form errors
  FormErrors: any = {};

  // Create series form fields
  seriesName: string;
  startDate: string;
  endDate: string;
  seriesThumbnailUrl: string;
  seriesArtUrl: string;
  mediaItemsToAdd: SermonMessageRequest[] = [];

  // services
  apiService: ApiService;


  // Item form
  submitButtonMessage = "Add item";
  cancelButtonMessage = "Cancel adding item";

  constructor(apiService: ApiService) {
    this.apiService = apiService;         
  }

  ngOnInit(): void { }

  submitSeries(): void {

    console.log(this.seriesName);
    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.seriesThumbnailUrl);
    console.log(this.seriesArtUrl);
    console.log(this.mediaItemsToAdd);

    let seriesRequest: CreateSermonSeriesRequest = {
      Name: this.seriesName,
      ArtUrl: this.seriesArtUrl,
      EndDate: this.endDate,
      Messages: this.mediaItemsToAdd,
      Slug: this.seriesName.replace(" ", "-"),
      StartDate: this.startDate,
      Thumbnail: this.seriesThumbnailUrl,
      Year: `${this.startDate.split('-')[0]}`
    };

    console.log(seriesRequest);
 
    // this.apiService.createSeries(seriesRequest)
    // // clone the data object, using its known Config shape
    // .subscribe(resp => {
    //   // display its headers

    //   if (resp.status > 200) {
    //     console.log(resp.body);
    //   }
    //   else if (resp.body) {
    //     alert(`Created series with ID: ${resp.body.Id}.`);
    //   }
    // });
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
