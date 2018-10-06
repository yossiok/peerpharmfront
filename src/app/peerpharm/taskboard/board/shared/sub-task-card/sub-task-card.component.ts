import { TasksService } from './../../../services/tasks.service';
import { Component, OnInit, Input } from '@angular/core';
import { SubTaskModel } from '../../../models/subtask-model';
import { UserInfo } from '../../../models/UserInfo';

@Component({
  selector: 'app-sub-task-card',
  templateUrl: './sub-task-card.component.html',
  styleUrls: ['./sub-task-card.component.css']
})
export class SubTaskCardComponent implements OnInit {
@Input() subTask:SubTaskModel;
user:UserInfo;
  constructor(private taskservice:TasksService) { 
  
  }

  ngOnInit() { 
    this.taskservice.getAvatarImagesByUserId(this.subTask.userId).subscribe(user=>{  
      
        this.user=user;
    });
  }

 

}
