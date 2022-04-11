import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { LogsService } from "src/app/services/logs.service";

@Component({
  selector: 'app-qaLogs',
  templateUrl: './qaLogs.component.html',
  styleUrls: ['./qaLogs.component.scss']
})
export class QaLogsComponent implements OnInit {

  user: any;
  isLogin:boolean = false;
  table:Array<any>;
  pageNumber:number = 1;

  constructor(
    private logService:LogsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router,
  ) {}


  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (this.user && this.user.authorization && Number(this.user.screenPermission) <= 6 ) {
        this.isLogin = true;
      }
    }
  }

  paginateNext(){
    this.pageNumber+=1;

    this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
      this.table = res.table;
      if(this.table.length < 1){
        this.pageNumber-=1;
        this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
          this.table = res.table;
          this.toastService.warning("אין תוצאות חזרנו לדף הקודם");
          return;
        });  
      }
    });

  }

  paginatePrevious(){

    if(this.pageNumber < 2){

      this.toastService.warning("אלו התוצאות של הדף הראשון");
      return;

    }

    this.pageNumber-=1;

    this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
      this.table = res.table;
      if(this.table.length < 1){

        this.pageNumber+=1;
        this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
          this.table = res.table;
          this.toastService.warning("אין תוצאות חזרנו לדף הקודם");
          return;
        });
      }
    });

  }

  ngOnInit() {
    this.table = new Array<any>();
    this.router.navigate([`/peerpharm/qa/qaLogs/page/${String(this.pageNumber)}`]);
    this.getUserInfo();
    this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
      this.table = res.table;
      console.log(this.table);
    });    
  }
}
