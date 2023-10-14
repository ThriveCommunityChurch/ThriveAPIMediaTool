import { Component, Input, OnInit } from '@angular/core';
import { SermonMessage } from 'src/app/DTO/SermonMessage';

@Component({
  selector: 'app-message-summary',
  templateUrl: './message-summary.component.html',
  styleUrls: ['./message-summary.component.scss']
})
export class MessageSummaryComponent implements OnInit {

  @Input() message: SermonMessage | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
