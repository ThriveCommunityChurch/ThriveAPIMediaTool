import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { Guid } from 'src/app/shared/Guid';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  @Output() submitItemEvent = new EventEmitter;
  @Output() cancelAddItemEvent = new EventEmitter; 

  @Input() submitButtonMessage: string = "Add item";
  @Input() cancelButtonMessage: string = "Cancel adding item";

  itemAudioUrl: string | null = null;
  itemAudioDuration: number | null = null;
  itemAudioMB: number | null = null;
  itemPassageRef: string | null = null;
  itemSpeaker: string;
  itemTitle: string;
  itemDate: string;
  itemVideoURL: string | null = null;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
  }
  
  /**
   * Method to set initial values of the Item Form if the form was open for editing.
   * @param itemValues - `MediaItemDTO`: Media Item information
   */
  setInitialValues(itemValues: SermonMessageRequest): void {
    if (itemValues) {
      this.itemAudioUrl = itemValues.AudioUrl;
      this.itemAudioDuration = itemValues.AudioDuration;
      this.itemVideoURL = itemValues.VideoUrl;
      this.itemPassageRef =itemValues.PassageRef;
      this.itemSpeaker = itemValues.Speaker;
      this.itemTitle = itemValues.Title;
      this.itemDate = itemValues.Date;
    }
  }

  /**
   * Method to submit new Media Item for creation.
   */
  createMediaItem(): void {

    // construct item
    let mediaItem: SermonMessageRequest = {
      AudioUrl: this.itemAudioUrl,
      AudioDuration: this.itemAudioDuration,
      PassageRef: this.itemPassageRef,
      Speaker: !this.itemSpeaker ? 'John Roth' : this.itemSpeaker,
      Title: this.itemTitle,
      AudioFileSize: this.itemAudioMB,
      Date: this.itemDate,
      VideoUrl: this.itemVideoURL,
      MessageId: Guid.newGuid()
    };

    console.log(mediaItem);

    this.submitItemEvent.emit(mediaItem);
    this.clearForm();
  }

  getFileDuration(url: string) {

    this.http.get(url, 
    {
      responseType: 'blob'
    }).pipe(take(1)).subscribe(blob => {

      const fileReader = new FileReader();
      const audioContext = new (window.AudioContext)();

      fileReader.onloadend = () => {

          const arrayBuffer = fileReader.result as ArrayBuffer

          // Convert array buffer into audio buffer
          audioContext.decodeAudioData(arrayBuffer, (audioBuffer: AudioBuffer) => {

            // Do something with audioBuffer
            this.itemAudioDuration = audioBuffer.duration;
            console.log(this.itemAudioDuration);
          })
      }

      //Load blob
      fileReader.readAsArrayBuffer(blob);
      
    });
  }

  /**
   * Method to clear all form fields.
   */
  clearForm(): void {
    this.itemAudioUrl = null;
    this.itemAudioDuration = null;
    this.itemAudioMB = null;
    this.itemPassageRef = null;
    this.itemSpeaker = "";
    this.itemTitle = "";
    this.itemDate = "";
    this.itemVideoURL = null;
  }

  change(event: any){

    if (event.target.value && event.target.value.includes("thrive-fl.org/wp-content/uploads/")) {
      this.getFileDuration(event.target.value);
    }
    else {
      console.log(event);
    }
  }

  // TS
  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      var file = fileList[0];

      this.itemAudioMB = file.size / Math.pow(1024, 2);
      console.log(this.itemAudioMB);
    }
  }

  /**
   * Method to transform a string of comma delimited strings into an array of strings.
   * @param stringField - `string`: String to transform into an array of strings.
   */
  transformStringToArray(stringField: string): string[] {
    return stringField.split(", ");
  }

  /**
   * Method to hide sub form section.
   */
  hideAddItemSubForm(): void {
    this.cancelAddItemEvent.emit();
  }
}