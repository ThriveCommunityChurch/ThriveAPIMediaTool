import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api-service.service';
import { SkeletonThemeService } from 'src/app/services/skeleton-theme.service';
import { ToastService } from 'src/app/services/toast-service.service';
import { SearchResponse, SermonSeriesSearchResult } from 'src/app/DTO/SearchResponse';
import { SearchTarget, getSearchTargetName } from 'src/app/DTO/SearchTarget';
import { SortDirection, getSortDirectionName } from 'src/app/DTO/SortDirection';
import { MessageTag, getMessageTagLabel, getMessageTagName } from 'src/app/DTO/MessageTag';
import { SermonMessage } from 'src/app/DTO/SermonMessage';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: false
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('tagMultiselectWrapper', { static: false }) tagMultiselectWrapper!: ElementRef;
  @ViewChild('speakerMultiselectWrapper', { static: false }) speakerMultiselectWrapper!: ElementRef;

  private destroy$ = new Subject<void>();

  // Search parameters
  searchTarget: SearchTarget = SearchTarget.Series;
  selectedTags: MessageTag[] = [];
  selectedSpeaker: string = '';
  sortDirection: SortDirection = SortDirection.Descending;

  // Results
  searchResults: SearchResponse | null = null;
  isLoading: boolean = false;
  hasSearched: boolean = false;
  noResults: boolean = false;

  // Available tags for selection
  availableTags: { tag: MessageTag; label: string }[] = [];
  filteredTags: { tag: MessageTag; label: string }[] = [];
  tagSearchInput: string = '';
  showTagDropdown: boolean = false;

  // Available speakers for selection
  availableSpeakers: string[] = [];
  filteredSpeakers: string[] = [];
  speakerSearchInput: string = '';
  showSpeakerDropdown: boolean = false;
  speakersLoading: boolean = true;
  speakersLoadError: boolean = false;

  // Skeleton themes
  cardImageTheme$: Observable<any>;
  titleTheme$: Observable<any>;
  subtitleTheme$: Observable<any>;
  dateTheme$: Observable<any>;
  footerTheme$: Observable<any>;

  // Enums for template
  SearchTarget = SearchTarget;
  SortDirection = SortDirection;
  getMessageTagLabel = getMessageTagLabel;

  constructor(
    private apiService: ApiService,
    private skeletonThemeService: SkeletonThemeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeSkeletonThemes();
    this.populateAvailableTags();
    this.loadSpeakers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSkeletonThemes(): void {
    this.cardImageTheme$ = this.skeletonThemeService.getCardImageTheme();

    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'margin': '0'
    });

    this.subtitleTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '80%',
      'margin': '0'
    });

    this.dateTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '33%'
    });

    this.footerTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '40%',
      'margin': '0',
      'vertical-align': 'middle'
    });
  }

  private populateAvailableTags(): void {
    // Get all MessageTag enum values (excluding Unknown)
    const tagKeys = Object.keys(MessageTag).filter(key => isNaN(Number(key)) && key !== 'Unknown');

    this.availableTags = tagKeys.map(key => ({
      tag: (MessageTag as any)[key],
      label: getMessageTagLabel((MessageTag as any)[key])
    })).sort((a, b) => a.label.localeCompare(b.label));

    this.filteredTags = this.availableTags;
  }

  filterTags(searchTerm: string): void {
    this.tagSearchInput = searchTerm;
    if (!searchTerm.trim()) {
      this.filteredTags = this.availableTags;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredTags = this.availableTags.filter(t =>
        t.label.toLowerCase().includes(term)
      );
    }
  }

  toggleTagDropdown(): void {
    this.showTagDropdown = !this.showTagDropdown;
  }

  closeTagDropdown(): void {
    this.showTagDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showTagDropdown && this.tagMultiselectWrapper) {
      const clickedInside = this.tagMultiselectWrapper.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeTagDropdown();
      }
    }

    if (this.showSpeakerDropdown && this.speakerMultiselectWrapper) {
      const clickedInside = this.speakerMultiselectWrapper.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeSpeakerDropdown();
      }
    }
  }

  getSelectedFilteredTags(): MessageTag[] {
    return this.selectedTags.filter(tag => {
      const label = getMessageTagLabel(tag).toLowerCase();
      return label.includes(this.tagSearchInput.toLowerCase());
    });
  }

  getAvailableFilteredTags(): { tag: MessageTag; label: string }[] {
    return this.filteredTags.filter(t => !this.isTagSelected(t.tag));
  }

  toggleTag(tag: MessageTag): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  isTagSelected(tag: MessageTag): boolean {
    return this.selectedTags.includes(tag);
  }

  private loadSpeakers(): void {
    this.speakersLoading = true;
    this.speakersLoadError = false;

    this.apiService.getSpeakers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.availableSpeakers = response.body.sort();
            this.filteredSpeakers = this.availableSpeakers;
          }
          this.speakersLoading = false;
        },
        error: () => {
          this.speakersLoading = false;
          this.speakersLoadError = true;
          this.toastService.showError('Failed to load speakers. Please try again.');
        }
      });
  }

  filterSpeakers(searchTerm: string): void {
    this.speakerSearchInput = searchTerm;
    if (!searchTerm.trim()) {
      this.filteredSpeakers = this.availableSpeakers;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredSpeakers = this.availableSpeakers.filter(speaker =>
        speaker.toLowerCase().includes(term)
      );
    }
  }

  toggleSpeakerDropdown(): void {
    this.showSpeakerDropdown = !this.showSpeakerDropdown;
  }

  closeSpeakerDropdown(): void {
    this.showSpeakerDropdown = false;
  }

  selectSpeaker(speaker: string): void {
    this.selectedSpeaker = speaker;
    this.closeSpeakerDropdown();
    this.speakerSearchInput = '';
  }

  clearSpeaker(): void {
    this.selectedSpeaker = '';
  }

  performSearch(): void {
    // Validate based on search target
    if (this.searchTarget === SearchTarget.Speaker) {
      if (!this.selectedSpeaker.trim()) {
        this.toastService.showError('Please select a speaker to search.');
        return;
      }
    } else {
      if (this.selectedTags.length === 0) {
        this.toastService.showError('Please select at least one tag to search.');
        return;
      }
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.noResults = false;
    this.searchResults = null;

    // Convert enum values to string names for API serialization
    const request: any = {
      SearchTarget: getSearchTargetName(this.searchTarget),
      Tags: this.searchTarget === SearchTarget.Speaker ? [] : this.selectedTags.map(tag => getMessageTagName(tag)),
      SearchValue: this.searchTarget === SearchTarget.Speaker ? this.selectedSpeaker : undefined,
      SortDirection: getSortDirectionName(this.sortDirection)
    };

    this.apiService.search(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.body) {
            this.searchResults = response.body;
            const resultCount = this.getResultCount();
            if (resultCount === 0) {
              this.noResults = true;
            }
          }
        },
        error: () => {
          this.isLoading = false;
          this.toastService.showError('An error occurred while searching. Please try again.');
        }
      });
  }

  clearSearch(): void {
    this.selectedTags = [];
    this.selectedSpeaker = '';
    this.searchResults = null;
    this.hasSearched = false;
    this.noResults = false;
  }

  getResultCount(): number {
    if (!this.searchResults) return 0;

    if (this.searchTarget === SearchTarget.Messages || this.searchTarget === SearchTarget.Speaker) {
      return this.searchResults.Messages?.length || 0;
    } else if (this.searchTarget === SearchTarget.Series) {
      return this.searchResults.Series?.length || 0;
    }
    return 0;
  }

  getSeriesResults(): SermonSeriesSearchResult[] {
    if (!this.searchResults || this.searchTarget !== SearchTarget.Series) {
      return [];
    }

    return this.searchResults.Series || [];
  }

  getMessageResults(): SermonMessage[] {
    if (!this.searchResults || (this.searchTarget !== SearchTarget.Messages && this.searchTarget !== SearchTarget.Speaker)) {
      return [];
    }

    return this.searchResults.Messages || [];
  }

  getSkeletonCount(): number {
    return 9; // Show 9 skeleton cards while loading
  }
}

