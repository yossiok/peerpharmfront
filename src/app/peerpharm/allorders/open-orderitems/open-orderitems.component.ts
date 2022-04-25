import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BatchesService } from "src/app/services/batches.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ItemsService } from "src/app/services/items.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";

@Component({
  selector: "app-open-orderitems",
  templateUrl: "./open-orderitems.component.html",
  styleUrls: ["./open-orderitems.component.scss"],
})
export class OpenOrderitemsComponent implements OnInit {
  allOpenOrderItems: any[] = [];
  filteredOpenOrderItems: any[] = [];
  sortToggle: number = 1;
  orderItemsLoader: boolean = false;

  @ViewChild("orderItmeFilter") orderItemFilter: ElementRef;

  constructor(
    private itemService: ItemsService,
    private authService: AuthService,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private creamBarrelService: CreamBarrelService
  ) {}

  ngOnInit(): void {
    this.getAllOpenOrders();
  }

  getAllOpenOrders() {
    this.orderItemsLoader = true;
    this.creamBarrelService.getOpenOrderItemsAndBarrels().subscribe((data) => {
      console.log(data);
      this.allOpenOrderItems = data;
      this.filteredOpenOrderItems = this.allOpenOrderItems;
      this.orderItemsLoader = false;
    });
  }

  //sort by the second level of the array (nested array)
  sortItemsOne(field) {
    let i = this.sortToggle;
    this.filteredOpenOrderItems.sort((a, b) => {
      return a[field] > b[field] ? i : a[field] < b[field] ? -i : 0;
    });
    this.sortToggle *= -1;
  }

  filterOrderItems() {
    let value = this.orderItemFilter.nativeElement.value;
    console.log(value);
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearOrderItems();
    } else {
      this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter((o) =>
        Object.entries(o).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
  }

  clearOrderItems() {
    this.orderItemFilter.nativeElement.value = "";
    this.filteredOpenOrderItems = this.allOpenOrderItems;
  }

  withBarrels() {
    this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter(
      (oi) => oi.relevantBarrels.length > 0
    );
  }

  withoutBarrels() {
    this.filteredOpenOrderItems = this.filteredOpenOrderItems.filter(
      (oi) => !oi.relevantBarrels || oi.relevantBarrels.length == 0
    );
  }
}
