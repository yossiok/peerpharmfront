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

  materialNum: String ;
  materialName: String ;
  lotNumber: String ;
  productionDate: String ;
  arrivalDate: String ;
  expiryDate: String ;

  smallText: Boolean=false;
  
  // barcode values
  bcValue: Array<any>=[ ];
  elementType = 'svg';
  format = 'CODE128';
  lineColor = '#000000';
  width = 1;
  height = 150;
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
}
