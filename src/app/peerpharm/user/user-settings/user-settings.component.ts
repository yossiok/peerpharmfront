
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/services/orders.service';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  oldPassword:any;
  newPassword:any;
  user:any;

  userOrders:any;
  constructor(private orderService:OrdersService,private ToastService:ToastrService,private authService:AuthService,private userService: UsersService) { }

  ngOnInit() {
    debugger;
    this.user = this.authService.loggedInUser;

    if(!this.user){
      this.authService.userEventEmitter.subscribe(user=>{
        this.user = user
        this.getOpenOrdersByUser()
      })
    }

    
  }

  
  changePassword(){
    this.userService.changePassword(this.user.userName,this.newPassword,this.oldPassword).subscribe(data=>{
    if(data.success){
      this.ToastService.success(data.message)
      this.oldPassword = ''
      this.newPassword = ''
    } else {
      this.ToastService.error(data.message)
      this.oldPassword = ''
      this.newPassword = ''
    }
    })
  }

  getOpenOrdersByUser(){
    debugger
    this.orderService.getOpenOrdersByUser(this.user.userName).subscribe(data=>{
      debugger;
      this.userOrders = data;
    })
  }

}
