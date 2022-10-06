import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { AuthService } from "src/app/services/auth.service";
import { FormulesService } from "src/app/services/formules.service";
import { ExcelService } from "src/app/services/excel.service";

@Component({
  selector: "app-cmpt-history",
  templateUrl: "./cmpt-history.component.html",
  styleUrls: ["./cmpt-history.component.scss"],
})
export class CmptHistoryComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;

  componentsList: any[] = [];

  componentSearchForm: FormGroup = new FormGroup({
    componentN: new FormControl("", Validators.required),
    componentName: new FormControl(""),
  });

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private fourmulesService: FormulesService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("newOrder");
  }

  getComponentByNumber() {
    console.log(this.componentSearchForm.value.componentN);
  }

  getComponentByName() {
    console.log(this.componentSearchForm.value.componentName);
  }
}
