import { Component, Input, OnInit } from '@angular/core';
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

  originWHShelfs: any[];
  destWHShelfs: any[];
  noItem: boolean = false

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

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.itemNumber) this.movementForm.controls.item.setValue(this.itemNumber)
  }

  setShelfsPosition() {
    console.log(this.movementForm.value)
    let originShelf = this.originWHShelfs.find(shelf => shelf.shell_id_in_whareHouse == this.movementForm.value.shell_id_in_whareHouse_Origin)
    this.movementForm.controls.shell_position_in_whareHouse_Origin.setValue(originShelf.position)
    let destShelf = this.destWHShelfs.find(shelf => shelf.shell_id_in_whareHouse == this.movementForm.value.shell_id_in_whareHouse_Dest)
    this.movementForm.controls.shell_position_in_whareHouse_Dest.setValue(destShelf.position)
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
              }
            }
          }
          else {
            if (whType == 'o') {
              this.originWHShelfs = chunks
              let whName = this.allWhareHouses.find(wh => wh._id == this.movementForm.value.WH_originId).name
              this.movementForm.controls.WH_originName.setValue(whName)
            }
            if (whType == 'd') {
              this.destWHShelfs = chunks
              let whName = this.allWhareHouses.find(wh => wh._id == this.movementForm.value.WH_destId).name
              this.movementForm.controls.WH_destName.setValue(whName)
            }
            //stupid bug:
            // this.movementForm.controls.shell_id_in_whareHouse.setValue(this.shellNums[0].shell_id_in_whareHouse)
          }
        })
    }).catch(e => {
      this.toastr.error('', 'פריט לא קיים :(')
    })
  }

  // getAllShelfsOfOrigin(e) {
  //   // this.movementForm.controls.isNewItemShell.setValue(true)
  //   this.inventoryService.getWhareHouseShelfList(e.target.value).subscribe(res => {
  //     this.originWHShelfs = res.map(shell => {
  //       shell.shell_id_in_whareHouse = shell._id
  //       return shell
  //     })
  //     //stupid bug:
  //     // this.movementForm.controls.shell_id_in_whareHouse_Origin.setValue(this.shellNums[0].shell_id_in_whareHouse)
  //   })
  // }

  getAllShelfsOfDest(e) {
    this.inventoryService.getWhareHouseShelfList(e.target.value).subscribe(res => {
      this.destWHShelfs = res.map(shell => {
        shell.shell_id_in_whareHouse = shell._id
        return shell
      })
      //stupid bug:
      // this.movementForm.controls.shell_id_in_whareHouse_Origin.setValue(this.shellNums[0].shell_id_in_whareHouse)
    })
  }

}
