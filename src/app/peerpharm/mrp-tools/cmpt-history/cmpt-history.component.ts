import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ItemsService } from "src/app/services/items.service";
import { InventoryService } from "src/app/services/inventory.service";
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
  ready: boolean = false;

  componentsList: any[] = [];
  chosenComponent: any = null;

  componentSearchForm: FormGroup = new FormGroup({
    componentN: new FormControl("", Validators.required),
    componentName: new FormControl(""),
  });

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private fourmulesService: FormulesService,
    private excelService: ExcelService,
    private inventoryService: InventoryService
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
    let componentN = this.componentSearchForm.value.componentN;
    this.inventoryService.getItemByNumber(componentN).subscribe((data) => {
      if (data.msg) {
        this.toastr.error(data.msg);
        return;
      } else if (data) {
        this.componentSearchForm.controls.componentName.setValue(
          data.componentName
        );
      } else if (!data) {
        this.toastr.error("הפריט לא נמצא");
      }
    });
  }

  getComponentByName() {
    console.log(this.componentSearchForm.value.componentName);
    let regName = this.componentSearchForm.value.componentName;
    this.inventoryService.getNamesByRegex(regName).subscribe((data) => {
      console.log(data);
      this.componentsList = data;

      if (this.componentsList.length == 1) {
        this.componentSearchForm.controls.componentName.setValue(
          this.componentsList[0].componentName
        );
        this.componentSearchForm.controls.componentN.setValue(
          this.componentsList[0].componentN
        );
      }
      console.log(this.componentSearchForm.value);
    });
  }
  chooseComponent() {
    if (!this.componentSearchForm.valid) {
      alert("יש לבחור פריט");
      return;
    }

    this.inventoryService
      .getItemByNumber(this.componentSearchForm.value.componentN)
      .subscribe((data) => {
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data) {
          this.chosenComponent = data;
          console.log(data);
          return;
        } else if (!data) {
          this.toastr.error("פריט לא נמצא");
          return;
        }
      });
  }
}
