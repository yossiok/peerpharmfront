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
  newBatch = {
    order: '',
    item: '',
    itemName: '',
    produced: new Date(),
    expration: '',
    barrels: '',
    ph: '',
    weightKg: '',
    weightQtyLeft: '',
    batchNumber: '21pp',
    batchCreated: 0
  }
  newBatchForm: FormGroup = new FormGroup({
    order: new FormControl('', Validators.required),
    item: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    produced: new FormControl(new Date(), Validators.required),
    expration: new FormControl('', Validators.required),
    barrels: new FormControl('', Validators.required),
    ph: new FormControl('', Validators.required),
    weightKg: new FormControl('', Validators.required),
    weightQtyLeft: new FormControl('', Validators.required),
    batchNumber: new FormControl('21pp', Validators.required),
    batchCreated: new FormControl(0, Validators.required)
  })
  lastBatch: any;
  @ViewChild('printBtn') printBtn: ElementRef;

  constructor(private inventorySrv: InventoryService, private toastSrv: ToastrService, private itemSrv: ItemsService, private batchService: BatchesService) { }

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
      if (data) {
        this.newBatchForm.controls['itemName'].setValue( data[0].name + ' ' + data[0].subName + ' ' + data[0].discriptionK) 

      } else {
        this.toastSrv.error('פריט לא קיים במערכת')
      }
    })
  }

  addNewBatch() {

    debugger;
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

    console.log('stickers: ')
    for (let sticker of this.allStickers) {
      console.log(sticker)
    }
    this.newBatchForm.controls['weightQtyLeft'].setValue(this.newBatchForm.controls['weightKg'].value)
    var today = new Date();
    today.setFullYear(today.getFullYear() + Number(this.newBatchForm.controls['expration'].value));
    let expration = JSON.stringify(today)
    this.newBatchForm.controls['expration'].setValue(expration.slice(1, 11))
    this.newBatchForm.controls['batchNumber'].setValue(this.newBatchForm.get('batchNumber').value.toLowerCase());
    this.newBatchForm.controls['batchCreated'].setValue(new Date().getTime());

    if (this.newBatchForm.controls['item'].value == '' || this.newBatchForm.controls['batchNumber'].value.length < 5) {
      this.toastSrv.error('You must fill all the fields')
    } else {
      this.batchService.addBatch(this.newBatchForm.value).subscribe(data => {
        if (data) {
          this.printBtn.nativeElement.click();
          this.toastSrv.success('באטצ נוסף בהצלחה !')
          this.reduceMaterialAmounts(this.newBatchForm.controls['item'].value, this.newBatchForm.controls['weightKg'].value)
          this.newBatchForm.reset()
          this.allStickers = [];
          // this.newBatchForm.controls['barrels = ''
          // this.newBatchForm.controls['ph = ''
          // this.newBatchForm.controls['weightKg = ''
          // this.newBatchForm.controls['produced = ''
          // this.newBatchForm.controls['expration = ''
          // this.newBatchForm.controls['order = ''
          // this.newBatchForm.controls['itemName = ''
          // this.newBatchForm.controls['weightQtyLeft = ''
          // this.newBatchForm.controls['item = ''
          // this.newBatchForm.controls['batchNumber = '21pp'
          this.getLastBatch();
         
        }
      })
    }
    


  }

  reduceMaterialAmounts(formuleNumber, weightKG) {
    this.inventorySrv.reduceMaterialAmounts(formuleNumber, weightKG, true).subscribe(data => {
      console.log(data.updatedShells)
    })
  }


}
