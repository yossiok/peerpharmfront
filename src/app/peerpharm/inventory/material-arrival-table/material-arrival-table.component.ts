import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-material-arrival-table',
  templateUrl: './material-arrival-table.component.html',
  styleUrls: ['./material-arrival-table.component.css']
})
export class MaterialArrivalTableComponent implements OnInit {
  @ViewChild('printBtn') printBtn: ElementRef;
  @ViewChild('internalNumber') internalNumber: ElementRef;
  @ViewChild('materName') materName: ElementRef;
  @ViewChild('supplierNumber') supplierNumber: ElementRef;
  @ViewChild('supplierName') supplierName: ElementRef;
  @ViewChild('lotNum') lotNum: ElementRef;
  @ViewChild('expireDate') expireDate: ElementRef;
  @ViewChild('analysisApproval') analysisApproval: ElementRef;
  @ViewChild('arriveDate') arriveDate: ElementRef;
  @ViewChild('modal1') modal1: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
}

  materialsArrivals: Array<any>;
  materialsArrivalsCopy: Array<any>;
  currentDoc: any;
  EditRowId: any = "";
  materialNum: String ;
  materialName: String ;
  lotNumber: String ;
  productionDate: String ;
  arrivalDate: String ;
  expiryDate: String ;
  onHoldStrDate:String;
  smallText: Boolean=false;
  dateString: any = "";
  dateString2: any = "";
  suppliers: Array<any> ;
  suppliersList: Array<any> ;
  supplierItemsList: Array<any> ;
  supplierItemsListCopy: Array<any> ;
  
  // barcode values
  bcValue: Array<any>=[ ];
  elementType = 'svg';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = false; // true=display bcValue under barcode
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 1.5;
  fontSize = 30;
  background = '#ffffff';
  margin = 10;
  marginTop = 20;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;
  constructor(
    private invtSer:InventoryService,
    private toastSrv: ToastrService, 
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.invtSer.getAllMaterialsArrivals().subscribe(data=>{
      this.materialsArrivals= data;
      this.materialsArrivalsCopy= data;
    })

    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers=data;   
      this.suppliersList=data;   
    });
  }

  printBarcode(id){
    this.bcValue=[];
    this.materialNum="";
    this.materialName="";
    this.lotNumber="";
    this.productionDate="";
    this.arrivalDate="";
    this.expiryDate="";

    
    this.materialsArrivals.filter((m,key)=> {

      if(m._id == id){
        this.bcValue =  [m._id];
        this.materialNum= m.internalNumber;    
        this.materialName= m.materialName;    
        this.lotNumber= m.lotNumber;    
        this.productionDate= m.productionDate;
        this.arrivalDate= m.arrivalDate;
        this.expiryDate= m.expiryDate; 
        
        // if(this.materialName.length> 80) this.smallText= true;
        this.smallText = (this.materialName.length> 80) ? true : false;

      }
      if( key+1 == this.materialsArrivals.length){

        setTimeout(() => {
          console.log(this.materialNum)
          console.log(this.materialName)
          console.log(this.lotNumber)
          this.printBtn.nativeElement.click();          
        }, 500);
      }
    });
  }

  edit(id) {
    // if(id!='') {
    //   this.EditRowId = id;
    //   this.currentDoc=  this.materialsArrivals.filter(i=> {
    //     if(i._id == id){
    //         return i;
    //       }
    //     })[0]; 
        
    //     this.dateString =  this.currentDoc.expiryDate.slice(0,10);
    //     this.dateString2 =  this.currentDoc.arrivalDate.slice(0,10);
    // }else{
    //   this.EditRowId = '';
    // }
  }

  filterSuppliers(input){
    if(input !=""){
      let inputVal= input.toLowerCase();
      this.suppliersList= this.suppliers.filter(sup=> {
          if(sup.suplierName.toLowerCase().includes(inputVal)) {
            return sup;
          } 
        });
      }    

  }

  chooseSupplierFromList(sup,eve){
this.supplierName.nativeElement.value=sup.suplierName;
this.supplierNumber.nativeElement.value=sup.suplierNumber;
this.suppliersList=[];
  // updateMaterialForm() { 

  }  

  // }

}
