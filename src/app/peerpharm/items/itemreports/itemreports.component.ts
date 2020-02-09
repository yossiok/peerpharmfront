
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { DataPipeline } from 'aws-sdk/clients/all';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-itemreports',
  templateUrl: './itemreports.component.html',
  styleUrls: ['./itemreports.component.css']
})
export class ItemreportsComponent implements OnInit {
  itemShellMovements:any[];
  itemShellMovementsCopy:any[];
  itemsShell:any[];
  itemsShellCopy:any[];
  arrivalDate:Date;
  tableType:String = "arrivals"
  hasMoreItemsToload:boolean = true;
  

  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;

  constructor(private inventoryService:InventoryService, private excelService:ExcelService) { }

  ngOnInit() {
    this.getAllItemShells();
    this.getAllitemShellMovemvents();
    console.log(this.itemsShell)
  }


  getAllItemShells() { 
   
    this.inventoryService.getAllItemShells().subscribe(data =>{
      this.itemsShell = data;
      this.itemsShellCopy = data;

      if(data.length < data.length) {
        this.hasMoreItemsToload == false
      }
      console.log(this.itemsShell)
      
    })
  }

  getAllitemShellMovemvents() { 
    
    this.inventoryService.getAllMovements().subscribe(data =>{
      this.itemShellMovements = data;
      this.itemShellMovementsCopy = data;

      if(data.length == data.length) {
        this.hasMoreItemsToload == false
      } else {
        this.hasMoreItemsToload == false
        alert("No movements")
      }

    })
  }
  setType(type) {

    switch (type) {
      case 'arrivals':
        this.tableType = "arrivals"
        break;
      case 'movements':
      this.tableType = "movements"
        break;

    }
  }

  changeText(ev, filterBy) {
    
   if (filterBy == 'itemNumber') {
      let itemNumb = ev.target.value;
      if (itemNumb != '') {
        let tempArr = [];
        this.itemsShellCopy.filter(i => {
          var check = false;
          var matchAllArr = 0;
          if (i.item.includes(itemNumb.toLowerCase())) {
            tempArr.push(i);
          }
        });
        
        this.itemsShell = tempArr;
        this.hasMoreItemsToload = false;
        
      } else {
        this.itemsShell = this.itemsShellCopy.slice();
      }
    }

    if (filterBy == 'itemMovementNumber') {
      
      let itemNumb = ev.target.value;
      if (itemNumb != '') {
        let tempMoveArr = [];
        this.itemShellMovementsCopy.filter(i => {
          var check = false;
          var matchAllArr = 0;
          if (i.item.includes(itemNumb.toLowerCase())) {
            tempMoveArr.push(i);
          }
        });
        
        this.itemShellMovements = tempMoveArr;
        this.hasMoreItemsToload = false;
        
      } else {
        this.itemShellMovements = this.itemShellMovementsCopy.slice();
      }
    }

  }

  dateChange(){
    
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.inventoryService.getItemShellsByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.itemsShell = data;
        this.itemsShellCopy = data;
        if(data.length <= 0) {
          this.hasMoreItemsToload = false
          alert("No movements")
        } 
      })
    } else {
      this.getAllItemShells();
      this.hasMoreItemsToload = false
    }
  
  }

  dateChangeMovements(){
    
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "" ) {

      this.inventoryService.getItemShellsMovementsByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data=>{
        this.itemShellMovements = data;
        this.itemShellMovementsCopy = data;

        if(data.length <= 0) {
          this.hasMoreItemsToload = false;
          alert("No movements")
        } 
      })
    } else {
      this.getAllitemShellMovemvents();
      this.hasMoreItemsToload = false;
    }
  
  }

  exportAsXLSX():void {
    
    this.excelService.exportAsExcelFile(this.itemsShell, 'data');
  }

  exportAsXLSXmovements():void {
    
    this.excelService.exportAsExcelFile(this.itemShellMovements, 'data');
  }




}
