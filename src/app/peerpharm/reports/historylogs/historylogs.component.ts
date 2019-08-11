import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-historylogs',
  templateUrl: './historylogs.component.html',
  styleUrls: ['./historylogs.component.css']
})
export class HistorylogsComponent implements OnInit {

user:UserInfo
logs:any[]=[];
hasAuthorization:boolean = false;


  constructor(private authService: AuthService,private logsService:LogsService) { }

  ngOnInit() {
    this.getUserInfo();
    this.logsService.getAll().subscribe(data=>
      
      {
        debugger;
        this.logs=data;
      })
  }

  async getUserInfo() {
    debugger
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;
            
      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
      if (this.user.authorization){
        debugger
        if (this.authService.loggedInUser.authorization.includes("viewReports")){
          this.hasAuthorization=true;
        }
      }

    });

  }

}
