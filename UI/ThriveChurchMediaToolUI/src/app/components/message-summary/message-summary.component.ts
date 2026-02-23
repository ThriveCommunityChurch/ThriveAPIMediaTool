import { Component, Input, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { SermonMessage, TranscriptFeature } from 'src/app/DTO/SermonMessage';
import { TranscriptResponse, SermonNotesResponse, StudyGuideResponse } from 'src/app/DTO/TranscriptResponse';
import { MessageTag, getMessageTagLabel, getMessageTagFromName } from 'src/app/DTO/MessageTag';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast-service.service';
import WaveSurfer from 'wavesurfer.js';

// Tab type for the content section
type ContentTab = 'transcript' | 'notes' | 'studyGuide';

@Component({
    selector: 'app-message-summary',
    templateUrl: './message-summary.component.html',
    styleUrls: ['./message-summary.component.scss'],
    standalone: false
})
export class MessageSummaryComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() message: SermonMessage;
  @Input() seriesId: string = "";
  encodedPassage: string = "";
  isAuthenticated$: Observable<boolean>;
  waveformId: string = '';
  private wavesurfer: WaveSurfer | null = null;

  // Content section state
  isContentExpanded: boolean = false;
  activeTab: ContentTab = 'transcript';

  // Transcript state
  transcript: TranscriptResponse | null = null;
  isTranscriptLoading: boolean = false;
  isTranscriptExpanded: boolean = false;
  transcriptError: string | null = null;
  hasCheckedTranscript: boolean = false;

  // Notes state
  notes: SermonNotesResponse | null = null;
  isNotesLoading: boolean = false;
  notesError: string | null = null;
  hasCheckedNotes: boolean = false;

  // Study Guide state
  studyGuide: StudyGuideResponse | null = null;
  isStudyGuideLoading: boolean = false;
  studyGuideError: string | null = null;
  hasCheckedStudyGuide: boolean = false;

  // Infinite scroll for transcript
  @ViewChild('transcriptContainer') transcriptContainer!: ElementRef<HTMLDivElement>;
  displayedTranscriptChunks: string[] = [];
  private transcriptChunks: string[] = [];
  private currentChunkIndex: number = 0;
  private readonly CHUNK_SIZE = 2000; // characters per chunk
  private readonly CHUNKS_PER_LOAD = 3;
  private scrollSubject = new Subject<void>();
  isLoadingMoreTranscript: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {
    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(authState => authState.isAuthenticated)
    );

    // Setup debounced scroll handler
    this.scrollSubject.pipe(
      debounceTime(100)
    ).subscribe(() => this.loadMoreTranscriptChunks());
  }

  ngOnInit(): void {
    if (this.message.PassageRef) {
      this.encodedPassage = this.message.PassageRef.replace(/ /g, '+').replace(/:/g, '%3A');
    }

    // Generate unique ID for waveform container
    this.waveformId = `waveform-${this.message.MessageId}`;
  }

  ngAfterViewInit(): void {
    // Initialize waveform if data exists
    // Use setTimeout to ensure DOM is fully rendered
    if (this.hasWaveformData()) {
      setTimeout(() => {
        this.initializeWaveform();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Clean up wavesurfer instance
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
    }
    // Clean up scroll subject
    this.scrollSubject.complete();
  }

  /**
   * Check if message has waveform data
   */
  hasWaveformData(): boolean {
    return !!(this.message.WaveformData && this.message.WaveformData.length > 0);
  }

  /**
   * Initialize WaveSurfer with pre-computed peaks data
   */
  private initializeWaveform(): void {
    try {
      const container = document.getElementById(this.waveformId);
      if (!container) {
        console.warn(`Waveform container not found: ${this.waveformId}`);
        return;
      }

      if (!this.message.WaveformData || this.message.WaveformData.length === 0) {
        console.warn('No waveform data available');
        return;
      }

      // Get computed styles to access CSS variables
      const computedStyles = getComputedStyle(document.documentElement);
      const waveColor = computedStyles.getPropertyValue('--color-waveform-wave').trim() || '#4a90e2';
      const progressColor = computedStyles.getPropertyValue('--color-waveform-progress').trim() || '#1e3a8a';

      this.wavesurfer = WaveSurfer.create({
        container: `#${this.waveformId}`,
        height: 50,
        waveColor: waveColor,
        progressColor: progressColor,
        cursorWidth: 0,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        interact: false, // Non-interactive, purely for visualization
        hideScrollbar: true,
        normalize: true,
        peaks: [this.message.WaveformData], // Pre-computed waveform data
        duration: this.message.AudioDuration || 0
      });
    } catch (error) {
      console.error('Error initializing waveform:', error);
    }
  }

  copyMessageId(): void {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.message.MessageId).catch(() => {
        this.fallbackCopyTextToClipboard(this.message.MessageId);
      });
    } else {
      this.fallbackCopyTextToClipboard(this.message.MessageId);
    }
  }

  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      // Silent fail
    }

    document.body.removeChild(textArea);
  }

  editMessage(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.showError('You must be logged in to edit messages.');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/view/${this.seriesId}/edit/${this.message.MessageId}` }
      });
      return;
    }

    if (this.seriesId && this.message.MessageId) {
      this.router.navigate(['/view', this.seriesId, 'edit', this.message.MessageId]);
    }
  }

  /**
   * Get the human-readable label for a message tag string name
   */
  getTagLabel(tagName: string): string {
    const tagEnum = getMessageTagFromName(tagName);
    return getMessageTagLabel(tagEnum);
  }

  // ===========================================
  // Feature Availability Methods
  // ===========================================

  /**
   * Check if a specific transcript feature is available
   */
  hasFeature(feature: TranscriptFeature): boolean {
    return this.message.AvailableTranscriptFeatures?.includes(feature) ?? false;
  }

  /**
   * Check if any transcript features are available
   */
  hasAnyFeatures(): boolean {
    return (this.message.AvailableTranscriptFeatures?.length ?? 0) > 0;
  }

  /**
   * Get the list of available tabs based on features
   */
  getAvailableTabs(): ContentTab[] {
    const tabs: ContentTab[] = [];
    if (this.hasFeature('Transcript')) tabs.push('transcript');
    if (this.hasFeature('Notes')) tabs.push('notes');
    if (this.hasFeature('StudyGuide')) tabs.push('studyGuide');
    return tabs;
  }

  // ===========================================
  // Content Section Toggle and Tab Methods
  // ===========================================

  /**
   * Toggle the content section visibility
   */
  toggleContent(): void {
    if (!this.isContentExpanded) {
      this.isContentExpanded = true;
      // Load the first available tab's content
      const availableTabs = this.getAvailableTabs();
      if (availableTabs.length > 0) {
        this.selectTab(availableTabs[0]);
      }
    } else {
      this.isContentExpanded = false;
    }
  }

  /**
   * Select a tab and load its content if needed
   */
  selectTab(tab: ContentTab): void {
    this.activeTab = tab;

    switch (tab) {
      case 'transcript':
        if (!this.hasCheckedTranscript) {
          this.loadTranscript();
        }
        break;
      case 'notes':
        if (!this.hasCheckedNotes) {
          this.loadNotes();
        }
        break;
      case 'studyGuide':
        if (!this.hasCheckedStudyGuide) {
          this.loadStudyGuide();
        }
        break;
    }
  }

  /**
   * Check if content is currently loading for any tab
   */
  isLoading(): boolean {
    return this.isTranscriptLoading || this.isNotesLoading || this.isStudyGuideLoading;
  }

  /**
   * Toggle transcript visibility and load if needed
   */
  toggleTranscript(): void {
    if (!this.hasCheckedTranscript) {
      this.loadTranscript();
    } else {
      this.isTranscriptExpanded = !this.isTranscriptExpanded;
    }
  }

  /**
   * Load transcript from API
   */
  private loadTranscript(): void {
    if (!this.message.MessageId) return;

    this.isTranscriptLoading = true;
    this.transcriptError = null;

    this.apiService.getMessageTranscript(this.message.MessageId).subscribe({
      next: (response) => {
        this.isTranscriptLoading = false;
        this.hasCheckedTranscript = true;
        if (response.body) {
          this.transcript = response.body;
          this.initializeTranscriptChunks();
          this.isTranscriptExpanded = true;
        }
      },
      error: (error) => {
        this.isTranscriptLoading = false;
        this.hasCheckedTranscript = true;
        if (error.status === 404) {
          this.transcriptError = 'No transcript available for this message.';
        } else {
          this.transcriptError = 'Failed to load transcript.';
        }
      }
    });
  }

  /**
   * Load sermon notes from API
   */
  private loadNotes(): void {
    if (!this.message.MessageId) return;

    this.isNotesLoading = true;
    this.notesError = null;

    this.apiService.getSermonNotes(this.message.MessageId).subscribe({
      next: (response) => {
        this.isNotesLoading = false;
        this.hasCheckedNotes = true;
        if (response.body) {
          this.notes = response.body;
        }
      },
      error: (error) => {
        this.isNotesLoading = false;
        this.hasCheckedNotes = true;
        if (error.status === 404) {
          this.notesError = 'Sermon notes not yet available for this message.';
        } else {
          this.notesError = 'Failed to load sermon notes.';
        }
      }
    });
  }

  /**
   * Load study guide from API
   */
  private loadStudyGuide(): void {
    if (!this.message.MessageId) return;

    this.isStudyGuideLoading = true;
    this.studyGuideError = null;

    this.apiService.getStudyGuide(this.message.MessageId).subscribe({
      next: (response) => {
        this.isStudyGuideLoading = false;
        this.hasCheckedStudyGuide = true;
        if (response.body) {
          this.studyGuide = response.body;
        }
      },
      error: (error) => {
        this.isStudyGuideLoading = false;
        this.hasCheckedStudyGuide = true;
        if (error.status === 404) {
          this.studyGuideError = 'Study guide not yet available for this message.';
        } else {
          this.studyGuideError = 'Failed to load study guide.';
        }
      }
    });
  }

  /**
   * Check if transcript is available (has been loaded successfully)
   */
  hasTranscript(): boolean {
    return this.transcript !== null;
  }

  /**
   * Check if notes are available (has been loaded successfully)
   */
  hasNotes(): boolean {
    return this.notes !== null;
  }

  /**
   * Check if study guide is available (has been loaded successfully)
   */
  hasStudyGuide(): boolean {
    return this.studyGuide !== null;
  }

  /**
   * Get devotional text split into paragraphs for proper rendering
   */
  getDevotionalParagraphs(): string[] {
    if (!this.studyGuide?.Devotional) return [];
    return this.splitIntoParagraphs(this.studyGuide.Devotional);
  }

  /**
   * Get notes summary split into paragraphs for proper rendering
   */
  getNotesSummaryParagraphs(): string[] {
    if (!this.notes?.Summary) return [];
    return this.splitIntoParagraphs(this.notes.Summary);
  }

  /**
   * Get study guide summary split into paragraphs for proper rendering
   */
  getStudyGuideSummaryParagraphs(): string[] {
    if (!this.studyGuide?.Summary) return [];
    return this.splitIntoParagraphs(this.studyGuide.Summary);
  }

  /**
   * Split text into paragraphs by double newlines
   */
  private splitIntoParagraphs(text: string): string[] {
    return text.split(/\n\n+/).filter(p => p.trim().length > 0);
  }

  /**
   * Split transcript into chunks for progressive rendering
   */
  private initializeTranscriptChunks(): void {
    if (!this.transcript?.FullText) return;

    const text = this.transcript.FullText;
    this.transcriptChunks = [];
    this.displayedTranscriptChunks = [];
    this.currentChunkIndex = 0;

    // Split by word boundaries to avoid cutting words
    let startIndex = 0;
    while (startIndex < text.length) {
      let endIndex = Math.min(startIndex + this.CHUNK_SIZE, text.length);

      // Find the last space before the chunk size limit
      if (endIndex < text.length) {
        const lastSpace = text.lastIndexOf(' ', endIndex);
        if (lastSpace > startIndex) {
          endIndex = lastSpace + 1;
        }
      }

      this.transcriptChunks.push(text.substring(startIndex, endIndex));
      startIndex = endIndex;
    }

    // Load initial chunks
    this.loadMoreTranscriptChunks();
  }

  /**
   * Load more transcript chunks when scrolling
   */
  private loadMoreTranscriptChunks(): void {
    if (this.isLoadingMoreTranscript) return;
    if (this.currentChunkIndex >= this.transcriptChunks.length) return;

    this.isLoadingMoreTranscript = true;

    const chunksToLoad = Math.min(
      this.CHUNKS_PER_LOAD,
      this.transcriptChunks.length - this.currentChunkIndex
    );

    for (let i = 0; i < chunksToLoad; i++) {
      this.displayedTranscriptChunks.push(this.transcriptChunks[this.currentChunkIndex]);
      this.currentChunkIndex++;
    }

    this.isLoadingMoreTranscript = false;
  }

  /**
   * Handle scroll event on transcript container
   */
  onTranscriptScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const threshold = 200; // pixels from bottom

    if (element.scrollHeight - element.scrollTop - element.clientHeight < threshold) {
      this.scrollSubject.next();
    }
  }

  /**
   * Check if there are more chunks to load
   */
  hasMoreChunks(): boolean {
    return this.currentChunkIndex < this.transcriptChunks.length;
  }

}
