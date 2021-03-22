import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { BatchesService } from 'src/app/services/batches.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-batch',
  templateUrl: './new-batch.component.html',
  styleUrls: ['./new-batch.component.scss']
})
export class NewBatchComponent implements OnInit {

  allStickers: any[] = [];
  batchDefaultNumber: string = '21pp';
  lastBatch: any;
  today: Date = new Date();
  @ViewChild('printBtn') printBtn: ElementRef;

  newBatchForm: FormGroup = new FormGroup({
    order: new FormControl('', Validators.required),
    item: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    produced: new FormControl(new Date(this.today), Validators.required),
    expration: new FormControl('', Validators.required),
    barrels: new FormControl('', Validators.required),
    ph: new FormControl('', Validators.required),
    weightKg: new FormControl('', Validators.required),
    weightQtyLeft: new FormControl(0, Validators.required),
    batchNumber: new FormControl(this.batchDefaultNumber, [Validators.required, Validators.minLength(5)]),
    batchCreated: new FormControl(0, Validators.required)
  })

  constructor(
    private inventorySrv: InventoryService, 
    private toastSrv: ToastrService, 
    private itemSrv: ItemsService, 
    private batchService: BatchesService) { }

  ngOnInit() {
    this.getLastBatch();
  }

  getLastBatch() {
    this.batchService.getLastBatch().subscribe(data => {
      this.lastBatch = data;
    })
  }

  fillItemName(ev) {
    var itemNumber = ev.target.value;
    this.itemSrv.getItemData(itemNumber).subscribe(data => {
      console.log('data: ',data)
      if (data.length > 0) {
        this.newBatchForm.controls['itemName'].setValue( data[0].name + ' ' + data[0].subName + ' ' + data[0].discriptionK) 
      } else {
        this.toastSrv.error('פריט לא קיים במערכת')
      }
    })
  }

  addNewBatch() {
    if (parseInt(this.newBatchForm.controls['barrels'].value) > 1) {
      for (let x = 1; x < parseInt(this.newBatchForm.controls['barrels'].value) + 1; x++) {
        let batchSticker = {
          batch: this.newBatchForm.value,
          printNum: "" + x + "/" + (parseInt(this.newBatchForm.controls['barrels'].value))
        }
        this.allStickers.push(batchSticker);
      }

    }
    else {
      let batchSticker = {
        batch: this.newBatchForm.value,
        printNum: "1/1"
      }
      this.allStickers.push(batchSticker);
    }
    this.newBatchForm.controls.weightQtyLeft.setValue(this.newBatchForm.controls.weightKg.value)
    this.newBatchForm.controls.batchNumber.setValue(this.newBatchForm.get('batchNumber').value.toLowerCase());
    this.newBatchForm.controls.batchCreated.setValue(new Date().getTime());

    // set expiration date
    let expirationDate = new Date()
    let expirationYear = this.newBatchForm.get('expration').value
    expirationDate.setFullYear(Number(expirationDate.getFullYear()) + Number(expirationYear))
    this.newBatchForm.controls.expration.setValue(expirationDate)

    if (this.newBatchForm.controls.item.value == '' || this.newBatchForm.controls.batchNumber.value.length < 5) {
      this.toastSrv.error('You must fill all the fields')
    } else {
      this.batchService.addBatch(this.newBatchForm.value).subscribe(data => {
        if (data) {
          this.printBtn.nativeElement.click();
          this.toastSrv.success('באטצ נוסף בהצלחה !')
          this.reduceMaterialAmounts(this.newBatchForm.controls.item.value, this.newBatchForm.controls.weightKg.value)
          this.newBatchForm.reset()
          this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber)
          this.allStickers = [];
          this.getLastBatch();
        }
      })
    }
  }

  reduceMaterialAmounts(formuleNumber, weightKG) {
    // if(confirm('חומרי גלם הולכים לרדת מהמלאי. האם אתה בטוח שברצונך להמשיך?')) {
      this.inventorySrv.reduceMaterialAmounts(formuleNumber, weightKG, true).subscribe(data => {
        // console.log(data.updatedShells)
      })
    // }
  }


}
