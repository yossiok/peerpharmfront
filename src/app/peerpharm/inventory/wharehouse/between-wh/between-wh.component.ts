import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-between-wh',
  templateUrl: './between-wh.component.html',
  styleUrls: ['./between-wh.component.scss']
})
export class BetweenWHComponent implements OnInit {

  @Input() allWhareHouses;
  @Input() itemNumber;
  @ViewChild('first') first: ElementRef

  originWHShelfs: any[];
  destWHShelfs: any[];
  noItem: boolean = false
  disabled: boolean = false
  originShelf: any;
  destShelf: any;

  movementForm: FormGroup = new FormGroup({
    amount: new FormControl(null, Validators.required),
    item: new FormControl(null, Validators.required),
    itemType: new FormControl('component', Validators.required),
    shell_id_in_whareHouse_Origin: new FormControl(null, Validators.required),
    shell_position_in_whareHouse_Origin: new FormControl(null, Validators.required),
    WH_originId: new FormControl(null, Validators.required),
    WH_originName: new FormControl(null, Validators.required),
    shell_id_in_whareHouse_Dest: new FormControl(null, Validators.required),
    shell_position_in_whareHouse_Dest: new FormControl(null, Validators.required),
    WH_destId: new FormControl(null, Validators.required),
    WH_destName: new FormControl(null, Validators.required),
    isNewItemShell: new FormControl(false, Validators.required)
  })
  sending: boolean;

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.first.nativeElement.focus(), 500)
    if (this.itemNumber) {
      this.movementForm.controls.item.setValue(this.itemNumber)
      this.disabled = true

    }
  }



  // check if component number exist
  async checkComponentN() {
    return new Promise((resolve, reject) => {
      this.inventoryService.getCmptByNumber(this.movementForm.value.item, this.movementForm.value.itemType).subscribe(data => {
        if (data.length > 0) {
          this.noItem = false
          resolve(true)
        }
        else {
          this.noItem = true
          reject(false)
        }
      })
    })
  }

  // get chunks with item
  // it was better to split it to 2 different functions - one for origin and one for destination...
  getChunks(whType) {

    // product movement
    if (this.movementForm.value.WH_originId == '5c31bb6f91ca6b2510349ce9') {
      this.movementForm.controls.itemType.setValue('product')
    }

    // origin or destination WH?
    let WHID = whType == 'o' ? this.movementForm.value.WH_originId : this.movementForm.value.WH_destId

    this.checkComponentN().then(result => {
      if (!WHID) this.toastr.error('אנא בחר מחסן.')
      else if (!this.movementForm.value.item) this.toastr.error('אנא הזן מספר פריט.')
      else this.inventoryService.getShelfListForItemInWhareHouse2(this.movementForm.value.item, WHID)
        .subscribe(chunks => {
          if (chunks.msg) this.toastr.error('בעיה בהזנת הנתונים.')
          else if (chunks.length == 0) { // no existing cunks for item
            // if origin - break
            if (whType == 'o') this.toastr.error('הפריט לא נמצא במחסן זה')
            // if destination - ask for approval to enter to new shelf
            else if (whType == 'd') {
              let noShellsForItem = confirm('הפריט לא נמצא על אף אחד מהמדפים במחסן זה. להכניס למדף חדש?')
              if (noShellsForItem) {
                // approved - announce new itemShell (chunk) and get all shelfs of destination WH
                this.movementForm.controls.isNewItemShell.setValue(true)
                this.getAllShelfsOfDest(WHID)
                let whName = this.allWhareHouses.find(wh => wh._id == this.movementForm.value.WH_destId).name
                this.movementForm.controls.WH_destName.setValue(whName)
                this.movementForm.controls.shell_id_in_whareHouse_Dest.setValue(this.destWHShelfs[0].shell_id_in_whareHouse)//stupid bug
                this.setDestPosition()
              }
            }
          }
          else {
            if (whType == 'o') {
              this.originWHShelfs = chunks
              this.movementForm.controls.shell_id_in_whareHouse_Origin.setValue(this.originWHShelfs[0].shell_id_in_whareHouse)//stupid bug
              this.setOriginPosition()
              let whName = this.allWhareHouses.find(wh => wh._id == this.movementForm.value.WH_originId).name
              this.movementForm.controls.WH_originName.setValue(whName)
            }
            if (whType == 'd') {
              this.destWHShelfs = chunks
              this.movementForm.controls.shell_id_in_whareHouse_Dest.setValue(this.destWHShelfs[0].shell_id_in_whareHouse)//stupid bug
              this.setDestPosition()
              let whName = this.allWhareHouses.find(wh => wh._id == this.movementForm.value.WH_destId).name
              this.movementForm.controls.WH_destName.setValue(whName)
            }
          }
        })
    }).catch(e => {
      this.toastr.error('', 'פריט לא קיים :(')
    })
  }

  getAllShelfsOfDest(e) {
    e = e.target ? e.target.value : e
    this.inventoryService.getWhareHouseShelfList(e).subscribe(res => {
      this.destWHShelfs = res.map(shell => {
        shell.shell_id_in_whareHouse = shell._id
        return shell
      })
    })
  }

  setOriginPosition() {
    this.originShelf = this.originWHShelfs.find(shelf => shelf.shell_id_in_whareHouse == this.movementForm.value.shell_id_in_whareHouse_Origin)
    this.movementForm.controls.shell_position_in_whareHouse_Origin.setValue(this.originShelf.position)
  }

  checkAmount() {
    if (!this.originShelf) {
      this.toastr.error('אנא הכנס מדף ממנו מוציאים')
      this.movementForm.controls.amount.reset()
    }
    else if (this.originShelf.amount < this.movementForm.value.amount) {
      let conf = confirm('הכמות שהזנת גדולה מהכמות במדף. להמשיך בכל זאת?')
      if (!conf) this.movementForm.controls.amount.reset()
    }
  }

  setDestPosition() {
    this.destShelf = this.destWHShelfs.find(shelf => shelf.shell_id_in_whareHouse == this.movementForm.value.shell_id_in_whareHouse_Dest)
    this.movementForm.controls.shell_position_in_whareHouse_Dest.setValue(this.destShelf.position)
  }

  move() {
    this.sending = true
    this.inventoryService.moveWareHouse(this.movementForm.value).subscribe(data => {
      if (data.msg) this.toastr.error(data.msg, 'שגיאה')
      else {
        //set certificate data 
        this.sending = false
        this.toastr.success('שינויים נשמרו בהצלחה', 'נשמר')
        this.movementForm.reset()
        this.movementForm.controls.itemType.setValue('component')
        this.first.nativeElement.focus()
      }
    })
  }

}
