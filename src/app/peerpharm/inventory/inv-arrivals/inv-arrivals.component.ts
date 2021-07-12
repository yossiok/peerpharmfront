import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-inv-arrivals',
  templateUrl: './inv-arrivals.component.html',
  styleUrls: ['./inv-arrivals.component.scss']
})
export class InvArrivalsComponent implements OnInit {

  @ViewChild('nameSelect') nameSelect: ElementRef

  itemNames: any[];
  allWhareHouses: any[];
  shellNums: any[];
  certificateReception: number;
  allArrivals: any[] = []

  componentArrival: FormGroup = new FormGroup({
    itemType: new FormControl('component', Validators.required),
    item: new FormControl(null, Validators.required),
    amount: new FormControl(500, Validators.required),
    shell_id_in_whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(''),
    whareHouseID: new FormControl(null, Validators.required),
    whareHouse: new FormControl(''),
    isNewItemShell: new FormControl(false, Validators.required)
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
    else if (!this.componentArrival.value.item) this.toastr.error('אנא הזן מספר פריט.')
    else this.inventoryService.getShelfListForItemInWhareHouse2(this.componentArrival.value.item, this.componentArrival.value.whareHouseID)
      .subscribe(res => {
        if (res.msg) this.toastr.error('בעיה בהזנת הנתונים.')
        else if (res.length == 0) {
          let noShellsForItem = confirm('הפריט לא נמצא על אף אחד מהמדפים במחסן זה. להכניס למדף חדש?')
          if (noShellsForItem) {
            this.componentArrival.controls.isNewItemShell.setValue(true)
            this.getAllShellsOfWhareHouse()
          }
        }
        else this.shellNums = res
      })
  }

  getAllShellsOfWhareHouse() {
    this.inventoryService.getWhareHouseShelfList(this.componentArrival.value.whareHouseID).subscribe(res => {
      this.shellNums = res.map(shell => {
          shell.shell_id_in_whareHouse = shell._id
        return shell
      })
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

  addToArrivals() {
    // set whareHouse name and shelf position
    let whareHouse = this.allWhareHouses.find(wh => wh._id == this.componentArrival.value.whareHouseID)
    this.componentArrival.controls.whareHouse.setValue(whareHouse.name)
    let shellDoc = this.shellNums
      .find(shell => shell.shell_id_in_whareHouse == this.componentArrival.value.shell_id_in_whareHouse)
    this.componentArrival.controls.position.setValue(shellDoc.position)
    //push arrival to allArrivals
    this.allArrivals.push(this.componentArrival.value)
    this.componentArrival.reset()
  }

  addToStock() {
    this.inventoryService.addComponentsToStock(this.allArrivals).subscribe(
      data => {
        this.certificateReception = data.savedMovement.warehouseReception
      }
    )
  }



}
