import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor() {
    
    var now = new Date();
    var then = new Date();
    var dayUTC = new Date();

    if(dayUTC.getUTCDay() == 1) {

        if(now.getUTCHours() > 24 ||
       (now.getUTCHours() == 24 && now.getUTCMinutes() > 0) ||
        now.getUTCHours() == 24 && now.getUTCMinutes() == 0 && now.getUTCSeconds() >= 0) {
        then.setUTCDate(now.getUTCDate() + 1);
        }

    then.setUTCHours(24);
    then.setUTCMinutes(0);
    then.setUTCSeconds(0);


    var timeout = (then.getTime() - now.getTime());
    setTimeout(function() { window.location.reload(); }, timeout);
    }
  }


}
