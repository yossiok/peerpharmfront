import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BatchesService } from "src/app/services/batches.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ItemsService } from "src/app/services/items.service";
import { CreamBarrelService } from "src/app/services/cream-barrel.service";

@Component({
  selector: "app-bulks-report",
  templateUrl: "./bulks-report.component.html",
  styleUrls: ["./bulks-report.component.scss"],
})
export class BulksReportComponent implements OnInit {
  @Input("allWarehouses") allWarehouses: any[];

  allBarrels: any[] = [];
  filteredBarrelsList: any[];
  barrelsLoader: boolean = false;

  @ViewChild("barrelFilter") barrelFilter: ElementRef;
  constructor(
    private itemService: ItemsService,
    private authService: AuthService,
    private batchService: BatchesService,
    private toastSrv: ToastrService,
    private creamBarrelService: CreamBarrelService
  ) {}

  ngOnInit(): void {
    this.getAllBarrels();
  }

  getAllBarrels() {
    this.barrelsLoader = true;
    this.creamBarrelService.getBarrelsAndOrderItems().subscribe((data) => {
      console.log(data);
      if (data) {
        this.allBarrels = data;
        for (let barrel of this.allBarrels) {
          let order = barrel.relevantOrders.find(
            (o) => o.batchUsed == barrel.batchNumber
          );
          barrel.orderNumber = order ? order.orderNumber : barrel.orderNumber;
        }
        this.filteredBarrelsList = this.allBarrels;
        console.log(this.filteredBarrelsList);
        this.barrelsLoader = false;
      }
    });
  }
  filterBarrels(e) {
    console.log(e.target.value);
    let value = e.target.value;
    console.log(value);
    value = String(value).toLowerCase().trim();
    if (value == "") {
      this.clearBarrelsList();
    } else {
      // let array = [...this.filteredOrderItems];
      // let arrayCopy = [...this.filteredOrderItems];
      this.filteredBarrelsList = this.filteredBarrelsList.filter((b) =>
        Object.entries(b).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
  }

  clearBarrelsList() {
    this.barrelFilter.nativeElement.value = "";
    this.filteredBarrelsList = this.allBarrels;
  }
  filterOrders() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.relevantOrders.length > 0;
    });
  }
  getReturned() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.barrelStatus == "returned";
    });
  }

  hasOrder() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return b.orderNumber;
    });
  }
  noOrder() {
    this.filteredBarrelsList = this.filteredBarrelsList.filter((b) => {
      return !b.orderNumber;
    });
  }
}
