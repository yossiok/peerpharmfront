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
  
  bcValue: Array<any>=[ ];
  materialNum: String ;
  // barcodeElementType = "svg";
  // barcodeFormat = "CODE128";
  // barcodeWidth = 2.3;
  // barcodeHeight = 75;
  // barcodeFontSize = 28;
  // barcodeFlat = true;
  elementType = 'svg';
  // value = 'someValue12340987';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = false; // true=display bcValue under barcode
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;
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
    this.materialNum="";
    this.materialsArrivals.filter((m,key)=> {
      if(m._id == id){
        this.bcValue =  [m._id];
        this.materialNum= m.internalNumber;    
      }
      if( key+1 == this.materialsArrivals.length){
        this.bcValue
        this.materialNum
        debugger
        setTimeout(() => {
          this.printBtn.nativeElement.click();          
        }, 500);
      }
    });
  }
}
