import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { MessageTag, getMessageTagLabel, getMessageTagFromName } from 'src/app/DTO/MessageTag';

@Component({
    selector: 'app-message-summary',
    templateUrl: './message-summary.component.html',
    styleUrls: ['./message-summary.component.scss'],
    standalone: false
})
export class MessageSummaryComponent implements OnInit {

  @Input() message: SermonMessage;
  @Input() seriesId: string = "";
  encodedPassage: string = "";

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.message.PassageRef) {
      this.encodedPassage = this.message.PassageRef.replace(/ /g, '+').replace(/:/g, '%3A');
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
