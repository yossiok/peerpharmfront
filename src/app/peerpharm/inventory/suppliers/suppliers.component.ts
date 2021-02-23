import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})



export class SuppliersComponent implements OnInit {
  closeResult: string;
  suppliersAlterArray:any[];
  suppliers: any[];
  itemPurchases: any[];
  suppliersCopy: any[];
  alternSupplier: any[];
  alterSupplierToPush:string;
  alterSupplierArray:any[] = [];
  tableType:string = "suppliers";
  suppliersOrderItems:any[];
  suppliersOrderItemsCopy:any[];
  hasMoreItemsToload: boolean = true;
  updateSupplier: boolean = false;
  showItemPurchases: boolean = false;
  currentSupplier = {
    suplierNumber: '',
    suplierName: '',
    address: '',
    city: '',
    phoneNum: '',
    cellularNum: '',
    faxNum: '',
    lastUpdated: '',
    country:'',
    email:'',
    contactName:'',
    currency:'',
    remarks:'',
    alternativeSupplier:this.alterSupplierArray,
    items:[],
    priceList:[],
    import:''
  }

  priceListItem = {
    itemNumber:'',
    itemName:'',
    supplierPrice:'',
    itemCoin:''
  }

  supplier = {
    suplierNumber: '',
    suplierName: '',
    address: '',
    city: '',
    phoneNum: '',
    cellularNum: '',
    faxNum: '',
    lastUpdated: '',
    country:'',
    email:'',
    contactName:'',
    currency:'',
    remarks:'',
    alternativeSupplier:this.alterSupplierArray,
    items:[],
    import:''

  }


  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
  private container: ElementRef;
  @ViewChild('container') set content(content: ElementRef) {
    this.container = this.content;
  }



  constructor(private inventoryService:InventoryService,private route: ActivatedRoute,private excelService: ExcelService,private procurementService: Procurementservice, private modalService: NgbModal, private supplierService: SuppliersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

  open(content) {
    
    this.supplier = {
      suplierNumber: '',
      suplierName: '',
      address: '',
      city: '',
      phoneNum: '',
      cellularNum: '',
      faxNum: '',
      lastUpdated: '',
      country:'',
      email:'',
      contactName:'',
      currency:'',
      remarks:'',
      alternativeSupplier:this.alterSupplierArray,
      items:[],
      import:''

    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      
      console.log(result);

      if (result == 'Saved') {
        this.saveSupplier();
      }
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(content, i) {
 
    console.log(this.suppliers[i]);
    this.supplier = this.supplier[i];
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        this.saveSupplier();
      }
    })
  }

  fillItemName(ev){
    ;
  var itemNumber = ev.target.value;
  
  if(itemNumber != ''){
    this.inventoryService.getCmptByitemNumber(itemNumber).subscribe(data=>{
      if(data){
        this.priceListItem.itemName = data[0].componentName
      }
    })
  }
  }

  getAlternativeSuppliers() {
   
    this.supplierService.getAllAlternativeSuppliers().subscribe(res => {
      this.alternSupplier = res
      console.log(this.alternSupplier);


    });
  }

  getSuppliers() {
    
    this.supplierService.getAllSuppliers().subscribe(res => {
      this.suppliers = res
      this.suppliersCopy = res
      
      var currentAlterSupp = [];
      this.suppliers.forEach(function (supplier) {
        currentAlterSupp.push(supplier.alternativeSupplier);
      });
      this.suppliersAlterArray = currentAlterSupp;
});

}

getSuppliersOrderedItems() {
 
  this.procurementService.getProcurementOrderItem().subscribe(res => {
    this.suppliersOrderItems = res
    this.suppliersOrderItemsCopy = res

    if(res.length == res.length) {
      this.hasMoreItemsToload == false;
    }
    
    console.log(this.suppliersOrderItems)
});

}

setType(type) {

  switch (type) {
    case 'suppliers':
      this.tableType = "suppliers"
      break;
    case 'supplierReports':
    this.tableType = "supplierReports"
      break;

  }
}


