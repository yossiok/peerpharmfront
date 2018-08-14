import { Component, OnInit, Input } from '@angular/core';
import * as Moment from 'moment';

import { TasksService } from '../services/tasks.service';
import { BoardModel } from '../models/board-model';
import { TaskModel } from '../models/task-model';
import { MatDialog, MatDialogRef, MatDatepicker } from '@angular/material';
import { SubTaskModel } from '../models/subtask-model';
import { NgbModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board',
  providers: [TasksService],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  // Local Properties
  board: BoardModel;
  
  departemnts:any=[];  
  tasks: TaskModel[];
  subTasksArr:SubTaskModel[];
  taskFilter: any = { name: '' };
  updatedTask: TaskModel;
  newTask: TaskModel;
  animateFlag = 'in';

  data: any = {
    'description': '',
    'duedate': '',
    'priority': '',
    'list': ''
  };

  subData: any = {
    'mainTaskId': '',
    'name': '',
    'dueDate': '',
    'priority':'',
    'depId': '',
    'userId': '',
    'status':''
  };

  

public tiles = [
    { text: 'New', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#03A9F4', add: false },
    { text: 'On-Hold', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#f5c942', add: false },
    { text: 'In-Progress', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#d066e2', add: false },
    { text: 'Done', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#ff6b68', add: false },
  ];

  @Input() boardTitle: string;
  newTaskId:true;
  getNewTaskId:string; 
  modalTitle:string="";

  constructor(
    private tasksService: TasksService,
    public dialog: MatDialog,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {
    this.getTasks(this.boardTitle);
    this.getDepartments();
  }


  shome(ev):void{
    debugger;
  }

  simpleDrop($event: any, tileText: string) {
    if ($event.dragData.list !== tileText) {
      this.UpdateTask($event.dragData._id, tileText, $event.dragData.boardId);
    }
  }

  getTasks(_boardid) {
    this.tasksService.getTasks(_boardid)
      .subscribe(
      tasks => {
        this.tasks = tasks;  
        this.tiles.forEach(tile => {
          tile.rows = tasks.length * 0.4;
        });
        console.log(tasks);
        this.getNewTaskId = tasks[tasks.length-1]._id;
      },
      err => {
        console.log(err);
      });
  }

  getDepartments(){
    this.tasksService.getBoards()
    .subscribe(
      deps=>{
        this.departemnts=deps;
        console.log("dep "   +  this.departemnts);
        //deps.forEach(dep=>{
          
          //console.log(dep);
      //    this.departemnts.push(dep);
        //})
      }
    )
  }

  UpdateTask(_id, tList, boardTitle) {
    debugger;
    this.tasksService.updateTask(_id, tList,boardTitle)
      .subscribe(
      updatedTask => {
        this.updatedTask = updatedTask;
        this.getTasks(boardTitle);
      },
      err => {
        console.log(err);
      });
  }

  /* New Task methods */
  showAddtask(_tiletext) {
    this.clearForm();
    this.tiles.filter(function (tile) {
      tile.add = tile.text === _tiletext ? !tile.add : false;
    });
  }

  addNewTask(_tiletext) {
    // Moment(this.data.duedate).format('DD/MM/YYYY')
    this.tasksService.createTask(this.boardTitle, _tiletext, this.data.description,
    new Date(this.data.duedate) , this.data.priority)
      .subscribe(newtask => {
        debugger;
       this.newTask = newtask;
        this.getTasks(this.boardTitle);
        console.log("aaaaa   "    +  newtask._id);
        console.log(this.departemnts);
        //this.newTaskId=this.newTask.name;
        this.newTaskId = true;
      },
      err => {
        console.log(err);
      });
    this.showAddtask(_tiletext);
  }

  addNewSubTask(getNewTaskId){
    this.subData.mainTaskId=getNewTaskId;
    this.subData.status='open';
    console.log(this.subData);
    let dataArrived={};
    this.tasksService.createSubTask(this.subData.mainTaskId, this.subData.name, this.subData.dueDate, this.subData.priority, this.subData.depId, this.subData.userId)
    .subscribe(newSubTask=>console.log(newSubTask));
  }


  showTaskDetails(id, content, index){
    console.log(id);
    this.tasksService.getSubTasks(id).subscribe(subTasks=>{
      this.subTasksArr = subTasks;
      console.log(subTasks);
      this.modalTitle=this.tasks[index].name;
      
    this.modalService.open(content).result.then(
     /* result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }*/
    );
    })
  }
  clearForm() {
    this.data = {
      'description': '',
      'duedate': '',
      'priority': '',
      'list': ''
    }
  }

  sortByPriority(_tiletext) {
    this.tasks.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }

  sortByDate(_tiletext) {
    this.tasks.sort(function (a, b) {
      return +new Date(a.dueDate) - +new Date(b.dueDate);
    });
  }

}
