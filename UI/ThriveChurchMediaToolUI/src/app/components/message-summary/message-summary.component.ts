import { Component, Input, OnInit } from '@angular/core';
import { SermonMessage } from 'src/app/DTO/SermonMessage';

@Component({
  selector: 'app-message-summary',
  templateUrl: './message-summary.component.html',
  styleUrls: ['./message-summary.component.scss']
})
export class MessageSummaryComponent implements OnInit {

  @Input() message: SermonMessage;
  encodedPassage: string = "";

  constructor() { }

  ngOnInit(): void {
    if (this.message.PassageRef) {
      this.encodedPassage = this.message.PassageRef.replace(/ /g, '+').replace(/:/g, '%3A');
    }
  }

}
