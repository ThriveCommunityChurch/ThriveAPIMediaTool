import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { SermonSeriesUpdateRequest } from 'src/app/DTO/SermonSeriesUpdateRequest';
import { ApiService } from 'src/app/services/api-service.service';
import { ToastService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-edit-series',
  templateUrl: './edit-series.component.html',
  styleUrls: ['./edit-series.component.scss']
})
export class EditSeriesComponent implements OnInit {

  seriesId: string | null = null;
  isLoading: boolean = true;

  // Form fields
  seriesName: string;
  startDate: string;
  endDate: string;
  seriesSlug: string;
  seriesThumbnailUrl: string;
  seriesArtUrl: string;

  // Original series data
  sermonSeries: SermonSeries;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.seriesId = this.route.snapshot.paramMap.get('id');

    if (this.seriesId) {
      this.loadSeriesData();
    }
  }

  loadSeriesData(): void {
    this.isLoading = true;

    if (!this.seriesId) {
      this.toastService.showStandardToast("Series ID is missing. Cannot load series data.", 400);
      this.isLoading = false;
      return;
    }

    this.apiService.getSeries(this.seriesId)
      .subscribe(resp => {
        if (resp.status > 200) {
          this.toastService.showStandardToast("An error occurred loading the series. Try again.", resp.status);
          this.isLoading = false;
        }
        else if (resp.body) {
          this.sermonSeries = resp.body;

          // Populate form fields with current values
          this.seriesName = resp.body.Name;
          this.startDate = this.formatDateForInput(resp.body.StartDate);
          this.endDate = this.formatDateForInput(resp.body.EndDate);
          this.seriesSlug = resp.body.Slug;
          this.seriesThumbnailUrl = resp.body.Thumbnail;
          this.seriesArtUrl = resp.body.ArtUrl || '';

          this.isLoading = false;
        }
      }, (error: any) => {
        this.toastService.showStandardToast("An error occurred loading the series. Try again.", 400);
        this.isLoading = false;
      });
  }

  formatDateForInput(dateString: string | undefined | null): string {
    if (!dateString) return '';

    // Convert date string to YYYY-MM-DD format for input[type="date"]
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  /**
   * Update the series with the form data
   */
  updateSeries(): void {
    if (!this.seriesId) return;

    // Create update request
    const updateRequest: SermonSeriesUpdateRequest = {
      Name: this.seriesName,
      StartDate: this.startDate || '',
      EndDate: this.endDate || '',
      Slug: this.seriesSlug,
      Thumbnail: this.seriesThumbnailUrl,
      ArtUrl: this.seriesArtUrl
    };

    // Update the series
    this.apiService.editSeries(this.seriesId, updateRequest)
      .subscribe(resp => {
        if (resp.status > 200) {
          this.toastService.showStandardToast("An error occurred updating the series. Try again.", resp.status);
        }
        else if (resp.body) {
          this.toastService.showStandardToast("Series was successfully updated.", 200);
          // Navigate back to dashboard after successful update
          this.router.navigate(['/']);
        }
      }, (error: any) => {
        this.toastService.showStandardToast("An error occurred updating the series. Try again.", 400);
      });
  }

  /**
   * Cancel editing and return to dashboard
   */
  cancel(): void {
    // Navigate back to dashboard
    this.router.navigate(['/']);
  }

}
