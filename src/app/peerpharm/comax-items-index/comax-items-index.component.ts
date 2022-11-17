import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ComaxItemsService } from "src/app/services/comax-items.service";

@Component({
  selector: "app-comax-items-index",
  templateUrl: "./comax-items-index.component.html",
  styleUrls: ["./comax-items-index.component.scss"],
})
export class ComaxItemsIndexComponent implements OnInit {
  itemsList: any[] = [];
  departments: any[] = [];
  departmentsCopy: any[] = [];

  groups: any[] = [];
  groupsCopy: any[] = [];
  subGroups: any[] = [];
  loading: boolean = false;
  // subGroups: any[] = [
  //   { id: "120", name: "מדיסקין" },
  //   { id: "5000", name: "Argan" },
  //   { id: "5001", name: "Conditioner" },
  //   { id: "5002", name: "Curly" },
  //   { id: "5003", name: "Dry" },
  //   { id: "5004", name: "Dry & Damaged" },
  //   { id: "5005", name: "Dry & Frizzy" },
  //   { id: "5006", name: "For All" },
  //   { id: "5007", name: "Keratin" },
  //   { id: "5008", name: "Keraxir" },
  //   { id: "5009", name: "Mineral" },
  //   { id: "5010", name: "Mud" },
  //   { id: "5011", name: "Recover" },
  //   { id: "5012", name: "Salt Free" },
  //   { id: "5013", name: "Silk" },
  //   { id: "9915", name: "מארז" },
  // ];

  searchMenu: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    itemName: new FormControl(""),
    department: new FormControl(""),
    group: new FormControl(""),
    subGroup: new FormControl(""),
    barcode: new FormControl(""),
    customerName: new FormControl(""),
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private comaxItemsService: ComaxItemsService
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
    this.getAllGroups();
  }

  getAllDepartments() {
    this.comaxItemsService.getAllCmxDepartments().subscribe((data) => {
      console.log(data);

      if (data && data.msg) {
        console.log(data);
        this.toastService.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.departments = data;
        this.departmentsCopy = data;
        return;
      }
      if (!data || data.length == 0) {
        this.toastService.error("לא נמצאו מחלקות");
        return;
      }
    });
  }

  getAllGroups() {
    this.comaxItemsService.getAllCmxGroups().subscribe((data) => {
      console.log(data);

      if (data && data.msg) {
        console.log(data);
        this.toastService.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.groups = data;
        this.groupsCopy = data;
        return;
      }
      if (!data || data.length == 0) {
        this.toastService.error("לא נמצאו קבוצות");
        return;
      }
    });
  }

  getItems() {
    console.log(this.searchMenu.value);
    let empty = true;
    for (let prop in this.searchMenu.value) {
      if (this.searchMenu.value[prop]) {
        empty = false;
        break;
      }
    }
    if (empty) {
      alert("יש לבחור לפחות שדה אחד");
      return;
    }
    this.loading = true;
    this.comaxItemsService
      .getComaxItemsByQuery(this.searchMenu.value)
      .subscribe((data) => {
        this.loading = false;
        console.log(data);
        if (data && data.msg) {
          this.toastService.error(data.msg);
          return;
        }
        if (data && data.length > 0) {
          this.itemsList = data;
          return;
        }
      });
  }
  filterGroup() {
    let departmentId = this.searchMenu.value.department;

    if (departmentId) {
      this.groups = this.groupsCopy.filter(
        (gr) => gr.departmentId == departmentId
      );
    } else {
      this.groups = this.groupsCopy;
    }
  }

  clearSearch() {
    this.searchMenu.reset();
    this.itemsList = [];
  }
}
