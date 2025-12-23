import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from '../../services/api-service.service';
import { ToastService } from '../../services/toast-service.service';
import { ThemeService } from '../../services/theme.service';
import { PodcastMessage } from '../../DTO/PodcastMessage';
import { PodcastMessageRequest } from '../../DTO/PodcastMessageRequest';

export interface PodcastDirectory {
  name: string;
  url: string;
  iconClass?: string;
  color: string;
}

@Component({
  selector: 'app-admin-rss-feed',
  templateUrl: './admin-rss-feed.component.html',
  styleUrls: ['./admin-rss-feed.component.scss'],
  standalone: false
})
export class AdminRssFeedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Loading states
  isRebuilding = false;
  isLoadingMessages = false;
  isSavingMessage = false;

  // Feed URL
  rssFeedUrl: string = '';

  // Podcast messages
  podcastMessages: PodcastMessage[] = [];
  selectedMessage: PodcastMessage | null = null;
  editingMessage: PodcastMessageRequest | null = null;
  showEditModal = false;

  // Search and Pagination
  searchTerm = '';
  currentPage = 1;
  pageSize = 25;

  get filteredMessages(): PodcastMessage[] {
    if (!this.searchTerm.trim()) {
      return this.podcastMessages;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.podcastMessages.filter(m =>
      (m.podcastTitle?.toLowerCase().includes(term)) ||
      (m.title?.toLowerCase().includes(term))
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMessages.length / this.pageSize);
  }

  get paginatedMessages(): PodcastMessage[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMessages.slice(start, start + this.pageSize);
  }

  // Theme
  resolvedTheme$: Observable<string>;

  // Podcast directories
  podcastDirectories: PodcastDirectory[] = [
    {
      name: "Apple Podcasts",
      url: "https://podcasts.apple.com/us/podcast/thrive-community-church/id1483883780",
      iconClass: "fab fa-apple",
      color: "#A855F7"
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/show/1V7A8wNhRFqn67yxCXKX9e",
      iconClass: "fab fa-spotify",
      color: "#1DB954"
    },
    {
      name: "Amazon Music",
      url: "https://music.amazon.com/podcasts/e56e423a-7f79-4596-a8da-7b2ae829fe98/thrive-community-church",
      iconClass: "fab fa-amazon",
      color: "#FF9900"
    },
    {
      name: "iHeartRadio",
      url: "https://iheart.com/podcast/314021185/",
      iconClass: "fas fa-heart",
      color: "#C6002B"
    },
    {
      name: "Pandora",
      url: "https://www.pandora.com/podcast/thrive-community-church/PC:1001112226",
      iconClass: "fas fa-music",
      color: "#3668FF"
    },
    {
      name: "Deezer",
      url: "https://deezer.com/show/1002469392",
      iconClass: "fas fa-headphones",
      color: "#FF0092"
    },
    {
      name: "Player FM",
      url: "https://player.fm/series/thrive-community-church-3707697",
      iconClass: "fas fa-play-circle",
      color: "#E91E63"
    }
  ];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {
    this.resolvedTheme$ = this.themeService.resolvedTheme$;
  }

  ngOnInit(): void {
    this.rssFeedUrl = this.apiService.getRssFeedUrl();
    this.loadPodcastMessages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Rebuild the RSS feed by calling the API
   */
  rebuildFeed(): void {
    if (this.isRebuilding) return;

    this.isRebuilding = true;

    this.apiService.rebuildRssFeed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isRebuilding = false;
          
          if (response.status === 200) {
            this.toastService.showSuccess('RSS feed rebuild initiated successfully. The feed will be updated shortly.');
          } else {
            this.toastService.showError('Failed to rebuild RSS feed. Please try again.');
          }
        },
        error: (error) => {
          this.isRebuilding = false;
          
          let errorMessage = 'An error occurred while rebuilding the RSS feed.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toastService.showError(errorMessage);
        }
      });
  }

  /**
   * Open the RSS feed in a new tab
   */
  viewFeed(): void {
    window.open(this.rssFeedUrl, '_blank');
  }

  /**
   * Copy the RSS feed URL to clipboard
   */
  copyFeedUrl(): void {
    navigator.clipboard.writeText(this.rssFeedUrl).then(() => {
      this.toastService.showSuccess('RSS feed URL copied to clipboard');
    }).catch(() => {
      this.toastService.showError('Failed to copy URL to clipboard');
    });
  }

  /**
   * Open a podcast directory link
   */
  openDirectory(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Load all podcast messages from the API
   */
  loadPodcastMessages(): void {
    this.isLoadingMessages = true;
    this.currentPage = 1; // Reset to first page on reload

    this.apiService.getPodcastMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoadingMessages = false;
          if (response.body) {
            this.podcastMessages = response.body;
          }
        },
        error: () => {
          this.isLoadingMessages = false;
          this.toastService.showError('Failed to load podcast messages.');
        }
      });
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Go to a specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when searching
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
  }

  /**
   * Open the edit modal for a podcast message
   */
  editMessage(message: PodcastMessage): void {
    this.selectedMessage = message;
    this.editingMessage = {
      title: message.title,
      description: message.description,
      audioUrl: message.audioUrl,
      audioFileSize: message.audioFileSize,
      audioDuration: message.audioDuration,
      pubDate: message.pubDate,
      speaker: message.speaker,
      createdAt: message.createdAt,
      podcastTitle: message.podcastTitle,
      artworkUrl: message.artworkUrl
    };
    this.showEditModal = true;
  }

  /**
   * Close the edit modal
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedMessage = null;
    this.editingMessage = null;
  }

  /**
   * Save the edited podcast message
   */
  saveMessage(): void {
    if (!this.selectedMessage || !this.editingMessage) return;

    this.isSavingMessage = true;

    this.apiService.updatePodcastMessage(this.selectedMessage._id, this.editingMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSavingMessage = false;
          if (response.body) {
            // Update the message in the local list
            const index = this.podcastMessages.findIndex(m => m._id === this.selectedMessage?._id);
            if (index !== -1) {
              this.podcastMessages[index] = response.body;
            }
            this.toastService.showSuccess('Podcast message updated successfully.');
            this.closeEditModal();
          }
        },
        error: (error) => {
          this.isSavingMessage = false;
          let errorMessage = 'Failed to update podcast message.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          }
          this.toastService.showError(errorMessage);
        }
      });
  }

  /**
   * Format duration in seconds to MM:SS or HH:MM:SS
   */
  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Format file size in MB
   */
  formatFileSize(mb: number): string {
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

