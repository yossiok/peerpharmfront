import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PeerPharmRputs } from '../peerpharm.routing';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';


@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  routes: any[];
  users: any[];
  screens: any[];
  whareHouses: any[];
  EditRowId:any;


  @ViewChild('screenValue') screenValue: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.edit('');
  }

  constructor(private toastService: ToastrService, 
    private inventoryService: InventoryService,
    private userService: UsersService) { }

  async ngOnInit() {
    await this.getAllWhareHouses()
    this.userService.getAllScreens().subscribe(data=>
      {
        debugger
        this.routes = [...data]; 
      });
      this.getAllUsers();

  }

  async getAllUsers() {
    await this.whareHouses
    this.userService.getAllUsers().subscribe(users => {
      // FAILED: trying to get wharehouses names but names doesnt match IDs.... ????
      // users.map(user=> {
      //   if(user.allowedWH.length > 0) {
      //     for(let i = 0; i< user.allowedWH.length; i++) {
      //       for(let whareHouseObj of this.whareHouses) {
      //         if (whareHouseObj._id == user.allowedWH[i]) {
      //           user.allowedWH[i] = whareHouseObj.name
      //           return user
      //         } 
      //       }
      //     }
      //   } 
      //   else return user
      // } )
      this.users = users;
    })
  }

  getAllWhareHouses(){
    this.inventoryService.getWhareHousesList().subscribe(whareHouses => {
      this.whareHouses = whareHouses
    })
  }

  edit(id){
  if(id != ''){
    this.EditRowId = id
  } else{
    this.EditRowId = ''
  }
  }

  setUserPermissionLvl(ev, id) {
    var permLevel = ev.target.value;
    this.userService.setUserPermission(permLevel, id).subscribe(user => {
      if (user) {
        var oldUser = this.users.find(u => u._id == user._id)
        oldUser.screenPermission = user.screenPermission
        this.toastService.success('הרשאת משתמש עודכנה בהצלחה !')
        this.edit('');
      }
    })
  }

  savePermission(name) {
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


