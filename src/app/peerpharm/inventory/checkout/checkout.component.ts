import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('nameSelect') nameSelect: ElementRef
  @ViewChild('printBtn2') printBtn2: ElementRef
  @ViewChild('first') first: ElementRef
  @Input() allWhareHouses: any[];
  @Input() itemNumber: number;

  itemNames: any[];
  shellNums: any[];
  certificateReception: number;
  outGoing: any[] = []
  today = new Date()
  sending: boolean = false
  disabled: boolean = false

  componentCheckout: FormGroup = new FormGroup({
    itemType: new FormControl('component', Validators.required),
    item: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
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
    if(this.itemNumber) {
      this.disabled = true
      this.componentCheckout.controls.item.setValue(this.itemNumber)
    } 
  }

  getShelfs() {
    if (!this.componentCheckout.value.whareHouseID) this.toastr.error('אנא בחר מחסן.')
    else if (!this.componentCheckout.value.item) this.toastr.error('אנא הזן מספר פריט.')
    else this.inventoryService.getShelfListForItemInWhareHouse2(this.componentCheckout.value.item, this.componentCheckout.value.whareHouseID)
      .subscribe(res => {
        if (res.msg) this.toastr.error('בעיה בהזנת הנתונים.')
        else if (res.length == 0) {
          this.toastr.error('הפריט לא נמצא על אף אחד מהמדפים במחסן זה.')
        }
        else {
          this.shellNums = res
          //stupid bug:
          this.componentCheckout.controls.shell_id_in_whareHouse.setValue(this.shellNums[0].shell_id_in_whareHouse)
        }
      })
  }

  // Get names of all items for search
  getNames(event) {
    if (event.value.length > 2) {
      this.inventoryService.getNamesByRegex(event.value).subscribe(names => {
        this.itemNames = names
        this.componentCheckout.controls.item.setValue(names[0].componentN)
      })
    }
  }

  setItemDetailsNumber(event) {
    this.componentCheckout.controls.item.setValue(event.target.value)
  }

  addToOutGoing() {
    // set whareHouse name and shelf position
    let whareHouse = this.allWhareHouses.find(wh => wh._id == this.componentCheckout.value.whareHouseID)
    this.componentCheckout.controls.whareHouse.setValue(whareHouse.name)
    let shellDoc = this.shellNums
      .find(shell => shell.shell_id_in_whareHouse == this.componentCheckout.value.shell_id_in_whareHouse)
    this.componentCheckout.controls.position.setValue(shellDoc.position)
    //push arrival to outGoing
    this.outGoing.push(this.componentCheckout.value)
    this.componentCheckout.reset()
    this.componentCheckout.controls.isNewItemShell.setValue(false)
    this.componentCheckout.controls.itemType.setValue('component')
    this.first.nativeElement.focus()
  }

  checkout() {
    this.sending = true
    setTimeout(()=> this.sending = false, 7000) //if something goes wrong
    this.inventoryService.checkoutComponents(this.outGoing).subscribe(
      data => {
        if (data.msg) this.toastr.error('אנא פנה לתמיכה.', 'היתה בעיה')
        else {
          //set certificate data 
          this.certificateReception = data.allResults[0].savedMovement.warehouseReception
          for (let arrival of this.outGoing) {
            arrival.itemName = data.allResults.find(a => a.item == arrival.item).componentName
          }
          this.sending = false
          this.toastr.success('שינויים נשמרו בהצלחה', 'נשמר')
          setTimeout(()=> {
            this.printBtn2.nativeElement.click()
            setTimeout(()=> this.outGoing = [], 1000)
          }, 500)
        }
      }
      )
    }

    removeFromArrivals(i) {
      this.outGoing.splice(i, 1)
    }
    
    justPrint() {
      setTimeout(()=> {
        this.printBtn2.nativeElement.click()
      }, 500)
  }

  clearArrivals() {
    this.outGoing = []
  }



}
