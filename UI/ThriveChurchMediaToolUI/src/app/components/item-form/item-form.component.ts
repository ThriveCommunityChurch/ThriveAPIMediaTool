import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  @Output() submitItemEvent = new EventEmitter;
  @Output() cancelAddItemEvent = new EventEmitter; 
  @Output() saveFieldsEvent = new EventEmitter;

  @Input() submitButtonMessage: string = "Add item";
  @Input() cancelButtonMessage: string = "Cancel adding item";

  itemAudioUrl: string | null = null;
  itemAudioDuration: number | null = null;
  itemAudioMB: number | null = null;
  itemPassageRef: string | null = null;
  itemSpeaker: string | null;
  itemTitle: string;
  itemDate: string;
  itemVideoURL: string | null = null;

  file: File;

  constructor() { }
  
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
      Speaker: this.itemSpeaker ?? "John Roth",
      Title: this.itemTitle,
      AudioFileSize: this.itemAudioMB,
      Date: this.itemDate,
      VideoUrl: this.itemVideoURL
    };

    this.submitItemEvent.emit(mediaItem);
    this.clearForm();
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.file = files[0];
    }

    var reader = new FileReader();
    var audio = document.createElement('audio');
    reader.onload = function (e) {
        audio.src = `${e.target?.result}`;
        audio.addEventListener('durationchange', function() {
            console.log("durationchange: " + audio.duration);
        },false);

        audio.addEventListener('onerror', function() {
            alert("Cannot get duration of this file.");
        }, false);
    };
    reader.readAsDataURL(this.file);
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