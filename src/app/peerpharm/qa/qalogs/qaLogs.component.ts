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
  table:Array<any> = [];
  showLogsModal:boolean = false;
  loader = true;

  lineSort:number =1;
  batchSort:number =1;
  openSort:number =1;
  closeSort:number =1;
  logsArray:Array<any> = [];

  startDate:string="";
  endDate:string="";
  

  constructor(
    private logService:LogsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router,
  ) {}


  

  ngOnInit() {
    this.getLogs();   
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
        return (
          new Date(a.closeLot).getTime() - new Date(b.closeLot).getTime()
        )
      })
      return

    }else{
      this.closeSort = 1;
      this.table.sort((a,b)=>{
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

  getLogs(startDate?,endDate?){
    console.log(startDate,endDate);
    this.loader = true
    this.logService.getQaLogs(startDate,endDate).subscribe((res)=>{
      this.table = res.table;
      this.loader = false
    });
  }
 


}
