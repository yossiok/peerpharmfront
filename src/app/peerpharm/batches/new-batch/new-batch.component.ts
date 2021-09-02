import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { BatchesService } from 'src/app/services/batches.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-new-batch',
  templateUrl: './new-batch.component.html',
  styleUrls: ['./new-batch.component.scss']
})
export class NewBatchComponent implements OnInit {

  @ViewChild('printBtn') printBtn: ElementRef;
  @ViewChild('currentOrderNumber') currentOrderNumber: ElementRef
  @ViewChild('itemWeight') itemWeight: ElementRef
  @ViewChild('itemNumber') itemNumber: ElementRef
  @ViewChild('itemName') itemName: ElementRef

  allStickers: any[] = [];
  batchDefaultNumber: string = '21pp';
  lastBatch: any;
  today: Date = new Date();
  disableButton: boolean;
  newBatchAllowed: boolean = false;
  currentItems: any[] = []

  newBatchForm: FormGroup = new FormGroup({
    chosenFormule: new FormControl('', Validators.required),
    itemName: new FormControl('', Validators.required),
    produced: new FormControl(new Date(this.today), Validators.required),
    expration: new FormControl('', Validators.required),
    barrels: new FormControl('', Validators.required),
    ph: new FormControl('', Validators.required),
    weightKg: new FormControl(0, Validators.required),
    weightQtyLeft: new FormControl(0, Validators.required),
    batchNumber: new FormControl(this.batchDefaultNumber, [Validators.required, Validators.minLength(5)]),
    batchCreated: new FormControl(0, Validators.required),
    itemsToCook: new FormControl([], Validators.required)
  })

  constructor(
    private inventorySrv: InventoryService,
    private toastSrv: ToastrService,
    private itemSrv: ItemsService,
    private batchService: BatchesService,
    private authService: AuthService,
    private orderService: OrdersService) { }

  ngOnInit() {
    this.getLastBatch();
    this.newBatchAllowed = this.authService.loggedInUser.authorization.includes("newBatch") ? true : false
  }

  ngDoCheck() {
    let finalWeight = 0
    for (let item of this.newBatchForm.value.itemsToCook) {
      finalWeight += Number(item.weightKg)
    }
    this.newBatchForm.controls.weightKg.setValue(finalWeight)
  }

  getLastBatch() {
    this.batchService.getLastBatch().subscribe(data => {
      this.lastBatch = data;
    })
  }


  //*****************************************************changing batch process********************************************************************************* */

  getOrderDetails(e) {
    let orderNumber = e.target.value
    //get all items from order:
    this.orderService.getItemsFromOrder(orderNumber).subscribe(res => {
      if (res.length > 0) {
        this.currentItems = res
      } else this.toastSrv.error('No items on this order')
    })
  }

  checkItem(e) {
    let item = this.currentItems.find(i => i.itemNumber == e.target.value)
    if (!item) this.toastSrv.error('Item does not exist in this order.', 'Unmatch Item!')
    else {
      this.itemName.nativeElement.value = item.discription
    }
  }

  saveItem() {

    //check
    let itemNumber = this.itemNumber.nativeElement.value
    let itemName = this.itemName.nativeElement.value
    let itemWeight = this.itemWeight.nativeElement.value
    let orderNumber = this.currentOrderNumber.nativeElement.value
    this.newBatchForm.value.itemsToCook.push({
      orderNumber,
      itemNumber,
      itemName,
      weightKg: itemWeight
    })
    this.itemWeight.nativeElement.value = null
    this.currentOrderNumber.nativeElement.value = null
    this.itemNumber.nativeElement.value = null
    this.itemName.nativeElement.value = null
    this.currentItems = []
    this.currentOrderNumber.nativeElement.focus()

  }

  setMainFormule(item) {
    this.newBatchForm.controls.chosenFormule.setValue(item.itemNumber)
    this.newBatchForm.controls.itemName.setValue(item.itemName)
  }

  removeItem(i) {
    this.newBatchForm.value.itemsToCook.splice(i, 1)

  }

  checkPointerAllowed() {
    if (this.newBatchForm.value.chosenFormule == '') return 'disable-pointer'
    else return ''
  }





  //************************************************************************************************************************************** */



  fillItemName(ev) {
    var itemNumber = ev.target.value;
    this.itemSrv.getItemData(itemNumber).subscribe(data => {
      console.log('data: ', data)
      if (data.length > 0) {
        this.newBatchForm.controls['itemName'].setValue(data[0].name + ' ' + data[0].subName + ' ' + data[0].discriptionK)
      } else {
        this.toastSrv.error('פריט לא קיים במערכת')
      }
    })
  }

