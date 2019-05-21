import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-material-arrival-table',
  templateUrl: './material-arrival-table.component.html',
  styleUrls: ['./material-arrival-table.component.css']
})
export class MaterialArrivalTableComponent implements OnInit {
  @ViewChild('printBtn') printBtn: ElementRef;

  materialsArrivals: Array<any>;
  materialsArrivalsCopy: Array<any>;
  currentDoc: any;
  // barcode vars //
  
  bcValue: Array<any>=['test1', 'test2' ];
  materialNumber: String ;
  barcodeElementType = "svg";
  barcodeFormat = "CODE128";
  barcodeWidth = 2.3;
  barcodeHeight = 75;
  barcodeFontSize = 28;
  barcodeFlat = true;
  constructor(
    private invtSer:InventoryService,
  ) { }

  ngOnInit() {
    this.invtSer.getAllMaterialsArrivals().subscribe(data=>{
      this.materialsArrivals= data;
      this.materialsArrivalsCopy= data;
    })
  }

  printBarcode(id){
    this.bcValue=[];
    this.materialNumber="";
    this.materialsArrivals.filter((m,key)=> {
      if(m._id == id){
        this.currentDoc=m;
        this.bcValue =  [this.currentDoc._id];
        this.materialNumber= this.currentDoc.internalNumber;    
        debugger
        console.log("materialNumber", this.materialNumber)
        console.log("bcValue", this.bcValue)    
      }
      if( key+1 == this.materialsArrivals.length){
        debugger
        this.printBtn.nativeElement.click();
      }
    });
  }
}
