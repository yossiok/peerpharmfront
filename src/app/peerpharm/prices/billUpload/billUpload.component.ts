import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import * as XLSX from "xlsx";
import { getJsDateFromExcel } from "excel-date-to-js";
import { FinanceService } from "src/app/services/finance.service";
import { ToastrService } from "ngx-toastr";
import { CostumersService } from "src/app/services/costumers.service";

@Component({
  selector: "app-billUpload",
  templateUrl: "./billUpload.component.html",
  styleUrls: ["./billUpload.component.scss"],
})
export class BillUploadComponent implements OnInit {
  @ViewChild("uploadExFile") uploadExFile: ElementRef;
  customerNumber: string = "";
  priceList: Array<any>;

  constructor(
    private financeService: FinanceService,
    private costumersService: CostumersService,
    private toastSrv: ToastrService
  ) {}

  ngOnInit() {}

  sendExcelToData(ev: any) {
    const target: DataTransfer = <DataTransfer>ev.target;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (event: any) => {
      const binaryStr = event.target.result;
      const workBook: XLSX.WorkBook = XLSX.read(binaryStr, {
        type: "binary",
      });
      const workSheet: XLSX.WorkSheet = workBook.Sheets[workBook.SheetNames[0]];
      let currentJson = XLSX.utils.sheet_to_json(workSheet);
      if (currentJson) {
        this.priceList = currentJson.map((price) => {
          return {
            item: price["פריט"],
            name: price["שם"],
            barcode: price["ברקוד"],
            price: price["מחיר"],
            updatePriceDate: getJsDateFromExcel(price["מתאריך"]),
            discount: price["הנחה"] ? price["הנחה"] : null,
          };
        });
      }
    };
    this.uploadExFile = undefined;
  }

  uploadToServer() {
    if (!this.customerNumber || this.customerNumber.length < 2) {
      this.toastSrv.error("אנא הכנס מספר לקוח");
      return;
    }
    this.customerNumber = this.customerNumber.trim();
    this.costumersService
      .getByCostumerId(this.customerNumber)
      .subscribe((res) => {
        if (!res || res.length != 1) {
          this.toastSrv.error("מספר לקוח לא תקין, אנא נסה שוב");
          return;
        } else {
          const priceList = {
            customerNumber: this.customerNumber,
            products: this.priceList,
          };
          this.financeService.updateCMXPriceList(priceList).subscribe((res) => {
            if (res && res.msg && res.msg == "ok") {
              this.toastSrv.success("מחירון עלה בהצלחה");
              this.customerNumber = "";
              this.uploadExFile = undefined;
            } else {
              this.toastSrv.error("משהו השתבש, נס שנית");
            }
          });
        }
      });
  }
}
