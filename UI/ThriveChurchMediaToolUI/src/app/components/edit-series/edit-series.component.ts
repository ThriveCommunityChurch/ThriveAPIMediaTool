import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMessagesToSeriesRequest } from 'src/app/DTO/AddMessagesToSeriesRequest';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-edit-series',
  templateUrl: './edit-series.component.html',
  styleUrls: ['./edit-series.component.scss']
})
export class EditSeriesComponent implements OnInit {

  seriesId: string | null = null;
  seriesName: string = "N/A";
  sermonSeries: SermonSeries | null = null;

  // Item form
  submitButtonMessage = "Add item";
  cancelButtonMessage = "Cancel adding item";

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.seriesId = this.route.snapshot.paramMap.get('id');
    
    if (this.seriesId) {
      this.apiService.getSeries(this.seriesId)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          console.log(resp.body);
        }
        else if (resp.body) {
          this.sermonSeries = resp.body;
          this.seriesName = resp.body.Name;
        }
      });
    }
  }

 /**
 * Method to add new Series Media.
 * @param item - `SeriesMedia`: to create
 */
  addItemEventHandler(item: SermonMessageRequest): void {
    if (item && this.seriesId) {

      let tempItems: SermonMessageRequest[] = [item];
      let request: AddMessagesToSeriesRequest = {
        MessagesToAdd: tempItems
      }

      this.apiService.addMessageToSeries(this.seriesId, request)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          console.log(resp.body);
        }
        else if (resp.body) {
          alert("Success!");
        }
      });
    }
  }

  /**
  * Handler method to close AddItem sub form from the child component.
  */
  cancelAddItemEventHandler(): void {
    // do nothing
  }

}