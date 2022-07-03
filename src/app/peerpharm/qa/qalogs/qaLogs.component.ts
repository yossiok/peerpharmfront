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
  showLogsModal:boolean = false;

  lineSort:number =1;
  batchSort:number =1;
  openSort:number =1;
  closeSort:number =1;
  workTimeSort:number =1;
  qtySort:number =1;
  produceSort:number =1;
  PercentageSort:number =1;
  unitSort:number =1;

  logsArray:Array<any> = [];
  

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

  

  ngOnInit() {
    this.table = new Array<any>();
    this.router.navigate([`/peerpharm/qa/qaLogs/page/${String(this.pageNumber)}`]);
    this.getUserInfo();
    this.logService.getQaLogs(String(this.pageNumber)).subscribe((res)=>{
      this.table = res.table;
    });    
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

  sortByLine(){
    if(this.lineSort == 1){
      this.lineSort = -1;
      this.table.sort((a,b)=>{
        return (Number(a.line) - Number(b.line))
      })
      return

    }else{
      this.lineSort = 1;
      this.table.sort((a,b)=>{
        return (Number(b.line) - Number(a.line))
      })
      return

    }
  }

  sortByBatch(){
    if(this.batchSort == 1){
      this.batchSort = -1;
      this.table.sort((a,b)=>{
        return (Number(a.batch.slice(0,2)) - Number(b.batch.slice(0,2)) || Number(a.batch.slice(4)) - Number(b.batch.slice(4)))
      })
      return

    }else{
      this.batchSort = 1;
      this.table.sort((a,b)=>{
        return (Number(b.batch.slice(0,2)) - Number(a.batch.slice(0,2)) || Number(b.batch.slice(4)) - Number(a.batch.slice(4)))
      })
      return

    }
  }


  sortByCloseLot(){
    if(this.closeSort == 1){
      this.closeSort = -1;
      this.table.sort((a,b)=>{

        // return (
        //   Number(a.closeLot.split(",")[0].split("-")[0]) - Number(b.closeLot.split(",")[0].split("-")[0])
        //   ||
        //   Number(a.closeLot.split(",")[0].split("-")[1]) - Number(b.closeLot.split(",")[0].split("-")[1])
        //   ||
        //   Number(a.closeLot.split(",")[0].split("-")[2]) - Number(b.closeLot.split(",")[0].split("-")[2])
        //   ||
        //   Number(a.closeLot.split(",")[1].trim().split(":")[0]) - Number(b.closeLot.split(",")[1].trim().split(":")[0])
        //   ||
        //   Number(a.closeLot.split(",")[1].trim().split(":")[1]) - Number(b.closeLot.split(",")[1].trim().split(":")[1])
        //   )
        return (
          new Date(a.closeLot).getTime() - new Date(b.closeLot).getTime()
        )
      })
      return

    }else{
      this.closeSort = 1;
      this.table.sort((a,b)=>{


        // return (
        //   Number(b.closeLot.split(",")[0].split("-")[0]) - Number(a.closeLot.split(",")[0].split("-")[0])
        //   ||
        //   Number(b.closeLot.split(",")[0].split("-")[1]) - Number(a.closeLot.split(",")[0].split("-")[1])
        //   ||
        //   Number(b.closeLot.split(",")[0].split("-")[2]) - Number(a.closeLot.split(",")[0].split("-")[2])
        //   ||
        //   Number(b.closeLot.split(",")[1].trim().split(":")[0]) - Number(a.closeLot.split(",")[1].trim().split(":")[0])
        //   ||
        //   Number(b.closeLot.split(",")[1].trim().split(":")[1]) - Number(a.closeLot.split(",")[1].trim().split(":")[1])
        // )
        return (
          new Date(b.closeLot).getTime() - new Date(a.closeLot).getTime()
        )
      })
      return

    }
  }
  sortByOpenLot(){
    if(this.openSort == 1){
      this.openSort = -1;
      this.table.sort((a,b)=>{

        return (
          Number(a.openLot.split(",")[0].split("/")[2]) - Number(b.openLot.split(",")[0].split("/")[2])
          ||
          Number(a.openLot.split(",")[0].split("/")[1]) - Number(b.openLot.split(",")[0].split("/")[1])
          ||
          Number(a.openLot.split(",")[0].split("/")[0]) - Number(b.openLot.split(",")[0].split("/")[0])
          ||
          Number(a.openLot.split(",")[1].trim().split(":")[0]) - Number(b.openLot.split(",")[1].trim().split(":")[0])
          ||
          Number(a.openLot.split(",")[1].trim().split(":")[1]) - Number(b.openLot.split(",")[1].trim().split(":")[1])
          )
      })
      return

    }else{
      this.openSort = 1;
      this.table.sort((a,b)=>{


        return (
          Number(b.openLot.split(",")[0].split("/")[2]) - Number(a.openLot.split(",")[0].split("/")[2])
          ||
          Number(b.openLot.split(",")[0].split("/")[1]) - Number(a.openLot.split(",")[0].split("/")[1])
          ||
          Number(b.openLot.split(",")[0].split("/")[0]) - Number(a.openLot.split(",")[0].split("/")[0])
          ||
          Number(b.openLot.split(",")[1].trim().split(":")[0]) - Number(a.openLot.split(",")[1].trim().split(":")[0])
          ||
          Number(b.openLot.split(",")[1].trim().split(":")[1]) - Number(a.openLot.split(",")[1].trim().split(":")[1])
        )
      })
      return

    }
  }

  updateLogsArray(row){
    if(this.logsArray.includes(row)){
      this.logsArray = this.logsArray.filter((x)=> x.line != row.line && x.batch != row.batch && x.openLot != row.openLot && x.closeLot != row.closeLot)
    }else{
      this.logsArray.push(row)
    }
    console.log(this.logsArray.length);
  }
 


}
