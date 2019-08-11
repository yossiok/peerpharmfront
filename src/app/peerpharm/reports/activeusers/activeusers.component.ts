import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';

@Component({
  selector: 'app-activeusers',
  templateUrl: './activeusers.component.html',
  styleUrls: ['./activeusers.component.css']
})
export class ActiveusersComponent implements OnInit {

  Allusers:any[]=[];
  user:UserInfo
  hasAuthorization:boolean = false;
  
  constructor(private authService:AuthService,private userService:UsersService) { }

  ngOnInit() {
  this.getUserInfo();
this.userService.getAllActiveUsers().subscribe(data=>
  {
     this.Allusers=data;
  });
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
