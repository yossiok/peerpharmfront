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
  items:Array<any> = []
  itemsCopy:Array<any> = []
  isLogin:boolean = false
  loader:boolean = false


  nameInputFilter:string=""
  barcodeInputFilter:string=""
  customerInputFilter:string=""
  startDateInputFilter:string=""
  endDateInputFilter:string=""

  
  barcodeSort:boolean = false
  nameSort:boolean = false
  customerSort:boolean = false
  statusSort:boolean = false
  licenseSort:boolean = false
  updateDateSort:boolean = false



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
      return
    }else{
      this.items = this.items.filter((item)=>item.name.toLowerCase().includes(this.nameInputFilter.toLowerCase()))
    }
  }
  filterByBarcode(){
    if(!this.barcodeInputFilter || this.barcodeInputFilter.length == 0){
      return
    }else{
      this.items = this.items.filter((item)=> item.barcode.includes(this.barcodeInputFilter))
    }
  }
  filterByCustomer(){
    if(!this.customerInputFilter || this.customerInputFilter.length == 0){
      return
    }else{
      this.items = this.items.filter((item)=> item.customer.includes(this.customerInputFilter))
    }
  }
  filterByUpdateDate(){
    if(!this.startDateInputFilter || this.startDateInputFilter.length < 1 || !this.endDateInputFilter || this.endDateInputFilter.length < 1){
      return
    }
    if(this.startDateInputFilter && this.startDateInputFilter.length > 0 && this.endDateInputFilter && this.endDateInputFilter.length > 0){
      let start = new Date(this.startDateInputFilter).getTime() - 24*60*60*1000
      let end = new Date(this.endDateInputFilter).getTime() + 24*60*60*1000
      this.items = this.items.filter((item)=> new Date(item.updateDate).getTime() > start && new Date(item.updateDate).getTime() < end)
    }
  }
  clear(){
    this.nameInputFilter = ""
    this.barcodeInputFilter = ""
    this.customerInputFilter = ""
    this.startDateInputFilter = ""
    this.endDateInputFilter = ""
    this.items = this.itemsCopy
  }
  sortByBarcode(){
    if(this.barcodeSort){
      this.items.sort((a,b)=>{
        return Number(b.barcode) - Number(a.barcode)
      })
      this.barcodeSort = !this.barcodeSort
    }else{
      this.items.sort((a,b)=>{
        return Number(a.barcode) - Number(b.barcode)
      })
      this.barcodeSort = !this.barcodeSort
    }
  }
  sortByName(){
      if(this.nameSort){
        this.items.sort((a,b)=>{
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
        })
        this.nameSort = !this.nameSort
      }else{
        this.items.sort((a,b)=>{
          if(a.name > b.name) { return -1; }
          if(a.name < b.name) { return 1; }
        })
        this.nameSort = !this.nameSort
      }
  }
  sortByCustomer(){
    if(this.customerSort){
      this.items.sort((a,b)=>{
        if(a.customer.includes(" ") && !b.customer.includes(" ")){
          return a.customer.split(" ")[0] - b.customer
        }else if(!a.customer.includes(" ") && b.customer.includes(" ")){
          return a.customer - b.customer.split(" ")[0]
        }else if(a.customer.includes(" ") && b.customer.includes(" ")){
          return a.customer.split(" ")[0] - b.customer.split(" ")[0]
        }else{
          return a.customer - b.customer
        }
      })
      this.customerSort = !this.customerSort
    }else{
      this.items.sort((a,b)=>{
        if(a.customer.includes(" ") && !b.customer.includes(" ")){
          return b.customer.split(" ")[0] - a.customer
        }else if(!a.customer.includes(" ") && b.customer.includes(" ")){
          return b.customer - a.customer.split(" ")[0]
        }else if(a.customer.includes(" ") && b.customer.includes(" ")){
          return b.customer.split(" ")[0] - a.customer.split(" ")[0]
        }else{
          return b.customer - a.customer
        }
      })
      this.customerSort = !this.customerSort
    }
  }
  sortByStatus(){
    if(this.statusSort){
      this.items.sort((a,b)=>{
        return a.status - b.status
      })
      this.statusSort = !this.statusSort

    }else{
      this.items.sort((a,b)=>{
        return b.status - a.status
      })
      this.statusSort = !this.statusSort

    }
  }
  sortByLicense(){
    if(this.licenseSort){
      this.items.sort((a,b)=>{
        return a.licenseRequired - b.licenseRequired
      })
      this.licenseSort = !this.licenseSort

    }else{
      this.items.sort((a,b)=>{
        return b.licenseRequired - a.licenseRequired
      })
      this.licenseSort = !this.licenseSort

    }
  }
  sortByUpdateDate(){
    if(this.updateDateSort){
      this.items.sort((a,b)=>{
        return new Date(a.updateDate).getTime() - new Date(b.updateDate).getTime()
      })
      this.updateDateSort = !this.updateDateSort

    }else{
      this.items.sort((a,b)=>{
        return new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime()
      })
      this.updateDateSort = !this.updateDateSort

    }
  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(
      this.items,
      `Items Index ${new Date().toString().slice(0, 10)}`
    );
  }
}
