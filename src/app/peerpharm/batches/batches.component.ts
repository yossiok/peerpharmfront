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



@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {
  myRefresh: any = null;

  constructor(private authService: AuthService, private batchService: BatchesService, private excelService: ExcelService, private toastSrv: ToastrService) { }
  // dateList:Array<any>=[{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5},{date:1,address:2,mode:3,distance:4,fare:5}];
  batches: Array<any>;
  batchesCopy: Array<any>;
  lastBatchToExport: String;
  EditRowId: any = "";
  hasMoreItemsToload: boolean = true;
  currentDoc: any;
  user: UserInfo;
  alowUserEditBatches:Boolean=false;

  batch = { 
    batchNumber:'',
    batchStatus:'',
    barrels:'',
    expration: '', 
    item:'',
    itemName:'', 
    order:'',
    ph:'', 
    produced:'',
    weightQtyLeft: '',
    weightKg: '',

  }

  @ViewChild('batchNumber') batchNumber: ElementRef;
  @ViewChild('batchProduced') batchProduced: ElementRef;
  @ViewChild('batchItemName') batchItemName: ElementRef;
  @ViewChild('batchPh') batchPh: ElementRef;
  @ViewChild('batchWeightKd') batchWeightKg: ElementRef;
  @ViewChild('batchWeightQtyLeft') batchWeightQtyLeft: ElementRef;
  @ViewChild('batchBarrels') batchBarrels: ElementRef;
  @ViewChild('batchOrder') batchOrder: ElementRef;
  @ViewChild('batchItem') batchItem: ElementRef;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  ngOnInit() {
    this.getUserInfo();
    this.getAllBatches();
    this.startInterval();
  }

  addBatch() { 
    debugger;
    this.batchService.addBatch(this.batch).subscribe(data=>{
      this.batches.push(data)
      this.batchesCopy.push(data)
      this.getAllBatches();
      this.toastSrv.success("Batch has been added successfully")

      this.batch = { 
        batchNumber:'',
        batchStatus:'',
        barrels:'',
        expration: '', 
        item:'',
        itemName:'', 
        order:'',
        ph:'', 
        produced:'',
        weightQtyLeft: '',
        weightKg: '',
    
      }
    })
    

  }
 
  edit(id) {
    debugger
    if(this.alowUserEditBatches == true) {
    this.EditRowId = id;
    debugger
    if (id != '') {
      this.currentDoc = this.batches.filter(i => {
        if (i._id == id) {
          return i;
        }
      })[0];
    }  else {
      this.EditRowId = '';
    }
  }
}

  stopInterval() {
    clearInterval(this.myRefresh)
  }

  startInterval() {
    this.myRefresh = setInterval(() => { this.getAllBatches(); }, 1000 * 60 * 3);
  }


  getAllBatches() {

    this.batchService.getAllBatches().subscribe((res) => {
      console.log(res);
      debugger;
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

  filterBatchesBiggerThenBatchN() {
    var excelTable = [];
    if (this.lastBatchToExport != "" && this.lastBatchToExport != null) {
      this.batchesCopy.map(batch => {
        var lastBatchYear;
        var lastBatchNum;
        var year;
        var number;
        debugger
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
        debugger
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
        debugger
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
    debugger
    

    if (this.batchNumber.nativeElement.value && this.batchItemName.nativeElement.value != "") {

      this.currentDoc.batchNumber = this.batchNumber.nativeElement.value.trim();
      this.currentDoc.itemName = this.batchItemName.nativeElement.value.trim();
      this.currentDoc.weightQtyLeft = this.batchWeightQtyLeft.nativeElement.value.trim();
      this.currentDoc.ph = this.batchPh.nativeElement.value.trim();
      this.currentDoc.barrels = this.batchBarrels.nativeElement.value.trim();
      
      if(confirm("האם אתה בטוח רוצה לשנות פריטים אלו ?") == true) {
        this.updateDocument()
      }

    } else {

      this.toastSrv.error("Can't save changes with missing fields.")

    }

  }


  updateDocument(){
   
    this.batchService.updateBatchesForm(this.currentDoc).subscribe(data =>{
      this.batches.map(doc=>{
        if(doc.id == this.currentDoc._id){
          doc=data;
        }
      });
      this.batchesCopy.map(doc=>{
        if(doc.id == this.currentDoc._id){
          doc=data;
        }
      });
      
      this.EditRowId=""
      this.toastSrv.success("Details were successfully saved");
    });
  }

  async getUserInfo() {
    debugger
    await this.authService.userEventEmitter.subscribe(user => {
      this.user=user;
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
      if (this.user.authorization){
        debugger
        if (this.authService.loggedInUser.authorization.includes("editBatches")){
          this.alowUserEditBatches=true;
        }
      }

    });

  }

}
