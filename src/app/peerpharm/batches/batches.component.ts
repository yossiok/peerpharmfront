import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { BatchesService } from '../../services/batches.service'
// test for excel export
import { ExcelService } from '../../services/excel.service';
// private excelService:ExcelService
import * as moment from 'moment';
import { Toast } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../taskboard/models/UserInfo';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from 'src/app/services/items.service';



@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {
  myRefresh: any = null;

  constructor(private itemService: ItemsService, private modalService: NgbModal, private authService: AuthService, private batchService: BatchesService, private excelService: ExcelService, private toastSrv: ToastrService) { }
  // dateList:Array<any>=[{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5}];
  batches: Array<any>;
  batchesCopy: Array<any>;
  lastBatchToExport: String;
  userValueUpdate: String;
  lastValueUpdate: String;
  EditRowId: any = "";
  hasMoreItemsToload: boolean = true;
  currentDoc: any;
  user: UserInfo;
  alowUserEditBatches: Boolean = false;
  ifConfirmed: Boolean = false;
  editValues: Boolean = false;
  closeResult: any;
  batchPrint: any;
  item: any;


  batch = {
    batchNumber: '',
    batchStatus: '',
    barrels: '',
    expration: '',
    item: '',
    itemName: '',
    order: '',
    ph: '',
    produced: '',
    weightQtyLeft: '',
    weightKg: '',
    color: ''

  }

  itemTree = {
    phValue: '',
    viscosityValue: "",
    colorValue: "",
    textureValue: "",
    scentValue: "",
    densityValue: "",

  }

  @ViewChild('batchNumber') batchNumber: ElementRef;
  @ViewChild('batchProduced') batchProduced: ElementRef;
  @ViewChild('batchItemName') batchItemName: ElementRef;
  @ViewChild('batchPh') batchPh: ElementRef;
  @ViewChild('batchWeightKd') batchWeightKg: ElementRef;
  @ViewChild('batchWeightQtyLeft') batchWeightQtyLeft: ElementRef;
  @ViewChild('batchWeightQty') batchWeightQty: ElementRef;
  @ViewChild('batchBarrels') batchBarrels: ElementRef;
  @ViewChild('batchOrder') batchOrder: ElementRef;
  @ViewChild('batchItem') batchItem: ElementRef;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  ngOnInit() {
    this.getUserInfo();
    this.getAllBatchesYear();
    this.startInterval();
    this.lastValueUpdate = this.formatDate(new Date());
  }

  addBatch() {

    this.batchService.addBatch(this.batch).subscribe(data => {
      this.batches.push(data)
      this.batchesCopy.push(data)
      this.getAllBatches();
      this.toastSrv.success("Batch has been added successfully")

      this.batch = {
        batchNumber: '',
        batchStatus: '',
        barrels: '',
        expration: '',
        item: '',
        itemName: '',
        order: '',
        ph: '',
        produced: '',
        weightQtyLeft: '',
        weightKg: '',
        color: ''

      }
    })


  }

  getAllBatches() {
    this.batchService.getAllBatches().subscribe((res) => {
      console.log(res);
      this.batches = res;
      this.batchesCopy = res;
      this.batches.map(batch => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = 'Aquamarine';
          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "orange";
          else batch.color = "white";
          if (res.length == res.length) {

            this.hasMoreItemsToload = false;
          }
        }
      });
    });
  }

  edit(id) {
    if (this.alowUserEditBatches == true) {
      this.EditRowId = id;

      if (id != '') {
        this.currentDoc = this.batches.filter(i => {
          if (i._id == id) {
            return i;
          }
        })[0];
      } else {
        this.EditRowId = '';
      }
    }
  }

  stopInterval() {
    clearInterval(this.myRefresh)
  }

  startInterval() {
    this.myRefresh = setInterval(() => { this.getAllBatchesYear(); }, 1000 * 60 * 3);
  }


  getAllBatchesYear() {
    debugger;
    this.batchService.getAllBatchesYear().subscribe((res) => {
      console.log(res);
      this.batches = res;
      this.batchesCopy = res;
      this.batches.map(batch => {
        if (batch.weightKg != null && batch.weightQtyLeft != null) {
          if (batch.weightQtyLeft == 0) batch.color = 'Aquamarine';
          else if (batch.scheduled == 'yes') batch.color = 'yellow'

          else if (batch.weightQtyLeft < batch.weightKg) batch.color = "orange";

          else batch.color = "white";

          if (res.length == res.length) {

            this.hasMoreItemsToload = false;
          }
        }
      });
    });
  }
  private getDismissReason(reason: any): string {
    debugger;
    if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  openTableValues(specValues, itemNumber) {
    debugger;
    this.modalService.open(specValues, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.loadSpecTable(itemNumber)
  }


  loadSpecTable(itemNumber) {
    debugger;
    this.itemService.getItemData(itemNumber).subscribe(data => {
      this.item = data[0]

      if (data[0].valueStatus == 'confirm') {
        this.ifConfirmed = true;
      } else {
        this.ifConfirmed = false;
      }
    })
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  openPrint(printBatch, batchNumber) {
    debugger;
    this.modalService.open(printBatch, { size: 'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.loadDataPrint(batchNumber)
  }

  loadDataPrint(batchNumber) {
    debugger;
    var batchToPrint = [];
    batchToPrint = this.batches.find(batch => batch.batchNumber == batchNumber);
    this.batchPrint = batchToPrint
  }

  filterBatchesBiggerThenBatchN() {
    var excelTable = [];
    if (this.lastBatchToExport != "" && this.lastBatchToExport != null) {
      this.batchesCopy.map(batch => {
        var lastBatchYear;
        var lastBatchNum;
        var year;
        var number;
        if (this.lastBatchToExport.includes("pp")) {
          lastBatchYear = this.lastBatchToExport.split("pp")[0];
          lastBatchNum = this.lastBatchToExport.split("pp")[1];
        } else {
          //some batches dont have "YYpp...""
          lastBatchYear = "1";
          lastBatchNum = this.lastBatchToExport;
        }
        if (batch.batchNumber.includes("pp")) {
          year = batch.batchNumber.split("pp")[0];
          number = batch.batchNumber.split("pp")[1];
        } else {
          //some batches dont have "YYpp...""
          year = 1;
          number = batch.batchNumber;
        }

        if (year >= lastBatchYear && number >= lastBatchNum && batch.weightKg != null && batch.weightQtyLeft != null) {
          let obj = {
            batchNumber: batch.batchNumber,
            produced: batch.produced,
            item: batch.item,
            itemName: batch.itemName,
            expration: batch.expration,
            order: batch.order,
            ph: batch.ph,
            weightKg: batch.weightKg,
          }
          excelTable.push(obj);
        }
      });
      this.exportAsXLSX(excelTable);
      this.lastBatchToExport = "";
    } else {
      this.toastSrv.error("No batch number to follow");
    }
  }

  addNewBatch() {

  }


  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, 'batches');
  }

  changeText(ev, filterBy) {
    if (filterBy == 'itemName') {
      let word = ev.target.value;
      let wordsArr = word.split(" ");
      wordsArr = wordsArr.filter(x => x != "");
      if (wordsArr.length > 0) {
        let tempArr = [];
        this.batchesCopy.filter(b => {
          var check = false;
          var matchAllArr = 0;
          wordsArr.forEach(w => {
            if (b.itemName.toLowerCase().includes(w.toLowerCase())) {
              matchAllArr++
            }
            (matchAllArr == wordsArr.length) ? check = true : check = false;
          });

          if (!tempArr.includes(b) && check) tempArr.push(b);
        });
        this.batches = tempArr;
      } else {
        this.batches = this.batchesCopy.slice();
      }
    } else if (filterBy == 'batchNumber') {
      let bNum = ev.target.value;
      if (bNum != '') {
        let tempArr = [];
        this.batchesCopy.filter(b => {
          var check = false;
          var matchAllArr = 0;
          if (b.batchNumber.includes(bNum.toLowerCase())) {
            tempArr.push(b);
          }
        });
        this.batches = tempArr;
      } else {
        this.batches = this.batchesCopy.slice();
      }
    }

  }

  deleteBatch(batch) {
    if (confirm("Delete batch?")) {
      this.batchService.deleteBatch(batch).subscribe(res => {
        this.batches = this.batches.filter(elem => elem._id != batch._id);
      });
    }
  }

  saveEdit(currdoc) {
    debugger;
    if (this.batchNumber.nativeElement.value && this.batchItemName.nativeElement.value != "") {

      this.currentDoc.batchNumber = this.batchNumber.nativeElement.value.trim();
      this.currentDoc.itemName = this.batchItemName.nativeElement.value.trim();
      this.currentDoc.weightQtyLeft = this.batchWeightQtyLeft.nativeElement.value.trim();
      this.currentDoc.weightKg = Number(this.batchWeightQty.nativeElement.value.trim());
      this.currentDoc.ph = this.batchPh.nativeElement.value.trim();
      this.currentDoc.barrels = this.batchBarrels.nativeElement.value.trim();
      this.currentDoc.order = this.batchOrder.nativeElement.value.trim();
      this.currentDoc.item = this.batchItem.nativeElement.value.trim();

      if (confirm("האם אתה בטוח רוצה לשנות פריטים אלו ?") == true) {
        this.updateDocument()
      }

    } else {

      this.toastSrv.error("Can't save changes with missing fields.")

    }

  }

  saveSpecValues(itemNumber) {
    debugger;
    var obj = {
      date: this.lastValueUpdate,
      user: this.userValueUpdate
    }
    this.item.phValue = this.itemTree.phValue;
    this.item.viscosityValue = this.itemTree.viscosityValue;
    this.item.colorValue = this.itemTree.colorValue;
    this.item.textureValue = this.itemTree.textureValue;
    this.item.scentValue = this.itemTree.scentValue;
    this.item.densityValue = this.itemTree.densityValue;
    this.item.lastUpdatedValues.push(obj)

    this.itemService.updateItemValues(this.item).subscribe(data => {
      if (data.msg == 'cantUpdate') {
        this.toastSrv.error('Cant update after confirmation')
        this.editValues = false;
      } else {
        this.toastSrv.success('עודכן בהצלחה !')
        this.editValues = false;
        this.item = data;
        if (data.valueStatus == 'confirm') {
        this.ifConfirmed = true
        } else {
          this.ifConfirmed = false;
        }

      }
    })
  }

  updateDocument() {

    this.batchService.updateBatchesForm(this.currentDoc).subscribe(data => {
      this.batches.map(doc => {
        if (doc.id == this.currentDoc._id) {
          doc = data;
        }
      });
      this.batchesCopy.map(doc => {
        if (doc.id == this.currentDoc._id) {
          doc = data;
        }
      });

      this.EditRowId = ""
      this.toastSrv.success("Details were successfully saved");
    });
  }

  async getUserInfo() {
    await this.authService.userEventEmitter.subscribe(user => {
      this.user = user;
      this.userValueUpdate = user.userName
      // this.user=user.loggedInUser;
      // if (!this.authService.loggedInUser) {
      //   this.authService.userEventEmitter.subscribe(user => {
      //     if (user.userName) {
      //       this.user = user;

      //     }
      //   });
      // }
      // else {
      //   this.user = this.authService.loggedInUser;
      // }
      if (this.user.authorization) {
        if (this.authService.loggedInUser.authorization.includes("editBatches")) {
          this.alowUserEditBatches = true;
        }
      }

    });

  }

}
