import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';

@Component({
  selector: 'app-series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.scss']
})
export class SeriesItemComponent implements OnInit {

  @Input() summary: SermonSeriesSummary | null = null;
  hyperlink: string = "";

  constructor(
    private _router: Router,
    ) 
  { 
  }

  ngOnInit(): void {
    this.hyperlink = `/edit/${this.summary?.Id}`;
  }

}
