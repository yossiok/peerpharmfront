import { Depatment } from './../../../models/depatment.model';
import { TasksService } from '../../../services/tasks.service';
import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, animate, keyframes, style, transition } from '@angular/animations';
import { TaskModel } from '../../../models/task-model';
import { SubTaskModel } from '../../../models/subtask-model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-board-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        animate(500, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class TaskCardComponent implements OnInit {

  @Input() task: TaskModel;
  @Input() tileName: string;
  @Input() boardTitle:string;

 
  depatments: Depatment[] = [];
 
  constructor(
    private tasksService: TasksService, private userService:UsersService

  ) { }




  ngOnInit(): void {
    this.tasksService.getAllDepartments().subscribe(deps => {
      deps.forEach(dep => {

        if (this.task.departments && this.task.departments.includes(dep._id)) {

          this.depatments.push(dep);
        }
      });


    })

    


  }



}
