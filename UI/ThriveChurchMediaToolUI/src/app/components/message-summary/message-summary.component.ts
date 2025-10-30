import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { MessageTag, getMessageTagLabel, getMessageTagFromName } from 'src/app/DTO/MessageTag';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast-service.service';
import WaveSurfer from 'wavesurfer.js';

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

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {
    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(authState => authState.isAuthenticated)
    );
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

}