  saveSupplier() {
    ;
    if(this.supplier.suplierName != "" && this.supplier.suplierNumber != "") {
    this.supplierService.addorUpdateSupplier(this.supplier).subscribe(res => {
      console.log(res);
      // if (res == "updated") this.toastSrv.info(this.supplier.suplierName, "Changes Saved");
      // else if (res.includes("Saved")) {
      
        this.toastSrv.success(this.supplier.suplierName, "New Costumer Saved");
        this.suppliers.push(this.supplier);
        
      
      // else this.toastSrv.error("Failed" , res);
    })
  } else { 
    this.toastSrv.error("Please fill all the missing fields");
  }
  }

  private getDismissReason(reason: any): string {
  
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  changeText(ev)
  {
    
    let word= ev.target.value;
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.suppliers.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.suplierName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.suppliers= tempArr;
         this.hasMoreItemsToload = false;
         
    }else{
      
      this.suppliers=this.suppliersCopy.slice();
    }
  }


  searchSupplier(supplierName){
;
    var word = supplierName
    if(word != "" && word != undefined){
      this.suppliers = this.suppliersCopy.filter(s=>s.suplierName == supplierName);
      this.openData(this.suppliers[0].suplierNumber)
    }
    else {
      this.suppliers = this.suppliers
    }
    

  }

  searchName(ev)
  {
  
      var word = ev.target.value;

    var wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.suppliersOrderItems.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.supplierName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.suppliersOrderItems= tempArr;
         this.hasMoreItemsToload = false;
         
    }else{
      
      this.suppliersOrderItems=this.suppliersOrderItemsCopy.slice();
    }
  }

  searchNumber(ev)
  {
    
    let word= ev.target.value;
    
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.suppliersOrderItems.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.itemNumber==w ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.suppliersOrderItems= tempArr;
         this.hasMoreItemsToload = false;
    }else{
      
      this.suppliersOrderItems=this.suppliersOrderItemsCopy.slice();
    }
  }

  addItemToPriceList(){
    ;
    if(this.priceListItem.itemName != '' && this.priceListItem.itemNumber != '' && this.priceListItem.supplierPrice != '' ){
      this.currentSupplier.priceList.push(this.priceListItem)
      this.priceListItem = {
        itemName:'',
        itemNumber:'',
        supplierPrice:'',
        itemCoin:'',
      }
      this.toastSrv.success('פריט נוסף בהצלחה - לא לשכוח לעדכן !')
    } else {
      this.toastSrv.error('אנא תמלא את כל הפרטים')
    }

  }

  dateChange(){
    
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.procurementService.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.suppliersOrderItems = data;
        this.suppliersOrderItemsCopy = data;
      })
    }
  
  }

  addAlterSupplier() { 
    
    let alterSuppToPush = this.alterSupplierToPush
    this.alterSupplierArray.push(alterSuppToPush)
    this.toastSrv.success("Alternative supplier added")
    
  }

  openData(supplierNumber){
  ;
    this.supplierService.getSuppliersByNumber(supplierNumber).subscribe(data=>{
      if(data){
        this.currentSupplier = data[0]
        this.updateSupplier = true
      }     
    })
  }

  showAllPurchases(itemNumber){
    ;
    this.procurementService.getAllItemPurchases(itemNumber).subscribe(data=>{
    if(data){
     this.itemPurchases = data; 
     this.showItemPurchases = true;

    }
    })
  }

  updateCurrSupplier(){
    this.supplierService.updateCurrSupplier(this.currentSupplier).subscribe(data=>{
  ;
    if(data){
      this.toastSrv.success('ספק עודכן בהצלחה !');
      this.updateSupplier = false;
      this.getSuppliers();
    }
    })
  }



  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.suppliersOrderItems, 'sample');
  }

  ngOnInit() {
    
    this.getSuppliers();
    this.getAlternativeSuppliers();
    this.getSuppliersOrderedItems();
    ;
    if(this.route.queryParams){
      setTimeout(() => {
        this.searchSupplier(this.route.snapshot.queryParams.supplierName)
      }, 1000);
      
    }
    
  }
}
