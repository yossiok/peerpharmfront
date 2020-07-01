import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PeerPharmRputs } from '../peerpharm.routing';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  routes: any[];
  users: any[];


  @ViewChild('screenValue') screenValue: ElementRef;

  constructor(private toastService: ToastrService, private userService: UsersService) { }

  ngOnInit() {
    this.userService.getAllScreens().subscribe(data=>
      {
        this.routes = [...data]; 
      });
      this.getAllUsers();

  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(users => {
      debugger;
      this.users = users;
    })
  }

  setUserPermissionLvl(ev, id) {
    var permLevel = ev.target.value;
    this.userService.setUserPermission(permLevel, id).subscribe(user => {
      if (user) {
        var oldUser = this.users.find(u => u._id == user._id)
        oldUser.screenPermission = user.screenPermission
        this.toastService.success('הרשאת משתמש עודכנה בהצלחה !')
      }
    })
  }

  savePermission(name) {
    debugger;
    if(this.screenValue.nativeElement.value != ''){
      this.userService.savePermissionToScreen({ name: name, permission:this.screenValue.nativeElement.value}).subscribe(data => {
        if(data){
          var screen = this.routes.find(s=>s.name == data.name);
      
          this.toastService.success('הרשאות נשמרו בהצלחה')
        }
      })
    } else {
      this.toastService.error('שדה זה אינו יכול להישאר ריק')
    }
    
  }



}


