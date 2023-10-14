import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';

import { Component, OnInit } from '@angular/core';

import { LongestSermonSeriesSummary } from 'src/app/DTO/LongestSermonSeriesSummary';
import { SermonMessageSummary } from 'src/app/DTO/SermonMessageSummary';
import { SermonStatsResponse } from 'src/app/DTO/SermonStatsResponse';
import { ChartDataItem } from 'src/app/DTO/ChartDataItem';
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
  chartDataItems: ChartDataItem[] = [];
  chartAggregateType: string = "Monthly"
  chartType: string = "AudioDuration"
  chartTypeName: string = "Audio Duration"
  chartUnit: string = "seconds"
  chartDisplayName: string = ""

  chart: Chart | null = null;
  startDateString: string = "";
  endDateString: string = "";

  TotalSeriesNum: number = 0;
  TotalMessageNum: number = 0;
  AvgMessagesPerSeries: number = 0;
  TotalAudioLength: number = 0;
  AvgAudioLength: number = 0;
  TotalFileSize: number = 0;
  AvgFileSize: number = 0;
  defaultDateRange: number = 120;

  LongestMessage: SermonMessageSummary | undefined | null;
  LongestSeries: LongestSermonSeriesSummary | undefined | null;

  constructor(apiService: ApiService) {
    this.apiService = apiService;

    Chart.register(...registerables);
  }

  ngOnInit(): void {

    var startDate = document.querySelector('#startDate') as HTMLInputElement;
    var endDate = document.querySelector('#endDate') as HTMLInputElement;

    if (startDate) {
      var defaultStartDate = new Date(Date.now() - this.defaultDateRange * 24 * 60 * 60 * 1000);
      this.startDateString = moment(defaultStartDate).format("YYYY-MM-DD");
      startDate.addEventListener('change', this.handleChangeStartDate.bind(this));
      startDate.value = this.startDateString;
    }

    if (endDate) {
      var now = new Date();
      this.endDateString = moment(now).format("YYYY-MM-DD");
      endDate.addEventListener('change', this.handleChangeEndDate.bind(this));
      endDate.value = this.endDateString;
    }

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
          this.LongestMessage = this.stats.LongestMessage;
          this.speakers = this.stats.SpeakerStats;
          this.LongestSeries = this.stats.LongestSeries;
        }
      });

    this.loadChartData();
  }


  handleChangeStartDate(event: Event) {
    var target = event.target as HTMLInputElement;
    this.startDateString = target.value;
    this.loadChartData();
  }

  handleChangeEndDate(event: Event) {
    var target = event.target as HTMLInputElement;
    this.endDateString = target.value;
    this.loadChartData();
  }

  setAggreate(aggregate: string) {
    this.chartAggregateType = aggregate;
    this.loadChartData();
  }

  setChartName() {
    this.chartDisplayName = `${this.chartAggregateType} ${this.chartTypeName} (${this.chartUnit})`;
  }

  setChartType(chartType: string) {
    this.chartType = chartType;

    switch (chartType)  
    {
      case "TotAudioFileSize":
        this.chartTypeName = "Total Audio File Size"
        this.chartUnit = "Mb"
          break;
      case "AudioDuration":
          this.chartTypeName = "Audio Duration"
          this.chartUnit = "seconds"
        break;
      case "TotAudioDuration":
          this.chartTypeName = "Total Audio Duration"
          this.chartUnit = "seconds"
        break;
    }

    this.loadChartData();
  }

  createChart(): Chart | null {

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartDataItems.map((item) => item.Label),
          datasets: [{
            label: `${this.chartDisplayName}`,
            data: this.chartDataItems.map((item) => item.Value),
            borderWidth: 2,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            },
            x: {
              ticks: {
                maxTicksLimit: 50
              }
            }
          }
        }
      });
    }

    return null;
  }

  loadChartData() {

    this.chartDataItems = [];
    this.setChartName();

    this.apiService.getStatsChart(this.startDateString, this.endDateString, this.chartType, this.chartAggregateType)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          console.log(resp.body);
        }
        else if (resp.body) {
          //this.stats = resp.body;
          if (resp.body.Data) {
            resp.body.Data.forEach(data => {

              var dateString: string = "";

              switch (this.chartAggregateType) {

                case "Daily":
                  dateString = moment(Date.parse(data.Date)).utcOffset(0).format("MMM Do YYYY");
                  break;

                case "Weekly":
                  dateString = moment(Date.parse(data.Date)).utcOffset(0).format("MMM Do");
                  break;

                case "Monthly":
                  dateString = moment(Date.parse(data.Date)).utcOffset(0).format("MMM 'YY");
                  break;

                case "Yearly":
                  dateString = moment(Date.parse(data.Date)).utcOffset(0).format("YYYY");
                  break;

                default:
                  dateString = moment(Date.parse(data.Date)).utcOffset(0).format("MMM Do");

              }
              let item: ChartDataItem = {
                Label: dateString,
                Value: data.Value
              };

              this.chartDataItems.push(item);
            });
          }


          if (this.chart) {
            this.chart.destroy();
            this.chart = this.createChart();
          }
          else {
            this.chart = this.createChart();
          }
        }
      });
  }
}
