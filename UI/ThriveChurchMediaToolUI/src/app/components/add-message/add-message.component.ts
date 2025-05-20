import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMessagesToSeriesRequest } from 'src/app/DTO/AddMessagesToSeriesRequest';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { ApiService } from 'src/app/services/api-service.service';
import { ToastService } from 'src/app/services/toast-service.service';
import { ToastMessage } from '../../Domain/ToastMessage'
import { ToastMessageType } from '../../Domain/ToastMessageType'

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent implements OnInit {

  seriesId: string | null = null;
  seriesName: string = "N/A";
  sermonSeries: SermonSeries;

  // Item form
  submitButtonMessage = "Add message";
  cancelButtonMessage = "Cancel adding message";

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private apiService: ApiService,
    private toastService: ToastService
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
 * Method to add new Series Message.
 * @param item - `SermonMessageRequest`: to create
 */
  addItemEventHandler(item: SermonMessageRequest): void {
    if (item && this.seriesId && this.sermonSeries) {

      if (item.LastInSeries === true) {

        this.sermonSeries.EndDate = item.Date;

        this.apiService.editSeries(this.seriesId, this.sermonSeries)      
        // clone the data object, using its known Config shape
        .subscribe(resp => {
          // display its headers
  
          if (resp.status > 200) {
            this.toastService.showStandardToast("An error occurred updating this series. Try again.", resp.status);
          }
          else if (resp.body) {
            this.toastService.showStandardToast("Series was successfully completed.", 200);
          }
        }, (error: any) => {
          this.toastService.showStandardToast("An error occurred adding this message. Try again.", 400);
        });
      }

      let tempItems: SermonMessageRequest[] = [item];
      let request: AddMessagesToSeriesRequest = {
        MessagesToAdd: tempItems
      }

      this.apiService.addMessageToSeries(this.seriesId, request)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          this.toastService.showStandardToast("An error occurred adding this message. Try again.", resp.status);
        }
        else if (resp.body) {
          this.toastService.showStandardToast("New message was successfully added.", 200);
        }
      }, (error: any) => {
          this.toastService.showStandardToast("An error occurred adding this message. Try again.", 400);
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
