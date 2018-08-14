import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

import { BoardModel } from '../../models/board-model';
import { MatTabGroup } from '../../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-content',
  providers: [TasksService],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  boards: BoardModel[];

  constructor( private taskService: TasksService ) {}

  ngOnInit(){
    this.getBoards();
  }

  getBoards() {
    this.taskService.getBoards()
    .subscribe(
      boards => {
        this.boards = boards; 
 setTimeout(()=>      this.tabGroup.selectedIndex = 0, 600);
  
     },
      err => console.log(err)
    );
  }
}
