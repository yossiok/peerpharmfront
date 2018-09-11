import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

import { BoardModel } from '../../models/board-model';
import { MatTabGroup } from '../../../../../../node_modules/@angular/material';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-content',
  providers: [TasksService],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  boards: BoardModel[];

  constructor( private taskService: TasksService,private  authService:AuthService ) {}

  ngOnInit(){
    if(this.authService.loggedInUser)
    {
      this.getBoardsByPermissions();
    }
    else{
      this.authService.userEventEmitter.subscribe((data)=>
      { 
        this.getBoardsByPermissions();
      });
    }
   
 
  
  }

  

  getBoardsByPermissions() {
    debugger;
    this.taskService.getBoardsByDepartments(this.authService.loggedInUser.userDepartments)
    .subscribe(
      boards => {
        debugger;
        this.boards = boards; 

 setTimeout(()=>      this.tabGroup.selectedIndex = 0, 300);
  
     },
      err => console.log(err)
    );
  }
}
