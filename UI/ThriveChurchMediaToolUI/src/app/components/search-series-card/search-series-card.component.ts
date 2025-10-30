import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SermonSeriesSearchResult } from 'src/app/DTO/SearchResponse';

@Component({
  selector: 'app-search-series-card',
  templateUrl: './search-series-card.component.html',
  styleUrls: ['./search-series-card.component.scss'],
  standalone: false
})
export class SearchSeriesCardComponent {
  @Input() series!: SermonSeriesSearchResult;

  constructor(private router: Router) {}

  /**
   * Navigate to series view page
   */
  viewSeries(): void {
    this.router.navigate(['/view', this.series.Id]);
  }

  /**
   * Format date range for display
   */
  getDateRange(): string {
    if (!this.series.StartDate) return 'N/A';
    
    const start = new Date(this.series.StartDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (!this.series.EndDate) {
      return startStr;
    }
    
    const end = new Date(this.series.EndDate);
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  }
}

