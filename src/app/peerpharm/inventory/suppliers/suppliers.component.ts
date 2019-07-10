import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})



export class SuppliersComponent implements OnInit {
  closeResult: string;
  suppliersAlterArray:any[];
  suppliers: any[];
  suppliersCopy: any[];
  alternSupplier: any[];
  alterSupplierToPush:string;
  alterSupplierArray:any[] = [];
  tableType:string = "suppliers";
  suppliersOrderItems:any[];
  suppliersOrderItemsCopy:any[];
  hasMoreItemsToload: boolean = true;

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
  }

  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
  private container: ElementRef;
  @ViewChild('container') set content(content: ElementRef) {
    this.container = this.content;
  }



  constructor(private excelService: ExcelService,private procurementService: Procurementservice, private modalService: NgbModal, private supplierService: SuppliersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

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
 debugger;
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
    
    if(this.supplier.suplierName != "" && this.supplier.suplierNumber != "" && this.supplier.lastUpdated != "") {
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
         
    }else{
      
      this.suppliers=this.suppliersCopy.slice();
    }
  }

  searchName(ev)
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
         
            if(x.supplierName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.suppliersOrderItems= tempArr;
         
    }else{
      
      this.suppliersOrderItems=this.suppliersOrderItemsCopy.slice();
    }
  }

  searchNumber(ev)
  {
    debugger;
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
         
    }else{
      
      this.suppliersOrderItems=this.suppliersOrderItemsCopy.slice();
    }
  }


  dateChange(){
    debugger;
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.procurementService.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.suppliersOrderItems = data;
        this.suppliersOrderItemsCopy = data;
      })
    }
  
  }

  addAlterSupplier() { 
    debugger;
    let alterSuppToPush = this.alterSupplierToPush
    this.alterSupplierArray.push(alterSuppToPush)
    this.toastSrv.success("Alternative supplier added")
    
  }

  async openData(supplierN) {
    debugger

    this.supplier = this.suppliers.find(supplier => supplier.suplierNumber == supplierN);
    this.loadSuppliers();
    this.modalService.open(supplierN).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        this.saveSupplier();
      }
    })
  }

  loadSuppliers() {
    debugger;
    // this.resCmpt.componentType=  this.stockType;
    if (this.supplier.suplierNumber != '') {
      this.supplierService.getSuppliersByNumber(this.supplier.suplierNumber).subscribe(res => {
        // if (res.length > 0) {
        //   this.supplier.items = res;
        // } else
        //   this.supplier.items = [];

      });
    } else {
      this.toastSrv.error('Item type error \nPlease refresh screen.');
    }
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.suppliersOrderItems, 'sample');
  }

  ngOnInit() {
    debugger
    this.getSuppliers();
    this.getAlternativeSuppliers();
    this.getSuppliersOrderedItems();
   
    
  }
}
