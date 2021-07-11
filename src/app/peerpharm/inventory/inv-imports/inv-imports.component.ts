import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-inv-imports',
  templateUrl: './inv-imports.component.html',
  styleUrls: ['./inv-imports.component.scss']
})
export class InvImportsComponent implements OnInit {

  @ViewChild('nameSelect') nameSelect: ElementRef
  
  itemNames: any[];
  allWhareHouses: any[];
  shellNums: any[];
  newItemShell: boolean = false

  componentArrival: FormGroup = new FormGroup({
    itemNumber: new FormControl(null, Validators.required),
    amount: new FormControl(0, Validators.required),
    shellId: new FormControl(null, Validators.required),
    whareHouse: new FormControl(null, Validators.required),
  })

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService
    ) { }
    
    ngOnInit(): void {
      this.getWhs()
    }
    
    getWhs() {
      this.inventoryService.getWhareHousesList().subscribe(whs => {
        this.allWhareHouses = whs
      })
    }
    
    getShelfs() {
      if (!this.componentArrival.value.whareHouse) this.toastr.error('אנא בחר מחסן.')
      else if(!this.componentArrival.value.itemNumber) this.toastr.error('אנא הזן מספר פריט.')
      else this.inventoryService.getShelfListForItemInWhareHouse2(this.componentArrival.value.itemNumber, this.componentArrival.value.whareHouse)
            .subscribe(res => {
              if(res.msg) this.toastr.error('בעיה בהזנת הנתונים.')
              else if (res.length == 0) {
                let noShellsForItem = confirm('הפריט לא קיים במחסן זה. לפתוח מדף חדש?')
                if(noShellsForItem) this.newItemShell = true
                this.getAllShellsOfWhareHouse()
              } 
              else this.shellNums = res
            })
    }

    getAllShellsOfWhareHouse() {
      this.inventoryService.shelfListByWH()
    }

    // Get names of all items for search
    getNames(event) {
      if (event.value.length > 2) {
        this.inventoryService.getNamesByRegex(event.value).subscribe(names => {
          this.itemNames = names
          this.componentArrival.controls.itemNumber.setValue(names[0].componentN)
        })
      }
    }
  
    setItemDetailsNumber(event) {
      this.componentArrival.controls.itemNumber.setValue(event.target.value)
    }

  

}
