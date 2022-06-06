import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
  selector: 'app-material-arrival-table',
  templateUrl: './material-arrival-table.component.html',
  styleUrls: ['./material-arrival-table.component.scss']
})
export class MaterialArrivalTableComponent implements OnInit {
  @ViewChild('printBtn',{ static: false }) printBtn: ElementRef;
  @ViewChild('internalNumber',{ static: false }) internalNumber: ElementRef;
  @ViewChild('materName',{ static: false }) materName: ElementRef;
  @ViewChild('materialPosition',{ static: false }) materialPosition: ElementRef;
  @ViewChild('quantity',{ static: false }) quantity: ElementRef;
  @ViewChild('packageType',{ static: false }) packageType: ElementRef;
  @ViewChild('supplierNumber',{ static: false }) supplierNumber: ElementRef;
  @ViewChild('supplierName',{ static: false }) supplierName: ElementRef;
  @ViewChild('lotNum',{ static: false }) lotNum: ElementRef;
  @ViewChild('remarks',{ static: false }) remarks: ElementRef;
  @ViewChild('expireDate',{ static: false }) expireDate: ElementRef;
  @ViewChild('analysisApproval',{ static: false }) analysisApproval: ElementRef;
  @ViewChild('arriveDate',{ static: false }) arriveDate: ElementRef;
  @ViewChild('modal1',{ static: false }) modal1: ElementRef;
  @ViewChild('fromDateStr',{ static: true }) fromDateStr: ElementRef;
  @ViewChild('toDateStr',{ static: true }) toDateStr: ElementRef;
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
  position:String;
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
  materialsArrivalsWeek: Array<any>
 


  // barcode values
  // bcValue: Array<any> = [];
  // elementType = 'svg';
  // format = 'CODE128';
  // lineColor = '#000000';
  // width = 0.85;
  // height = 100;
  // displayValue = false; // true=display bcValue under barcode
  // fontOptions = '';
  // font = 'monospace';
  // textAlign = 'center';
  // textPosition = 'bottom';
  // textMargin = 1.5;
  // fontSize = 20;
  // background = '#ffffff';
  // margin = 10;
  // marginTop = 20;
  // marginBottom = 10;
  // marginLeft = 10;
  // marginRight = 10;

