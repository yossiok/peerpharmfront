import { ToastrService } from "ngx-toastr";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { InventoryService } from "../../../services/inventory.service";
import { DataPipeline } from "aws-sdk/clients/all";
import { ExcelService } from "src/app/services/excel.service";
import { AuthService } from "../../../services/auth.service";
import { ItemsService } from "../../../services/items.service";
import { Router } from "@angular/router";


@Component({
  selector: "app-itemreports",
  templateUrl: "./itemreports.component.html",
  styleUrls: ["./itemreports.component.scss"],
})
export class ItemreportsComponent implements OnInit {
  // Old Report vars:
  itemShellMovements: any[];
  itemShellMovementsCopy: any[];
  itemsShell: any[];
  itemsShellCopy: any[];
  arrivalDate: Date;
  tableType: String = "arrivals";
  hasMoreItemsToload: boolean = true;
  @ViewChild("fromDateStr") fromDateStr: ElementRef;
  @ViewChild("toDateStr") toDateStr: ElementRef;

  // New report vars
  user: any;
  isLogin: boolean = false;
  products: Array<any> = [];
  productsCopy: Array<any> = [];
  loader:boolean = false;

  constructor(
    private inventoryService: InventoryService,
    private excelService: ExcelService,
    private authService: AuthService,
    private toastService: ToastrService,
    private itemsService: ItemsService,
    private router: Router

  ) {}

  ngOnInit() {
    this.getUserInfo();
    if (this.isLogin) {
      // for the old report:

      // this.getAllItemShells();
      // this.getAllitemShellMovemvents();
      // console.log(this.itemsShell);

      // for the new report:
      this.getProducts();
    } else {
      this.router.navigate([`/peerpharm/login`]);
    }
    
  }

  // New report functions:
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
  exportAsXLSX2() {
    let products = [];
    for (let product of this.products) {
      products.push({
            מקט: product.itemNumber,
            "שם הפריט": product.name,
            "תוקף": `${product.licenseDate} יפוג בעוד ${product.expiredDays} ימים`,
          });

     
    }

    this.excelService.exportAsExcelFile(
      products,
      `דוח רישיונות מוצרים ${new Date().toString().slice(0, 10)}`
    );
  }

  expiredFilter(){
    this.loader =true;
    this.products = this.productsCopy.filter((product)=> product.expiredDays <= 0)
    this.loader =false;


  }
  beforeExpiredFilter(){
    this.loader =true;
    this.products = this.productsCopy.filter((product)=> product.expiredDays > 0)
    this.loader =false;

  }
  getProducts(){
    this.loader = true
    this.itemsService.getLicenseItems().subscribe((res)=>{
      if(!res || res.length < 1){
        this.loader = false
        this.toastService.error("לא נמצאו פריטים")
      }else{
        this.loader = false
        this.products = res
        this.productsCopy = res
      }
    })
  }

  noFilter(){
    this.loader = true;
    this.products = this.productsCopy;
    this.loader = false;
  }




































  // Old report functions:
  getAllItemShells() {
    this.inventoryService.getAllItemShells().subscribe((data) => {
      this.itemsShell = data;
      this.itemsShellCopy = data;

      if (data.length < data.length) {
        this.hasMoreItemsToload == false;
      }
      console.log(this.itemsShell);
    });
  }

  getAllitemShellMovemvents() {
    this.inventoryService.getAllMovements().subscribe((data) => {
      this.itemShellMovements = data;
      this.itemShellMovementsCopy = data;

      if (data.length == data.length) {
        this.hasMoreItemsToload == false;
      } else {
        this.hasMoreItemsToload == false;
        alert("No movements");
      }
    });
  }
  setType(type) {
    switch (type) {
      case "arrivals":
        this.tableType = "arrivals";
        break;
      case "movements":
        this.tableType = "movements";
        break;
    }
  }

  changeText(ev, filterBy) {
    if (filterBy == "itemNumber") {
      let itemNumb = ev.target.value;
      if (itemNumb != "") {
        let tempArr = [];
        this.itemsShellCopy.filter((i) => {
          var check = false;
          var matchAllArr = 0;
          if (i.item.includes(itemNumb.toLowerCase())) {
            tempArr.push(i);
          }
        });

        this.itemsShell = tempArr;
        this.hasMoreItemsToload = false;
      } else {
        this.itemsShell = this.itemsShellCopy.slice();
      }
    }

    if (filterBy == "itemMovementNumber") {
      let itemNumb = ev.target.value;
      if (itemNumb != "") {
        let tempMoveArr = [];
        this.itemShellMovementsCopy.filter((i) => {
          var check = false;
          var matchAllArr = 0;
          if (i.item.includes(itemNumb.toLowerCase())) {
            tempMoveArr.push(i);
          }
        });

        this.itemShellMovements = tempMoveArr;
        this.hasMoreItemsToload = false;
      } else {
        this.itemShellMovements = this.itemShellMovementsCopy.slice();
      }
    }
  }

  dateChange() {
    if (
      this.fromDateStr.nativeElement.value != "" &&
      this.toDateStr.nativeElement.value != ""
    ) {
      this.inventoryService
        .getItemShellsByDate(
          this.fromDateStr.nativeElement.value,
          this.toDateStr.nativeElement.value
        )
        .subscribe((data) => {
          this.itemsShell = data;
          this.itemsShellCopy = data;
          if (data.length <= 0) {
            this.hasMoreItemsToload = false;
            alert("No movements");
          }
        });
    } else {
      this.getAllItemShells();
      this.hasMoreItemsToload = false;
    }
  }

  dateChangeMovements() {
    if (
      this.fromDateStr.nativeElement.value != "" &&
      this.toDateStr.nativeElement.value != ""
    ) {
      this.inventoryService
        .getItemShellsMovementsByDate(
          this.fromDateStr.nativeElement.value,
          this.toDateStr.nativeElement.value
        )
        .subscribe((data) => {
          this.itemShellMovements = data;
          this.itemShellMovementsCopy = data;

          if (data.length <= 0) {
            this.hasMoreItemsToload = false;
            alert("No movements");
          }
        });
    } else {
      this.getAllitemShellMovemvents();
      this.hasMoreItemsToload = false;
    }
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.itemsShell, "data");
  }

  exportAsXLSXmovements(): void {
    this.excelService.exportAsExcelFile(this.itemShellMovements, "data");
  }
}
