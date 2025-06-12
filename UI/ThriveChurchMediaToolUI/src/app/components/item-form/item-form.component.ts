import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { DurationPipe } from 'src/app/pipes/DurationPipe';
import { FileSizePipe } from 'src/app/pipes/FileSizePipe';

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
  @Input() existingMessage: SermonMessage | null = null;

  private _checked: boolean = false;

  itemAudioUrl: string | null = null;
  durationLoadingText: string | null = "Waiting on file...";
  loadingDuration: boolean = false;
  itemAudioDuration: number | null = null;
  itemAudioMB: number | null = null;
  itemPassageRef: string | null = null;
  itemSpeaker: string;
  itemTitle: string;
  itemDate: string;
  itemVideoURL: string | null = null;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    if (this.existingMessage) {
      this.populateFormWithExistingMessage();
    }
  }

  populateFormWithExistingMessage(): void {
    if (!this.existingMessage) return;

    this.itemTitle = this.existingMessage.Title;
    this.itemSpeaker = this.existingMessage.Speaker;
    this.itemAudioUrl = this.existingMessage.AudioUrl;
    this.itemAudioDuration = this.existingMessage.AudioDuration;
    this.itemAudioMB = this.existingMessage.AudioFileSize;
    this.itemVideoURL = this.existingMessage.VideoUrl;
    this.itemPassageRef = this.existingMessage.PassageRef;

    // Format date for input field (YYYY-MM-DD)
    if (this.existingMessage.Date) {
      const date = new Date(this.existingMessage.Date);
      this.itemDate = date.toISOString().split('T')[0];
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
      LastInSeries: this._checked
    };

    this.submitItemEvent.emit(mediaItem);
    if (!this.existingMessage) {
      this.clearForm();
    }
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
    this._checked = false;
  }

  // TS
  uploadFile(event: Event) {
    this.loadingDuration = true;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      var file = fileList[0];

      this.itemAudioMB = file.size / Math.pow(1024, 2);

      const fileReader = new FileReader();
      const audioContext = new (window.AudioContext)();

      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer

        // Convert array buffer into audio buffer
        audioContext.decodeAudioData(arrayBuffer).then((audioBuffer: AudioBuffer) => {
          this.itemAudioDuration = audioBuffer.duration;
          this.loadingDuration = false;
        });
      }

      //Load blob
      fileReader.readAsArrayBuffer(file);
    }
  }

  changeStatus(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this._checked = element.checked;
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