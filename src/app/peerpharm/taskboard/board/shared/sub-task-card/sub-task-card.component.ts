import { Component, OnInit, Input } from '@angular/core';
import { SubTaskModel } from '../../../models/subtask-model';

@Component({
  selector: 'app-sub-task-card',
  templateUrl: './sub-task-card.component.html',
  styleUrls: ['./sub-task-card.component.css']
})
export class SubTaskCardComponent implements OnInit {
@Input() subTask:SubTaskModel;
  constructor() { }

  ngOnInit() {
  }

}