  bcValue: Array<any> = [];
  elementType = 'svg';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 75;
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
    private modalService: NgbModal,
    private excelService:ExcelService,
    
  ) { }

  ngOnInit() {
    ;
    this.toDateStr.nativeElement.value = new Date().toISOString().slice(0,10)
    this.fromDateStr.nativeElement.value = new Date(new Date().setDate(new Date().getDate()-7)).toISOString().slice(0,10)

    this.invtSer.getAllMaterialsArrivalsWeek().subscribe(data => {

      this.materialsArrivals = data;
      this.materialsArrivalsCopy = data;


    })

    this.invtSer.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
      this.suppliersList = data;
    });
  }

  printBarcode(id) {
    ;
    this.bcValue = [];
    this.materialNum = "";
    this.materialName = "";
    this.lotNumber = "";
    this.productionDate = "";
    this.arrivalDate = "";
    this.expiryDate = "";


    this.materialsArrivals.filter((m, key) => {
      if (m._id == id) {
        
        this.bcValue = [m.reqNum];
        this.materialNum = m.internalNumber;
        this.materialName = m.materialName;
        this.lotNumber = m.lotNumber;
        this.productionDate = m.productionDate;
        this.arrivalDate = m.arrivalDate;
        this.expiryDate = m.expiryDate;
        this.position = m.position


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

  getAllMaterialArrivals() { 

    this.invtSer.getAllMaterialsArrivals().subscribe(data => {
      this.materialsArrivals = data;
      this.materialsArrivalsCopy = data;
    })
  }

  edit(id) {
    let pos = confirm('מה המצב שלומי?')
    if(pos) alert('שיהיה לך יום טוב!')
    else alert('למה ליהיות שלילי?')
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

  exportAsXLSX():void {
    
    this.excelService.exportAsExcelFile(this.materialsArrivals, 'data');
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
    ;
    this.currentDoc.remarks = this.remarks.nativeElement.value;
    if(this.packageType.nativeElement.value != "" ){
    this.currentDoc.packageType = this.packageType.nativeElement.value;
    } 
    if(this.materialPosition.nativeElement.value !=""){
      this.currentDoc.position = this.materialPosition.nativeElement.value.trim();
    }
    this.currentDoc.analysisApproval = this.analysisApproval.nativeElement.checked
    // if (this.supplierNumber.nativeElement.value != "") {
       
    //   this.currentDoc.supplierNumber = this.supplierNumber.nativeElement.value.trim()
    // } else {
    //   this.toastSrv.error("Can't save changes with missing fields.")
    // }

    if (this.supplierName.nativeElement.value != "") {
      this.currentDoc.supplierName = this.supplierName.nativeElement.value.trim()
       
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }


    if (this.arriveDate.nativeElement.value != "") {
       this.adjustDate('arrivalDate', this.arriveDate.nativeElement.value);
      // let currentDate = this.arriveDate.nativeElement.value
      // let newDate = new Date(currentDate)
      // this.currentDoc.arrivalDate = newDate;
      console.log("this.currentDoc.arrivalDate= new Date(this.arriveDate.nativeElement.value) \n",
                  this.currentDoc.arrivalDate)
    }


    if (this.expireDate.nativeElement.value != "") {
      // let currentDate = this.expireDate.nativeElement.value;
      // let newDate = new Date(currentDate)
      // this.currentDoc.expiryDate = newDate
      this.adjustDate('expiryDate', this.expireDate.nativeElement.value);
      
      console.log(this.currentDoc.expiryDate)
      ;
       
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }




    if (this.lotNum.nativeElement.value != "") {
        
      if (this.currentDoc.lotNumber != this.lotNum.nativeElement.value.trim()) {
        if (confirm("האם אתה בטוח שאתה רוצה לשנות מספר אצווה ?")) {
          this.checkLotNumber().then(
            
            msg => {

               
              console.log("data from checkLotNumber():", msg)
              // if (msg == "new" || msg == "existing") { }
                    // this.invtSer.updateMaterialArrivalForm(this.currentDoc).subscribe(data =>{
              //    
              //   this.toastSrv.success("Details were successfully saved")
              // })
              this.updateDocument();
             
            }
          ).catch(msg=>{
            
            console.log(msg);
          });


        } else {
          this.lotNum.nativeElement.value = this.currentDoc.lotNumber; 
        }
      }else {
        this.updateDocument();
        // this.invtSer.updateMaterialArrivalForm(this.currentDoc).subscribe(data =>{
        //    
        //   this.toastSrv.success("Details were successfully saved")
        // });
      }

    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }

    if (this.quantity.nativeElement.value != "" && this.quantity.nativeElement.value > 0) {
      this.currentDoc.totalQnt = parseInt(this.quantity.nativeElement.value.trim())
    } else {
      this.toastSrv.error("Can't save changes with missing fields.")
    }


  }
  adjustDate(dateField, value){
    // this[dateField].nativeElement.value
    
    this.currentDoc[dateField]=new Date(value)
    
  }

updateDocument(){
   
  this.invtSer.updateMaterialArrivalForm(this.currentDoc).subscribe(data =>{
    this.materialsArrivals.map(doc=>{
      if(doc.id == this.currentDoc._id){
        doc=data;
      }
    });
    this.materialsArrivalsCopy.map(doc=>{
      if(doc.id == this.currentDoc._id){
        doc=data;
      }
    });
    this.EditRowId=""
    this.toastSrv.success("Details were successfully saved");
  });
}


filterByNumber(ev){
  if(ev.target.value != ''){
    this.materialsArrivals = this.materialsArrivalsCopy.filter(m=>m.internalNumber == ev.target.value);
  } else {
    this.materialsArrivals = this.materialsArrivalsCopy
  }
}




  checkLotNumber() { 
    const that = this
    // var newForm = this.currentDoc;
    // var inventoryService = this.invtSer;
    let lotN = this.lotNum.nativeElement.value.trim();
    return new Promise(function (resolve, reject) {
      // let itemN= newForm.internalNumber;
      let suppNum = that.currentDoc.supplierNumber;
      let breakeLoop = false;
      
      that.invtSer.getLotNumber(suppNum, lotN).subscribe(arrivalForms => {
       
        if (arrivalForms.length > 0) {
          // wont save same lot numbers with different expiry date
          arrivalForms.forEach((form, key) => {
            if (that.currentDoc.expiryDate != form.expiryDate && !breakeLoop) {
              let date = form.expiryDate.slice(0, 10);
             
              if (confirm("מספר לוט כבר קיים במערכת עם תאריך תפוגה \n" + date)) {
                that.currentDoc.expiryDate = date; // date type
                this.expireDate.nativeElement.value = date.slice(0, 10); //  input type date gets "yyyy-MM-dd"
                breakeLoop = true;
                that.currentDoc.lotNumber= this.lotNum.nativeElement.value.trim();
                that.currentDoc.expiryDate= this.expireDate.nativeElement.value.trim();
                resolve('existing');
                // resolve('date change to existing lotNumber date');
              }else{
                // set the native value to the original value before changes
                this.lotNum.nativeElement.value =that.currentDoc.lotNumber; 
                reject('no changes made');
              }
            }
            if (key + 1 == arrivalForms.length) resolve('lot number checked');
          });
        } else {
          //get values from edit row inputs 
          that.currentDoc.lotNumber = that.lotNum.nativeElement.value.trim();
          that.currentDoc.expiryDate = that.expireDate.nativeElement.value.trim();
          resolve('new')
        }
      })
    });

  }

  isChecked(ev) {
    ;
    if (ev.target.checked == true) {

      this.analysisApproval.nativeElement.checked = ev.target.checked;
      ;
    }

    if (ev.target.checked == false) {
      ;
      this.analysisApproval.nativeElement.checked = ev.target.checked;
    }

  }


  changeText(ev)
  {
    
    let word= ev.target.value;
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.materialsArrivalsCopy.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.materialName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.materialsArrivals= tempArr;
         
    }else{
      
      this.materialsArrivals=this.materialsArrivalsCopy.slice();
    }
  }

  dateChange(){
    ;
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.invtSer.getAllMaterialsByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.materialsArrivals = data;
        this.materialsArrivalsCopy = data;
      })
    }
  
  }

}
