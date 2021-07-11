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
    itemType: new FormControl('component', Validators.required),
    item: new FormControl(null, Validators.required),
    amount: new FormControl(500, Validators.required),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl('', Validators.required),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl('', Validators.required),
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

    setWH() {

    }
    
    getShelfs() {
      if (!this.componentArrival.value.whareHouseID) this.toastr.error('אנא בחר מחסן.')
      else if(!this.componentArrival.value.item) this.toastr.error('אנא הזן מספר פריט.')
      else this.inventoryService.getShelfListForItemInWhareHouse2(this.componentArrival.value.item, this.componentArrival.value.whareHouse._id)
            .subscribe(res => {
              if(res.msg) this.toastr.error('בעיה בהזנת הנתונים.')
              else if (res.length == 0) {
                let noShellsForItem = confirm('הפריט לא נמצא על אף אחד מהמדפים במחסן זה. להכניס למדף חדש?')
                if(noShellsForItem) this.newItemShell = true
                this.getAllShellsOfWhareHouse()
              } 
              else this.shellNums = res
            })
    }

    getAllShellsOfWhareHouse() {
      this.inventoryService.getWhareHouseShelfList(this.componentArrival.value.whareHouseID).subscribe(res=> {
        this.shellNums = res
      })
    }

    // Get names of all items for search
    getNames(event) {
      if (event.value.length > 2) {
        this.inventoryService.getNamesByRegex(event.value).subscribe(names => {
          this.itemNames = names
          this.componentArrival.controls.item.setValue(names[0].componentN)
        })
      }
    }
  
    setItemDetailsNumber(event) {
      this.componentArrival.controls.item.setValue(event.target.value)
    }

    addToStock() {
      // set whareHouse name and shelf position
      let whareHouse = this.allWhareHouses.find(wh => wh._id == this.componentArrival.value.whareHouseID)
      this.componentArrival.controls.whareHouse.setValue(whareHouse.name)
      let shellDoc = this.shellNums.find(shell => shell._id == this.componentArrival.value.shell_id_in_whareHouse)
      this.componentArrival.controls.position.setValue(shellDoc.position)

      if (this.newItemShell) {
        // create new itemShell
        console.log(this.componentArrival.value)
      }
      else {
        // add amount to an existing itemShell
        console.log(this.componentArrival.value)
      }
    }

  

}
