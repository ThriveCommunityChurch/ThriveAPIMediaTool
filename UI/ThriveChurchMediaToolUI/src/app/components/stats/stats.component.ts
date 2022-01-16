import { Component, OnInit } from '@angular/core';
import { SermonStatsResponse } from 'src/app/DTO/SermonStatsResponse';
import { SpeakerStats } from 'src/app/DTO/SpeakerStats';
import { ApiService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  apiService: ApiService;
  stats: SermonStatsResponse;
  speakers: SpeakerStats[] = [];

  constructor(apiService: ApiService) { 
    this.apiService = apiService;
  }

  ngOnInit(): void {

    this.apiService.getStats()
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          console.log(resp.body);
        }
        else if (resp.body) {
          this.stats = resp.body;

          this.speakers = this.stats.SpeakerStats;
        }
      });
  }

}
