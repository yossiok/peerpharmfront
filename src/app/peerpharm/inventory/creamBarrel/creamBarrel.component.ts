import { Component,OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {CreamBarrelService} from "src/app/services/cream-barrel.service"





import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-creamBarrel",
  templateUrl: "./creamBarrel.component.html",
  styleUrls: ["./creamBarrel.component.scss"],
})
export class CreamBarrelComponent implements OnInit {

  user: any;
  isLogin:boolean = false;
  table:Array<any>;

 
  constructor(
  
    private toastr: ToastrService,
    private creamBarrelService:CreamBarrelService,
    private authService: AuthService
  ) {}

  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (this.user && this.user.authorization && Number(this.user.screenPermission) <= 6 && this.user.authorization.includes("creamProductionManager")  ) {
        this.isLogin = true;
      }
    }
  }

  ngOnInit(){
    this.table = new Array<any>();
    this.getUserInfo();
    this.creamBarrelService.getAllBarrels().subscribe((res)=>{
      this.table = res;
      console.log(this.table);
    }); 
    
  }

  
}