  addNewBatch(justStickers: boolean) {
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
    // weightQtyLeft value doesn't exist in the form
    this.newBatchForm.controls.weightQtyLeft.setValue(this.newBatchForm.controls.weightKg.value)

    // change the batch number to lower case
    this.newBatchForm.controls.batchNumber.setValue(this.newBatchForm.get('batchNumber').value.toLowerCase());
    // set the date to today by default
    this.newBatchForm.controls.batchCreated.setValue(new Date().getTime());

    // set expiration date

    let expirationDate = new Date()
    // get the number of years from the form
    let expirationYear = this.newBatchForm.get('expration').value
    // add the number of years to today date
    expirationDate.setFullYear(Number(expirationDate.getFullYear()) + Number(expirationYear))
    // set the value of the expiration in the form
    this.newBatchForm.controls.expration.setValue(expirationDate)


    if (this.newBatchForm.controls.batchNumber.value.length < 5) {
      this.toastSrv.error('Batch number must include at least 5 charchters', 'Invalid Batch Number')
    } else {
      if (justStickers) {
        // just print stickers
        //TODO: CHECK IF BATCH EXIST!!!
        this.batchService.checkIfBatchExist(this.newBatchForm.get('batchNumber').value.toLowerCase()).subscribe(response => {
          if (response) {
            if (confirm("בחרת רק להדפיס מדבקות. באטצ' לא יתווסף למערכת. האם להמשיך?")) {
              setTimeout(() => {
                this.printBtn.nativeElement.click();

                // this.newBatchForm.reset()
                // this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber)
                this.allStickers = [];
              }, 2000)
            }
          }
          else this.toastSrv.error('', 'Batch not exist.')
        })


      }
      // add batch AND REDUCE AMOUNTS!!!
      else {
        if (this.newBatchForm.value.chosenFormule == '') {
          this.toastSrv.error('Please Choose Main Formule')
        }
        else {
          if (confirm("באטצ' יתווסף למערכת והכמויות יירדו מהמלאי. האם להמשיך?")) {
            this.disableButton = true
            this.toastSrv.info("Adding Batch. Please wait...")
            let con = true
            // reduce materials from itemShells
            this.inventorySrv.reduceMaterialAmounts(this.newBatchForm.controls.batchNumber.value, this.newBatchForm.controls.chosenFormule.value, this.newBatchForm.controls.weightKg.value, true).subscribe(data => {
              this.disableButton = false
              if (data == 'Formule Not Found') {
                this.toastSrv.error(data)
                con = confirm("פורמולה לא קיימת. כמויות לא ירדו מהמלאי. להוסיף באטצ' בכל זאת?")
                this.disableButton = false
              }
              if (data.materials && data.updatedShells) this.toastSrv.success('Amounts reduced. Shelfs updated.')
              if (con) {
                // add batch to batches list
                this.batchService.addBatch(this.newBatchForm.value).subscribe(data => {
                  if (data.msg = 'succsess') {
                    this.printBtn.nativeElement.click();
                    this.toastSrv.success('באטצ נוסף בהצלחה !')
                    setTimeout(() => {

                      // this.newBatchForm.reset()
                      // this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber)
                      //this.newBatchForm.controls.itemsToCook.setValue([])
                      this.allStickers = [];
                      this.getLastBatch();
                    }, 2000)
                  }
                  else if (data.msg == 'Batch Allready Exist') this.toastSrv.error('Please fill a different batch number.', 'Batch number allready exist.')
                  else this.toastSrv.error('Something went wrong.')
                })
              }
            })
          }
        }
      }
    }
  }

  resetBatchValues() {

    this.newBatchForm.reset()
    this.newBatchForm.controls.batchNumber.setValue(this.batchDefaultNumber)
    this.newBatchForm.controls.itemsToCook.setValue([])
  }

  //not needed anymore
  // reduceMaterialAmounts(batchNumber,formuleNumber, weightKG) {
  //     this.inventorySrv.reduceMaterialAmounts(batchNumber,formuleNumber, weightKG, true).subscribe(data => {
  //       if(data == 'Formule Not Found') this.toastSrv.error(data)
  //       else if(data.materials && data.updatedShells) this.toastSrv.success('Amounts reduced. Shelfs updated.')
  //     })
  // }




}
