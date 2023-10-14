import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-view-series',
  templateUrl: './view-series.component.html',
  styleUrls: ['./view-series.component.scss']
})
export class ViewSeriesComponent implements OnInit {

  seriesId: string | null = null;
  seriesName: string = "N/A";
  sermonSeries: SermonSeries | undefined;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.seriesId = this.route.snapshot.paramMap.get('id');
    
    if (this.seriesId) {
      this.apiService.getSeries(this.seriesId)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          console.log(resp.body);
        }
        else if (resp.body) {
          this.sermonSeries = resp.body;
        }
      });
    }
  }

}
