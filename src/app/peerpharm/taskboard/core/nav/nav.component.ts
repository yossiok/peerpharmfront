import { AuthService } from '../../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../../models/UserInfo';

@Component({
  moduleId: "mID",
  selector: 'app-nav',
  providers: [AuthService],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  username: string;
  userInfo: UserInfo;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    if(!this.authService.loggedInUser)
    {
    this.authService.getLoggedInUser().subscribe(data => {
      
      if (data.msg != null) {
       console.log(data.msg);
       this.username="Guest";
      }
      else{
        this.userInfo = data;
        this.userInfo.firstName
      }
    });
  }
}

}
