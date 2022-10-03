import { Component, OnInit } from "@angular/core";
import { LogsService } from "src/app/services/logs.service";
import { UserInfo } from "../../taskboard/models/UserInfo";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-historylogs",
  templateUrl: "./historylogs.component.html",
  styleUrls: ["./historylogs.component.scss"],
})
export class HistorylogsComponent implements OnInit {
  user: UserInfo;
  logs: any[] = [];
  logsCopy: any[] = [];
  hasAuthorization: boolean = false;
  loader: boolean = true;

  constructor(
    private authService: AuthService,
    private logsService: LogsService
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.logsService.getAll().subscribe((data) => {
      data.forEach((log) => {
        log.objectToSave = JSON.parse(log.objectToSave);
      });
      this.logs = data;
      this.logsCopy = data;
      this.loader = false;
    });
  }

  async getUserInfo() {
    this.user = await this.authService.loggedInUser;
    this.hasAuthorization =
      this.user.authorization &&
      this.user.authorization.includes("viewReports");
  }

  filterReports(ev) {
    this.logs = this.logsCopy;
    let tableType = ev.target.value;
    if (tableType != "All") {
      this.logs = this.logs.filter((l) => l.model == tableType);
    } else {
      this.logs = this.logsCopy;
    }
  }
}
