import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ComaxItemsService } from "src/app/services/comax-items.service";
import { bool } from "aws-sdk/clients/signer";

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
  subGroupsCopy: any[] = [];
  brands: any[] = [];
  brandsCopy: any[] = [];
  loading: boolean = false;
  syncAuthorized: boolean = false;
  user: any = null;

  searchMenu: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    itemName: new FormControl(""),
    department: new FormControl(""),
    group: new FormControl(""),
    subGroup: new FormControl(""),
    barcode: new FormControl(""),
    customerName: new FormControl(""),
    brandId: new FormControl(""),
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private comaxItemsService: ComaxItemsService
  ) {}

  ngOnInit(): void {
    this.getAllDepartments();
    this.getAllGroups();
    this.getAllSubgroups();
    this.getAllBrands();
    this.getUser();
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    this.syncAuthorized = this.user.authorization.includes("updateItemTree");
    console.log(this.syncAuthorized);
  }

  syncComax() {
    if (!this.syncAuthorized) {
      alert("אינך מורשה לבצע פעולה זו.");
      return;
    }
    let conf = confirm(
      "פעולה זו תסנכרן את המערכת עם פריטי קומקס מהימים האחרונים, האם להמשיך?"
    );
    if (!conf) return;
    this.loading = true;
    this.comaxItemsService.getLastUpdateFrom().subscribe((data) => {
      this.loading = false;
      if (data && data.msg) {
        console.log(data);
        this.toastService.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.toastService.success(`${data.length} items received from Comax`);
        return;
      }
      if (!data || data.length == 0) {
        this.toastService.warning("לא התקבלו פריטים חדשים מהקומקס");
        return;
      }
    });
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
  getAllSubgroups() {
    this.comaxItemsService.getAllCmxSubGroups().subscribe((data) => {
      console.log(data);
      if (data && data.msg) {
        console.log(data);
        this.toastService.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.subGroups = data;
        this.subGroupsCopy = data;
        return;
      }
    });
  }

  getAllBrands() {
    this.comaxItemsService.getAllCmxBrands().subscribe((data) => {
      console.log(data);
      if (data && data.msg) {
        console.log(data);
        this.toastService.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.brands = data;
        this.brandsCopy = data;
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
    this.itemsList = [];
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

  filterSubGroups() {
    let group = this.searchMenu.value.group;
    if (group) {
      this.subGroups = this.subGroupsCopy.filter((sg) => sg.groupId == group);
    } else {
      this.subGroups = this.subGroupsCopy;
    }
  }

  clearSearch() {
    this.searchMenu.reset();
    this.itemsList = [];
    this.brands = this.brandsCopy;
    this.subGroups = this.subGroupsCopy;
    this.groups = this.groupsCopy;
    this.departments = this.departmentsCopy;
  }
}
