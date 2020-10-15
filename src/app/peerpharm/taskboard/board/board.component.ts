 
import { UserInfo } from './../models/UserInfo';
import { Depatment } from './../models/depatment.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import * as Moment from 'moment';

import { TasksService } from '../services/tasks.service';
import { BoardModel } from '../models/board-model';
import { TaskModel } from '../models/task-model';
import { MatDialog, MatDialogRef, MatDatepicker } from '@angular/material';
import { SubTaskModel } from '../models/subtask-model';
import { NgbModal, ModalDismissReasons } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-board',
  providers: [TasksService],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  // Local Properties
  board: BoardModel;
  @ViewChild("content") content: TemplateRef<any>;;


  tasks: TaskModel[];
  subTasksArr: SubTaskModel[];
  taskFilter: any = { name: '' };
  updatedTask: TaskModel;
  newTask: TaskModel;
  animateFlag = 'in';
  isClosed: boolean = true;
  taskUserPics: string[];
  taskid: string = 'check';
  allUsers:UserInfo[];
  departments: any[] = [];

  data: any = {
    'description': '',
    'duedate': '',
    'priority': '',
    'list': ''
  };



  selectedUser: any = {
    name: '',
    avatar: '',
    lastTaskVisit: ''
  }

  public tiles = [
    { text: 'Not Started', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#82b3c9', add: false },
    { text: 'In-Progress', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#0093c4', add: false },
    { text: 'Late', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#bb002f', add: false },
    { text: 'Done', cols: 1, rows: 1, color: '#CFD8DC', titlecolor: '#003300', add: false },
  ];


  loginUser = "Gabi Barak";

  public users = [
    { name: 'Gabi Barak', avatar: "assets/images/user2.jpg", lastTaskVisit: "23-05-2018" },
    { name: 'Rabbi Nuchi', avatar: "assets/images/user.jpg", lastTaskVisit: "14-02-2018" },
    { name: 'Josh Luri', avatar: "assets/images/user1.jpg", lastTaskVisit: "03-12-2018" }
  ]

  public messages = [
    { body: "hi all, how are you, ready to begin?", user: "Gabi Barak", date: "23-05-2018 ,  13:05", avatar: "assets/images/user2.jpg" },
    { body: "let start, i'll take care to documents", user: "Josh Luri", date: "23-05-2018 ,  13:05", avatar: "assets/images/user1.jpg" },
    { body: "hi all, how are you, ready to begin?", user: "Gabi Barak", date: "23-05-2018 ,  13:05", avatar: "assets/images/user.jpg" }
  ]
  @Input() boardTitle: string;
  @Input() boardID: string;
  newTaskId: true;
  getNewTaskId: string;
  modalTitle: string = "";
  closeResult: string;


  constructor(
    private tasksService: TasksService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private userService: UsersService,
    private authService: AuthService

  ) { }

  ngOnInit() { 
    this.getTasks(this.authService.loggedInUser._id)

    this.getDepartments();
  }



  simpleDrop($event: any, tileText: string) {
    if ($event.dragData.list !== tileText) {
      this.UpdateTask($event.dragData._id, tileText);
    }
  }

  getTasks(userid) {
    this.tasksService.getTasksByUserID(userid)
      .subscribe(
        tasks => {
          this.tasks = tasks;
          this.tiles.forEach(tile => {
            tile.rows = tasks.length * 0.4;
          });
          console.log(tasks);
          this.getNewTaskId = tasks[tasks.length - 1]._id;
        },
        err => {
          console.log(err);
        });
  }

  getDepartments() {
    this.tasksService.getAllDepartments()
      .subscribe(
        deps => {
          
          deps.forEach(d => {
            this.departments.push({ checked: false, id: d._id, title: d.title });
          });

        }
      )
  }


  UpdateTask(_id, tList) {
    
    this.tasksService.updateTask(_id, tList, this.boardTitle)
      .subscribe(
        updatedTask => {
          this.updatedTask = updatedTask;
          this.getTasks(this.authService.loggedInUser._id);
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
      new Date(this.data.duedate), this.data.priority , this.authService.loggedInUser._id)
      .subscribe(newtask => {
     
        this.showTaskDetails(newtask,this.content);
        this.newTask = newtask;
        this.getTasks(this.authService.loggedInUser._id);
        console.log("aaaaa   " + newtask._id);
 
        //this.newTaskId=this.newTask.name;
        //  this.newTaskId = true;
      },
        err => {
          console.log(err);
        });
    this.showAddtask(_tiletext);
  }


  subData: any = {
    mainTaskId: '',
    name: '',
    dueDate: '',
    priority: '',
    depId: '',
    userId: '',
    status: '',
    users: []
  };
  userselected:string="select user";




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


  onSelect(user: Object[]): void {
    this.selectedUser = user;
  }


  showTaskDetails(task, content) {
    this.modalTitle= task.name;
    this.taskid = task._id;
    if (this.isClosed) {
      this.tasksService.getSubTasks(task._id).subscribe(subTasks => {
        this.subTasksArr = subTasks;
        this.modalService.open(content).result.then(
          result => {
            this.closeResult = `Closed with: ${result}`;
          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
        this.isClosed = false;

        setTimeout(() => {
          let mypopup: any = document.getElementsByClassName("modal-dialog")[0];
          mypopup.style.maxWidth = "1100px";


          this.userService.getAllUsers().subscribe(users => {
            this.allUsers = users;
          });

        }, 700)
      })
    }
    else {
      this.subTasksArr = [];
      this.isClosed = true;
    }
  }


  private getDismissReason(reason: any): string {
    this.getTasks(this.authService.loggedInUser._id);
 
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  
  }


  addNewSubTask(getNewTaskId) {
    
    this.subData.mainTaskId = getNewTaskId;
    this.subData.status = 'open';
    this.subData.userId=this.userselected;
    console.log(this.subData);
    let dataArrived = {};
    this.tasksService.createSubTask(this.subData.mainTaskId, this.subData.name, this.subData.dueDate, this.subData.priority, this.subData.depId, this.subData.userId,  this.subData.status)
      .subscribe(newSubTask => console.log(newSubTask));
      this.tasksService.getSubTasks(this.subData.mainTaskId).subscribe(subTasks => {
        this.subTasksArr = subTasks;
      });

  }


}

