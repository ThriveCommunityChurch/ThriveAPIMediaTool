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

  TotalSeriesNum: number = 0;
  TotalMessageNum: number = 0;
  AvgMessagesPerSeries: number = 0;
  TotalAudioLength: number = 0;
  AvgAudioLength: number = 0;
  TotalFileSize: number = 0;
  AvgFileSize: number = 0;

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

          this.TotalSeriesNum = this.stats.TotalSeriesNum;
          this.TotalMessageNum = this.stats.TotalMessageNum;
          this.AvgMessagesPerSeries = this.stats.AvgMessagesPerSeries;
          this.TotalAudioLength = this.stats.TotalAudioLength;
          this.AvgAudioLength = this.stats.AvgAudioLength;
          this.TotalFileSize = this.stats.TotalFileSize;
          this.AvgFileSize = this.stats.AvgFileSize;

          this.speakers = this.stats.SpeakerStats;
        }
      });
  }

}
