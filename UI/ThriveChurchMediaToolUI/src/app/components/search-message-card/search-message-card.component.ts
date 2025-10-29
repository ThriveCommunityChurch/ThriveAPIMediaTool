import { Component, Input } from '@angular/core';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { getMessageTagLabel, MessageTag } from 'src/app/DTO/MessageTag';

@Component({
  selector: 'app-search-message-card',
  templateUrl: './search-message-card.component.html',
  styleUrls: ['./search-message-card.component.scss'],
  standalone: false
})
export class SearchMessageCardComponent {
  @Input() message!: SermonMessage;

  getMessageTagLabel = getMessageTagLabel;

  /**
   * Format audio duration from seconds to MM:SS format
   */
  formatDuration(seconds: number | null | undefined): string {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  /**
   * Convert tag string to MessageTag enum value for label lookup
   */
  getTagLabel(tagString: string): string {
    try {
      const tagValue = MessageTag[tagString as keyof typeof MessageTag];
      if (tagValue !== undefined) {
        return getMessageTagLabel(tagValue);
      }
    } catch (e) {
      // If conversion fails, return the string as-is
    }
    return tagString;
  }

  /**
   * Copy message ID to clipboard
   */
  copyMessageId(): void {
    if (this.message?.MessageId) {
      navigator.clipboard.writeText(this.message.MessageId);
    }
  }
}

