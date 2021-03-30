import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  currentMsgIndex = 0;

  constructor(private authService: AuthService) {

    var now = new Date();
    var then = new Date();
    var dayUTC = new Date();

    if (dayUTC.getUTCDay() == 1) {

      if (now.getUTCHours() > 24 ||
        (now.getUTCHours() == 24 && now.getUTCMinutes() > 0) ||
        now.getUTCHours() == 24 && now.getUTCMinutes() == 0 && now.getUTCSeconds() >= 0) {
        then.setUTCDate(now.getUTCDate() + 1);
      }

      then.setUTCHours(24);
      then.setUTCMinutes(0);
      then.setUTCSeconds(0);


      var timeout = (then.getTime() - now.getTime());
      setTimeout(function () { window.location.reload(); }, timeout);
    }


  }

  ngOnInit() {
    // INIT ALERT SERVICE \\
    this.socket = io(`http://18.221.58.99:8200`);
    this.socket.on("connect", () => {
      //console.log('socket connected');
      this.socket.on('alert service', (title, body) => {
        let titleObj = JSON.parse(title);

        if (this.currentMsgIndex < titleObj.index) {
          if (titleObj.users == "all") {
            debugger;
            this.currentMsgIndex = titleObj.index;
            this.alertTitle = titleObj.title;
            this.alertBody = body;
            this.showAlertModal = true;
            if (titleObj.force == "true")
              this.forcereload = true
            console.log(title, body);
          }
          else {
            if (this.authService.loggedInUser.userName) {
              let users=titleObj.users.split(',');
              users.forEach(user => {

                if (this.authService.loggedInUser.userName == user) {
                  this.currentMsgIndex = titleObj.index;
                  this.alertTitle = titleObj.title;
                  this.alertBody = body;
                  this.showAlertModal = true;
                  if (titleObj.force == "true")
                    this.forcereload = true
                  console.log(title, body);
                }
              });
            }
          }

        }

      });
    });
    // END INIT ALERT SERVICE \\
  }

  // ALERT SERVICE AREA \\
  private socket: any;
  alertTitle: String;
  alertBody: String;
  showAlertModal: boolean;
  forcereload: boolean;

  onHandleAlertModal() {
    this.showAlertModal = false;
    this.alertTitle = '';
    this.alertBody = '';
  }
  // END ALERT SERVICE AREA \\

}
