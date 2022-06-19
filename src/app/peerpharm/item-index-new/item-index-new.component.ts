import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ExcelService } from "src/app/services/excel.service";
import { Router } from "@angular/router";
import { ItemsService } from "src/app/services/items.service";

@Component({
  selector: "app-item-index-new",
  templateUrl: "./item-index-new.component.html",
  styleUrls: ["./item-index-new.component.scss"],
})
export class ItemIndexNewComponent implements OnInit {
  nameInputFilter:string=""
  barcodeInputFilter:string=""
  customerInputFilter:string=""
  items:Array<any> = []
  itemsCopy:Array<any> = []
  isLogin:boolean = false
  loader:boolean = false



  constructor(
    private toastSrv: ToastrService,
    private authService: AuthService,
    private excelService: ExcelService,
    private router: Router,
    private itemsService: ItemsService,

  ) {}

  ngOnInit(): void {
    this.getUserInfo()
    if(!this.isLogin){
      this.router.navigate([`/peerpharm/login`]);
    }else{
      this.getItems()
    }
  }
  getUserInfo() {
    if (this.authService.loggedInUser) {
      this.isLogin = true;
    }
  }
  getItems(){
    this.loader = true
    this.itemsService.getIndexItems().subscribe((res)=>{
      this.items = res
      this.itemsCopy = res
      this.loader = false
    })
  }
  filterByName(){
    if(!this.nameInputFilter || this.nameInputFilter.length == 0){
      this.items = this.itemsCopy
    }else{
      this.items = this.itemsCopy.filter((item)=>item.name.toLowerCase().includes(this.nameInputFilter.toLowerCase()))
    }
  }
  filterByBarcode(){
    if(!this.barcodeInputFilter || this.barcodeInputFilter.length == 0){
      this.items = this.itemsCopy
    }else{
      this.items = this.itemsCopy.filter((item)=> item.barcode.includes(this.barcodeInputFilter))
    }
  }
  filterByCustomer(){
    if(!this.customerInputFilter || this.customerInputFilter.length == 0){
      this.items = this.itemsCopy
    }else{
      this.items = this.itemsCopy.filter((item)=> item.customer.includes(this.customerInputFilter))
    }
  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(
      this.items,
      `Items Index ${new Date().toString().slice(0, 10)}`
    );
  }
}
