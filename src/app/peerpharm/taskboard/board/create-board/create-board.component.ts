import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { BoardModel } from '../../models/board-model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-create-board',
  providers: [TasksService],
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  boards: BoardModel[];
  board= new BoardModel("","");
   newBoard:BoardModel;
  constructor(private tasksService:TasksService, private authService:AuthService) { }

  ngOnInit() {
  }

  onSubmit(form) { 
    console.log(form);
    this.tasksService.createBoard(this.board)
      .subscribe(newBoard => {
        this.newBoard = newBoard; 
        this.getBoards();
      },
      err => {
        console.log(err);
      }); 
    }


    getBoards() {
      this.tasksService.getBoardsByDepartments(this.authService.loggedInUser.userDepartments)
      .subscribe(
        boards => this.boards = boards,
        err => console.log(err)
      );
    }

}
