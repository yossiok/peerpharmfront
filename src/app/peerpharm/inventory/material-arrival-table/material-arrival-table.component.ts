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
  @ViewChild('quantity') quantity: ElementRef;
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
  materialNum: String;
  materialName: String;
  lotNumber: String;
  productionDate: String;
  arrivalDate: String;
  expiryDate: String;
  onHoldStrDate: String;
  totalQnt: Number;
  smallText: Boolean = false;
  dateString: any = "";
  dateString2: any = "";
  suppliers: Array<any>;
  suppliersList: Array<any>;
  supplierItemsList: Array<any>;
  supplierItemsListCopy: Array<any>;

  // barcode values
  bcValue: Array<any> = [];
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
    private invtSer: InventoryService,
    private toastSrv: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.invtSer.getAllMaterialsArrivals().subscribe(data => {
      this.materialsArrivals = data;
      this.materialsArrivalsCopy = data;
      console.log("this.materialsArrivals[0]: ",this.materialsArrivals[0])

    })

    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
      this.suppliersList = data;
    });
  }

  printBarcode(id) {
    this.bcValue = [];
    this.materialNum = "";
    this.materialName = "";
    this.lotNumber = "";
    this.productionDate = "";
    this.arrivalDate = "";
    this.expiryDate = "";


    this.materialsArrivals.filter((m, key) => {

      if (m._id == id) {
        this.bcValue = [m._id];
        this.materialNum = m.internalNumber;
        this.materialName = m.materialName;
        this.lotNumber = m.lotNumber;
        this.productionDate = m.productionDate;
        this.arrivalDate = m.arrivalDate;
        this.expiryDate = m.expiryDate;


        // if(this.materialName.length> 80) this.smallText= true;
        this.smallText = (this.materialName.length > 80) ? true : false;

      }
      if (key + 1 == this.materialsArrivals.length) {

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
    // if (id != '') {
    //   this.EditRowId = id;
    //   this.currentDoc = this.materialsArrivals.filter(i => {
    //     if (i._id == id) {
    //       return i;
    //     }
    //   })[0];

    //   this.dateString = this.currentDoc.expiryDate.slice(0, 10);
    //   this.dateString2 = this.currentDoc.arrivalDate.slice(0, 10);
    // } else {
    //   this.EditRowId = '';
    // }
  }

  filterSuppliers(input) {
    if (input != "") {
      let inputVal = input.toLowerCase();
      this.suppliersList = this.suppliers.filter(sup => {
        if (sup.suplierName.toLowerCase().includes(inputVal)) {
          return sup;
        }
      });
    }

  }

  chooseSupplierFromList(sup, eve) {
    this.supplierName.nativeElement.value = sup.suplierName;
    this.supplierNumber.nativeElement.value = sup.suplierNumber;
    this.suppliersList = [];
    // updateMaterialForm() { 

  }

  saveEdit(currDoc) {

    if(this.supplierNumber.nativeElement.value != "") { 
      this.currentDoc.supplierNumber = this.supplierNumber.nativeElement.value.trim()
    } else { 
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.supplierName.nativeElement.value != "") {
      this.currentDoc.supplierName = this.supplierName.nativeElement.value.trim()
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.analysisApproval.nativeElement.value != "") {
      this.currentDoc.analysisApproval = this.analysisApproval.nativeElement.value.trim()
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.arriveDate.nativeElement.value != "") {

      let currentDate = this.arriveDate.nativeElement.value
      let newDate = new Date(currentDate)
      this.currentDoc.arrivalDate = newDate;
    
    }


    if (this.expireDate.nativeElement.value != "") {
      let currentDate = this.expireDate.nativeElement.value;
      let newDate = new Date(currentDate)
      this.currentDoc.expiryDate = newDate;
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.lotNum.nativeElement.value != "") {
     
      if(this.currentDoc.lotNumber != this.lotNum.nativeElement.value.trim()){
        if(confirm("האם אתה בטוח שאתה רוצה לשנות מספר אצווה ?")) {
        this.checkLotNumber().then(
          data=>{
            console.log("data from checkLotNumber():" , data)
            if(data == "lot number new"){
              this.currentDoc.lotNumber= this.lotNum.nativeElement.value.trim();
              this.currentDoc.expiryDate= this.expireDate.nativeElement.value.trim();
              console.log("this.currentDoc.lotNumber:" ,this.currentDoc.lotNumber)
              console.log("this.currentDoc.expiryDate:" ,this.currentDoc.expiryDate)
              console.log(this.currentDoc)

            } else { }
  
          }
        );  
      } else  {
        this.lotNum.nativeElement.value = this.currentDoc.lotNumber;
      }
      let newLotNum = Object.assign({}, this.materialsArrivals);
    }
     
    
      this.currentDoc.lotNumber = this.lotNum.nativeElement.value.trim()
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.quantity.nativeElement.value != "" && this.quantity.nativeElement.value > 0 ) {
      this.currentDoc.totalQnt = parseInt(this.quantity.nativeElement.value.trim())
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }


  }


  checkLotNumber(){

    var newForm= this.currentDoc;
    var inventoryService = this.invtSer; 
    let lotN= this.lotNum.nativeElement.value.trim();
    return new Promise(function (resolve, reject) {
      // let itemN= newForm.internalNumber;
      let suppNum= newForm.supplierNumber;
      let breakeLoop=false;
      debugger
      inventoryService.getLotNumber(suppNum, lotN).subscribe(arrivalForms=>{
        debugger
        if (arrivalForms.length>0){
          // wont save same lot numbers with different expiry date
          arrivalForms.forEach((form, key) => {
            if(newForm.expiryDate != form.expiryDate && !breakeLoop ){
              let date= form.expiryDate.slice(0,10);
              if(confirm("מספר לוט כבר קיים במערכת עם תאריך תפוגה \n"+date)){
                newForm.expiryDate = date; // date type
                this.expireDate.nativeElement.value = date.slice(0,10); //  input type date gets "yyyy-MM-dd"
                breakeLoop=true;
                debugger
              }
            }
            if(key+1 == arrivalForms.length)  resolve('lot number checked');
          });
        }else{
          resolve('lot number new')
        }
      })  
    });

  }

  // }

}
