import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/services/items.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-shelf',
  templateUrl: './change-shelf.component.html',
  styleUrls: ['./change-shelf.component.css']
})
export class ChangeShelfComponent implements OnInit {
  
  allowChange:boolean = false;
  user:any;

  itemShell = {
    item:'',
    amount:'',
    storage:'',
    position:'',
    _id:'',
  }
  itemShellTwo = {
    item:'',
    amount:'',
    storage:'',
    position:'',
    _id:'',
  }

  constructor(private itemService:ItemsService,private toastSrv: ToastrService,private AuthService:AuthService) { }

  ngOnInit() {
    this.getUserInfo();
  }



  getShellDetailByNumber(ev) {

    var itemNumber = ev.target.value
    this.itemService.getShellDetailsByNumber(itemNumber).subscribe(data=>{
      debugger
      this.itemShell = data[0]
      this.itemShellTwo = data[1]

    })
  }
  
  findByIdAndUpdate(){
 
    this.itemService.findByIdAndUpdate(this.itemShell).subscribe(data=>{
      debugger
    if(data){
      this.toastSrv.success("כמות עודכנה בהצלחה !")
    } else {
      this.toastSrv.error('ישנה שגיאה , תפנה לבר')
    }
    })
  }
  findByIdAndUpdateTwo(){
    this.itemService.findByIdAndUpdate(this.itemShellTwo).subscribe(data=>{

    })
  }

  async getUserInfo() {
    debugger
    await this.AuthService.userEventEmitter.subscribe(user => {
      this.user = user;

      if(user.userName == 'SHARK' || user.userName == 'sima') {
        this.allowChange = true;
      }
 

    });





  }
}
