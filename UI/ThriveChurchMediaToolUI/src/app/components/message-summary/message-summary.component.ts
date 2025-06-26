import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-message-summary',
  templateUrl: './message-summary.component.html',
  styleUrls: ['./message-summary.component.scss']
})
export class MessageSummaryComponent implements OnInit {

  @Input() message: SermonMessage;
  @Input() seriesId: string = "";
  encodedPassage: string = "";
  isAuthenticated$: Observable<boolean>;

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

}
