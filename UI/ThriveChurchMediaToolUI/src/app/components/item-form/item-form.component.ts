import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { SermonMessageRequest } from 'src/app/DTO/SermonMessageRequest';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { MessageTag, getMessageTagLabel, getMessageTagName, getMessageTagFromName } from 'src/app/DTO/MessageTag';
import { DurationPipe } from 'src/app/pipes/DurationPipe';
import { FileSizePipe } from 'src/app/pipes/FileSizePipe';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
    selector: 'app-item-form',
    templateUrl: './item-form.component.html',
    styleUrls: ['./item-form.component.scss'],
    standalone: false
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
  uploadingFile: boolean = false;
  itemAudioDuration: number | null = null;
  itemAudioMB: number | null = null;
  validationMessage: string | null = null;
  uploadMessage: string | null = null;
  uploadSuccess: boolean = false;
  selectedFile: File | null = null;
  itemPassageRef: string | null = null;
  itemSpeaker: string;
  itemTitle: string;
  itemDate: string;
  itemVideoURL: string | null = null;
  itemPodcastImageUrl: string | null = null;
  itemPodcastTitle: string | null = null;
  itemSummary: string | null = null;
  itemTags: MessageTag[] = [];
  itemWaveformData: string = '';  // Store as string for textarea input
  waveformValidationMessage: string | null = null;

  // Available tags for the dropdown
  availableTags: { value: MessageTag; label: string }[] = [];

  constructor(private http: HttpClient, private apiService: ApiService) {
    // Initialize available tags (excluding Unknown)
    this.availableTags = Object.values(MessageTag)
      .filter(value => typeof value === 'number' && value !== MessageTag.Unknown)
      .map(value => ({
        value: value as MessageTag,
        label: getMessageTagLabel(value as MessageTag)
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  
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
    this.itemPodcastImageUrl = this.existingMessage.PodcastImageUrl;
    this.itemPodcastTitle = this.existingMessage.PodcastTitle;
    this.itemPassageRef = this.existingMessage.PassageRef;
    this.itemSummary = this.existingMessage.Summary;
    // Convert tag string names from API to enum values for ng-select
    this.itemTags = (this.existingMessage.Tags || []).map(tagName => getMessageTagFromName(tagName));

    // Convert waveform data array to JSON string for textarea
    if (this.existingMessage.WaveformData && this.existingMessage.WaveformData.length > 0) {
      this.itemWaveformData = JSON.stringify(this.existingMessage.WaveformData, null, 2);
    }

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
    // Parse waveform data
    const parsedWaveformData = this.parseWaveformData();

    // construct item - convert MessageTag enum values to string names for API
    let mediaItem: SermonMessageRequest = {
      AudioUrl: this.itemAudioUrl,
      AudioDuration: this.itemAudioDuration,
      PassageRef: this.itemPassageRef,
      Speaker: !this.itemSpeaker ? 'John Roth' : this.itemSpeaker,
      Title: this.itemTitle,
      Summary: this.itemSummary,
      AudioFileSize: this.itemAudioMB,
      Date: this.itemDate,
      VideoUrl: this.itemVideoURL,
      PodcastImageUrl: this.itemPodcastImageUrl,
      PodcastTitle: this.itemPodcastTitle,
      Tags: this.itemTags.map(tag => getMessageTagName(tag)),
      WaveformData: parsedWaveformData,
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
    this.itemPodcastImageUrl = null;
    this.itemPodcastTitle = null;
    this.itemSummary = null;
    this.itemTags = [];
    this.itemWaveformData = '';
    this.waveformValidationMessage = null;
    this._checked = false;
  }

  // TS - File selection and validation
  selectFile(event: Event) {
    // Clear previous messages
    this.validationMessage = null;
    this.uploadMessage = null;
    this.uploadSuccess = false;
    this.itemAudioUrl = null;
    this.selectedFile = null;

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      var file = fileList[0];

      // Validate file type - ONLY MP3 files allowed
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (fileExtension !== '.mp3') {
        this.validationMessage = "Invalid file type. Only MP3 files are allowed.";
        return;
      }

      // Validate file name format: YYYY-MM-DD-Description.mp3
      if (!this.isValidFileName(file.name)) {
        this.validationMessage = "Invalid file name format. Please use: YYYY-MM-DD-Description.mp3 (e.g., 2025-03-15-Recording.mp3)";
        return;
      }

      // Validate file size (50MB limit)
      const maxSizeMB = 50;
      this.itemAudioMB = file.size / Math.pow(1024, 2);
      if (this.itemAudioMB > maxSizeMB) {
        this.validationMessage = `File too large. Maximum size is ${maxSizeMB}MB.`;
        return;
      }

      // File is valid, store it and process duration
      this.selectedFile = file;
      this.loadingDuration = true;
      this.processAudioFile(file);
    }
  }

  // Process audio file to get duration
  private processAudioFile(file: File) {
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

  // Upload file to S3 (called by button click)
  uploadToS3() {
    if (!this.selectedFile) {
      this.uploadMessage = "No file selected for upload.";
      this.uploadSuccess = false;
      return;
    }

    this.uploadingFile = true;
    this.uploadMessage = null;

    this.apiService.uploadAudioFile(this.selectedFile).subscribe({
      next: (response) => {
        // Ensure clean state reset
        this.uploadingFile = false;
        this.loadingDuration = false;

        // The API returns a plain string (the URL), not an object with a url property
        if (response.body && response.body.trim().length > 0) {
          this.itemAudioUrl = response.body;
          this.uploadMessage = "File uploaded successfully to S3!";
          this.uploadSuccess = true;
        } else {
          this.uploadMessage = "Upload failed: Invalid response from server.";
          this.uploadSuccess = false;
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);

        // Ensure clean state reset
        this.uploadingFile = false;
        this.loadingDuration = false;
        this.uploadSuccess = false;

        // Provide user-friendly error messages
        if (error.status === 400) {
          this.uploadMessage = error.error?.error || "File validation failed on server.";
        } else if (error.status === 413) {
          this.uploadMessage = "File too large for upload.";
        } else if (error.status === 0) {
          this.uploadMessage = "Network error. Please check your connection.";
        } else {
          this.uploadMessage = "Upload failed. Please try again.";
        }
      }
    });
  }

  // Clear selected file and reset state
  clearFile() {
    this.selectedFile = null;
    this.itemAudioUrl = null;
    this.itemAudioDuration = null;
    this.itemAudioMB = null;
    this.validationMessage = null;
    this.uploadMessage = null;
    this.uploadSuccess = false;
    this.loadingDuration = false;
    this.uploadingFile = false;
    this.durationLoadingText = "Waiting on file...";

    // Clear the file input
    const fileInput = document.getElementById('audioFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  changeStatus(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this._checked = element.checked;
  }

  /**
   * Get the label for a tag value
   */
  getTagLabel(tagValue: MessageTag): string {
    return getMessageTagLabel(tagValue);
  }

  /**
   * Remove a tag from the selected tags array
   */
  removeTag(tagValue: MessageTag): void {
    this.itemTags = this.itemTags.filter(tag => tag !== tagValue);
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



  /**
   * Validates if the filename follows the required format: YYYY-MM-DD-Description.mp3
   * @param fileName The filename to validate
   * @returns true if valid, false otherwise
   */
  /**
   * Get the button text with icon
   */
  getButtonText(): string {
    if (this.uploadingFile) {
      return 'Uploading...';
    } else if (this.loadingDuration) {
      return 'Processing...';
    } else {
      return '<i class="fas fa-cloud-upload-alt me-2"></i>Upload';
    }
  }

  private isValidFileName(fileName: string): boolean {
    // Remove the .mp3 extension for validation
    const nameWithoutExtension = fileName.replace(/\.mp3$/i, '');

    // Regex pattern for YYYY-MM-DD-Description format
    // - YYYY: 4 digits (year)
    // - MM: 2 digits (01-12)
    // - DD: 2 digits (01-31)
    // - Description: at least one character, can contain letters, numbers, hyphens, spaces
    const pattern = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-(.+)$/;

    const match = nameWithoutExtension.match(pattern);
    if (!match) {
      return false;
    }

    const [, year, month, day, description] = match;

    // Additional validation: check if it's a valid date
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const isValidDate = date.getFullYear() == parseInt(year) &&
                       date.getMonth() == parseInt(month) - 1 &&
                       date.getDate() == parseInt(day);

    // Check if description is not empty after trimming
    const isValidDescription = description.trim().length > 0;

    return isValidDate && isValidDescription;
  }

  /**
   * Parse waveform data from textarea input
   * Accepts JSON array format with brackets: [0.1, 0.2, 0.3, ...]
   */
  private parseWaveformData(): number[] | null {
    // Clear previous validation message
    this.waveformValidationMessage = null;

    // If empty, return null (optional field)
    if (!this.itemWaveformData || this.itemWaveformData.trim().length === 0) {
      return null;
    }

    try {
      // Parse the JSON array
      const parsed = JSON.parse(this.itemWaveformData.trim());

      // Validate it's an array
      if (!Array.isArray(parsed)) {
        this.waveformValidationMessage = 'Waveform data must be a JSON array (e.g., [0.1, 0.2, 0.3])';
        return null;
      }

      // Validate all elements are numbers
      if (!parsed.every(item => typeof item === 'number')) {
        this.waveformValidationMessage = 'All waveform values must be numbers';
        return null;
      }

      // Validate all numbers are between 0 and 1
      if (!parsed.every(item => item >= 0 && item <= 1)) {
        this.waveformValidationMessage = 'All waveform values must be between 0 and 1';
        return null;
      }

      return parsed;
    } catch (error) {
      this.waveformValidationMessage = 'Invalid JSON format. Please paste a valid array like: [0.1, 0.2, 0.3]';
      return null;
    }
  }
}