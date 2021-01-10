import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-item-movement-reports',
  templateUrl: './item-movement-reports.component.html',
  styleUrls: ['./item-movement-reports.component.scss']
})
export class ItemMovementReportsComponent implements OnInit {

  constructor(private inventorySrv:InventoryService) { }

  itemMovements:[];
  movementCertificate:object;
  printCerModal:Boolean = false;


  @ViewChild('printBtn') printBtn: ElementRef;

  ngOnInit(): void {
  }


  findMovementByItem(ev){
    if(ev.target.value != ''){
      this.inventorySrv.getItemMovements(ev.target.value).subscribe(data=>{
        if(data){
          this.itemMovements = data;
        }
      })
    }
  }

  printCertificate(movement){
    debugger;
    this.movementCertificate = movement;
    this.printCerModal = true;
    setTimeout(() => {
      this.printBtn.nativeElement.click();
    }, 1500);

  }

}
