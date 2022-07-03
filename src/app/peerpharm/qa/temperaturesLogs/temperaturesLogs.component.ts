import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ReportsService } from "src/app/services/reports.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-temperaturesLogs",
  templateUrl: "./temperaturesLogs.component.html",
  styleUrls: ["./temperaturesLogs.component.scss"],
})
export class TemperaturesLogsComponent implements OnInit {
  user: any;
  isLogin: boolean = false;
  temperatures: Array<any> = [];
  temperaturesCopy: Array<any> = [];
  position: string = "";
  resultAlert: boolean = false;
  startDate:string=""
  endDate:string=""
  startTime:string=""
  endTime:string=""
  loader:boolean = false

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.user = this.authService.loggedInUser;
      if (
        this.user &&
        this.user.authorization &&
        Number(this.user.screenPermission) <= 6
      ) {
        this.isLogin = true;
      }
    }
  }

  ngOnInit() {
    this.getUserInfo();
    if (this.isLogin) {
      this.loader = true;
      this.reportsService
        .getTemperaturesLogsByDate()
        .subscribe((res) => {
          this.loader = false
          this.temperatures = res.temperatures;
          this.temperaturesCopy = res.temperatures;
          if(this.temperatures.length < 1){
            this.resultAlert = true
          }else{
            this.resultAlert = false
          }
        });
    } else {
      this.router.navigate([`/peerpharm/login`]);
    }
  }

  positionFilter() {
    if (this.position == "") {
      return;
    }
    if (this.position == "all") {
      this.temperatures = this.temperaturesCopy;
      return;
    } else {
      this.temperatures = this.temperaturesCopy.filter(
        (x) => x.device == this.position
      );
      if (this.temperatures.length < 1) {
        this.resultAlert = true;
      }else{
        this.resultAlert = false
      }
    }
  }

  search(){
    if(!this.startDate || !this.endDate){
      if(!this.startDate){
      this.toastService.warning("נא להזין תאריך התחלה");
      }
      if(!this.endDate){
      this.toastService.warning("נא להזין תאריך סיום");
      }
      return
    }
    if(this.startTime && !this.endTime){
      this.toastService.warning("נא להזין זמן התחלה");
      return
    }
    if(!this.startTime && this.endTime){
      this.toastService.warning("נא להזין זמן סיום");
      return
    }
    if(this.startTime && this.endTime){
      this.loader = true;
      this.reportsService.getTemperaturesLogsByDate(this.startDate,this.endDate,this.startTime,this.endTime).subscribe((res)=>{
        this.loader = false;
        this.temperatures = res.temperatures;
        this.temperaturesCopy = res.temperatures;
        if(this.temperatures.length < 1){
          this.resultAlert = true;
        }else{
          this.resultAlert = false;
        }
      })
    }else{
      this.loader = true;
      this.reportsService.getTemperaturesLogsByDate(this.startDate,this.endDate).subscribe((res)=>{
        this.loader = false;
        this.temperatures = res.temperatures;
        this.temperaturesCopy = res.temperatures;
        if(this.temperatures.length < 1){
          this.resultAlert = true;
        }else{
          this.resultAlert = false;
        }
      })
    }
  }
}
