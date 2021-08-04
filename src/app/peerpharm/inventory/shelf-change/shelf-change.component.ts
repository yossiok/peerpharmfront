import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-shelf-change',
  templateUrl: './shelf-change.component.html',
  styleUrls: ['./shelf-change.component.scss']
})
export class ShelfChangeComponent implements OnInit {

  @ViewChild('nameSelect') nameSelect: ElementRef
  @ViewChild('printBtn2') printBtn2: ElementRef
  @ViewChild('first') first: ElementRef

  itemNames: any[];
  allWhareHouses: any[];
  shellNums: any[];
  certificateReception: number;
  allArrivals: any[] = []
  today = new Date()
  sending: boolean = false

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
    setTimeout(()=>this.first.nativeElement.focus(),500) 
    this.getWhs()
  }

  getWhs() {
    this.inventoryService.getWhareHousesList().subscribe(whs => {
      this.allWhareHouses = whs
    })
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
        else {
          this.shellNums = res
          //stupid bug:
          this.componentArrival.controls.shell_id_in_whareHouse.setValue(this.shellNums[0].shell_id_in_whareHouse)
        }
      })
  }

  getAllShellsOfWhareHouse() {
    this.inventoryService.getWhareHouseShelfList(this.componentArrival.value.whareHouseID).subscribe(res => {
      this.shellNums = res.map(shell => {
        shell.shell_id_in_whareHouse = shell._id
        return shell
      })
      //stupid bug:
      this.componentArrival.controls.shell_id_in_whareHouse.setValue(this.shellNums[0].shell_id_in_whareHouse)
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
    this.componentArrival.controls.isNewItemShell.setValue(false)
    this.componentArrival.controls.itemType.setValue('component')
    this.first.nativeElement.focus()
  }

  addToStock() {
    this.sending = true
    setTimeout(()=> this.sending = false, 7000) //if something goes wrong
    this.inventoryService.addComponentsToStock(this.allArrivals).subscribe(
      data => {
        if (data.msg) this.toastr.error('אנא פנה לתמיכה.', 'היתה בעיה')
        else {
          //set certificate data 
          this.certificateReception = data.allResults[0].savedMovement.warehouseReception
          for (let arrival of this.allArrivals) {
            arrival.suplierN = data.allResults.find(a => a.item == arrival.item).suplierN
            arrival.itemName = data.allResults.find(a => a.item == arrival.item).componentName
          }
          this.sending = false
          this.toastr.success('שינויים נשמרו בהצלחה', 'נשמר')
          this.allArrivals = []
          setTimeout(()=> {
            this.printBtn2.nativeElement.click()
          }, 500)
        }
      }
      )
    }

    removeFromArrivals(i) {
      this.allArrivals.splice(i, 1)
    }
    
    justPrint() {
      setTimeout(()=> {
        this.printBtn2.nativeElement.click()
      }, 500)
  }

  clearArrivals() {
    this.allArrivals = []
  }



}
