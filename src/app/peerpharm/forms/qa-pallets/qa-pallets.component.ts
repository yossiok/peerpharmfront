import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-qa-pallets',
  templateUrl: './qa-pallets.component.html',
  styleUrls: ['./qa-pallets.component.css']
})
export class QaPalletsComponent implements OnInit {

  EditRow: any;
  EditRowTwo: any;
  editBill: any;
  customerForPL: any;
  unitsToPallet: any;
  currentPallet: any;
  allReadyPallets: any[]
  allReadyPalletsCopy: any[]
  allCustomers: any[]
  allClosedPallets: any[]
  allClosedPalletsCopy: any[]
  selectedArr: any[] = [];
  showProductsBeforeDelivery: boolean = false;
  deleteOrMoveModal: boolean = false;
  itemsInPalletModal: boolean = false;
  currCustomer: string;
  currCustomerNumber: string;
  currCustomerId: string;
  allPackedLists: any[];
  showAllReadyCostumers: boolean = false;
  showAllClosedPallets: boolean = false;
  showAllPackedLists: boolean = false;
  combineModal: boolean = false;
  palletToAdd: any;
  lineToAdd: any;
  allReadyPackedLists: any[];


  pallet = {
    customer: '',
    lines: [],
    status: '',
    palletNumber: '',
    plStatus: ''

  }



  packedList = {
    costumerName: '',
    costumerNumber: '',
    pallets: [],
    readyForBill: false
  }


  @ViewChild('billNumberToUpdate') billNumberToUpdate: ElementRef;




  constructor(private toastr: ToastrService, private customerService: CostumersService, private formService: FormsService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.editBillNumber('')
    this.edit('', '')
  }

  ngOnInit() {
    this.getAllReadyPallets();
    this.getAllPackedLists();
    this.getAllReadyForBill();
    this.getAllClosedPallets();
    this.getCostumers();
  }

  editBillNumber(id){
    if(id != ''){
      this.editBill = id
    } else {
      this.editBill = ''
    }
  }

  edit(itemNumber, customerName) {
    debugger;
    if (itemNumber != '' && customerName != '') {
      this.EditRow = itemNumber;
      this.EditRowTwo = customerName;
    } else {
      this.EditRow = '';
      this.EditRowTwo = '';
    }
  }

  addPalletToPackList(pallet) {
    debugger;
    pallet.plStatus = 'occupied'
    this.palletToAdd = pallet
    this.showAllPackedLists = true
  }

  addLineToPallet(line) {
    debugger;
    this.showAllClosedPallets = true;

    line.fullKartons = Number(line.floorNumber) * Number(line.kartonQuantity) + Number(line.lastFloorQuantity)
    if (line.allUnits == undefined || line.allUnits == null) {
      line.allUnits = (Number(line.floorNumber) * Number(line.kartonQuantity) * Number(line.unitsInKarton)) + (Number(line.lastFloorQuantity) * Number(line.unitsInKarton)) + line.unitsQuantityPartKarton
    }

    if (line.unitsQuantityPartKarton > 0) {
      line.allKartons = Number(line.floorNumber) * Number(line.kartonQuantity) + Number(line.lastFloorQuantity) + 1
    }

    this.lineToAdd = line;

  }


  addPalletToCostumer(pallet) {
    this.showAllReadyCostumers = true;
    this.palletToAdd = pallet
    debugger;



  }

  getAllReadyPallets() {
    debugger;
    this.formService.getAllReadyPallets().subscribe(data => {
      this.allReadyPallets = data;
      this.allReadyPalletsCopy = data;

    })

  }

  movePalletToPL(){
    debugger;
    this.currentPallet
    this.currentPallet.packListID = this.customerForPL
    var objToSend = {...this.currentPallet}
    this.formService.movePalletToPL(objToSend).subscribe(data=>{
    if(data){
      debugger;
      this.toastr.success('משטח הועבר בהצלחה !')
      this.getAllPackedLists();
      for (let i = 0; i < this.selectedArr.length; i++) {
       if(this.selectedArr[i]._id == this.currentPallet._id){
        this.selectedArr.splice(i, 1);
       }
        
      }

    }
    })
  }

  isSelected(ev, pallet) {
    debugger
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr;
      pallet.fullKartons = Number(pallet.floorNumber) * Number(pallet.kartonQuantity);
      if (pallet.allUnits == undefined || pallet.allUnits == null) {
        pallet.allUnits = Number(pallet.floorNumber) * Number(pallet.kartonQuantity) * Number(pallet.unitsInKarton)
        if(Number(pallet.lastFloorQuantity) > 0 && pallet.kartonQuantity > 0){
         pallet.allUnits = pallet.allUnits + pallet.unitsQuantityPartKarton
        }
      }

      if (pallet.unitsQuantityPartKarton > 0) {
        pallet.allKartons = Number(pallet.floorNumber) * Number(pallet.kartonQuantity) + Number(pallet.lastFloorQuantity)
      }
      isSelected.push(pallet);
      this.selectedArr = isSelected

    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x => x.itemNumber != pallet.itemNumber)
      this.selectedArr = tempArr
    }


  }

  selectedForPL(ev, pallet) {
    debugger
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr;
      isSelected.push(pallet);
      this.selectedArr = isSelected
    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x => x.itemNumber != pallet.itemNumber)
      this.selectedArr = tempArr
    }


  }

  saveBillNumber(id) {
    debugger;
    var billNumber = this.billNumberToUpdate.nativeElement.value;
    this.formService.insertBillNumber(id, billNumber).subscribe(data => {
      debugger;
      if (data) {
        for (let i = 0; i < this.allPackedLists.length; i++) {
          if (this.allPackedLists[i]._id == data._id) {
            this.allPackedLists[i].billNumber = data.billNumber
          }

        }
        
        this.toastr.success("מספר חשבונית עודכן בהצלחה!")
      }

    })
  }

  filterByCustomer(ev, type) {


    let customerName = ev.target.value;
    switch (type) {
      case 'readyPallets':
        if (customerName != "") {
          let tempArray = this.allReadyPalletsCopy.filter(pallet => pallet.customerName.includes(customerName));
          this.allReadyPallets = tempArray

        } else {
          this.allReadyPallets = this.allReadyPalletsCopy;
        }
        break;
      case 'closedPallets':
        if (customerName != "") {
          let tempArray = this.allClosedPalletsCopy.filter(pallet => pallet.customer.includes(customerName));
          this.allClosedPallets = tempArray

        } else {
          this.allClosedPallets = this.allClosedPalletsCopy;
        }
        break;

    }




  }

  // openData() {
  //   debugger;

  //   this.currCustomer = this.selectedArr[0].customerName
  //   this.packedList.costumerName = this.selectedArr[0].customerName

  //   this.customerService.getCostumerByName(this.currCustomer).subscribe(data => {
  //     debugger;
  //     this.currCustomerNumber = data[0].costumerId
  //     this.packedList.costumerNumber = data[0].costumerId
  //     this.packedForBill();

  //   })
  // }

  getAllClosedPallets() {
    debugger;
    this.formService.getAllClosedPallets().subscribe(data => {

      if (data) {

        data.forEach((pallet => {
          if (pallet.plStatus == 'available') {
            pallet.plStatus = 'פנוי'
          } else {
            pallet.plStatus = 'תפוס'
          }
        }));

        this.allClosedPallets = data;
        this.allClosedPalletsCopy = data;
      }

    })
  }

  

  saveNewUnits(item) {
    var pallet = this.selectedArr.find(p => p._id == item._id)
    if (pallet) {
      if(this.unitsToPallet == ''){
        this.toastr.error('חובה למלא כמות חדשה')
      } else {
        pallet.unitsToCombine = this.unitsToPallet
        pallet.allUnits = this.unitsToPallet
        this.edit('', '');
        this.toastr.success('כמות חדשה עודכנה בהצלחה')
        this.unitsToPallet = ''
       
      }
    }
  }



  chooseCostumerToAdd(packedlist) {
    debugger;
    this.palletToAdd;
    packedlist.pallets.push(this.palletToAdd);

    this.formService.addPalletToExistPackList(packedlist).subscribe(data => {
      if (data) {
        this.allPackedLists = data;
        this.toastr.success("משטח נוסף ללקוח")
      }

    })
  }
  choosePalletToAdd(pallet) {
    debugger;
    if(this.lineToAdd.allUnits > 0){
      pallet.lines.push(this.lineToAdd);
      this.formService.addLineToExistPallet(pallet).subscribe(data => {
        if (data) {
          this.toastr.success('נוסף למשטח בהצלחה ')
        }
      })
    } else {
      this.toastr.error('שים לב פריט זה עם כמות 0')
    }
    

  }
  choosePLToAdd(pl) {
    debugger;
    if (pl.readyForBill == 'Yes') {
      pl.readyForBill = true
    } else {
      pl.readyForBill = false
    }

    pl.pallets.push(this.palletToAdd);

    this.formService.addPalletToExistPL(pl).subscribe(data => {
      if (data) {
        this.toastr.success('נוסף לרשימת אריזה בהצלחה')
        this.allReadyPackedLists = data;
      }
    })

  }

  getCostumers() {
    this.customerService.getAllCostumers().subscribe(res => this.allCustomers = res);
  }

  viewItemsInPallet(pallet) {
    debugger;
    this.currentPallet = pallet;
    this.itemsInPalletModal = true;
  }

  delOrMovePallet(pallet) {
    debugger;

    this.deleteOrMoveModal = true;
    this.currentPallet = pallet
    
    
    // if (confirm("האם למחוק משטח זה ?")) {
    //   debugger;
    //   var palletToDelete = {
    //     id: pallet._id,
    //     costumerName: pallet.customerName,
    //     costumerId: this.currCustomerId
    //   }
    //   this.formService.deletePalletById(palletToDelete).subscribe(data => {
    //     this.allPackedLists = data;

    //   })
    // }

  }

  createNewPallet() {
    
    debugger;
    this.pallet.customer = this.selectedArr[0].customerName
    this.pallet.status = 'closedPallet'
    this.pallet.plStatus = 'occupied'
    this.pallet.lines = this.selectedArr
    this.formService.createNewPallet(this.pallet).subscribe(data => {
      if (data) {
        this.toastr.success('משטח הוקם בהצלחה !')
        this.getAllClosedPallets()
        this.getAllReadyPallets();
        this.getAllPackedLists();
        this.selectedArr = [];
      }
    })


  }

  createNewPL() {
    debugger;
    if(this.customerForPL != '' && this.customerForPL != undefined){
      this.packedList.costumerName = this.customerForPL
      this.formService.addNewPackedList(this.packedList).subscribe(data => {
        if (data) {
          this.toastr.success("טופס נשמר בהצלחה")
          this.allPackedLists = data;
          this.getAllClosedPallets();
  
        }
  
  
      })
    }  else {
      this.toastr.error('אנא בחר לקוח')
    }
  }

  sendForBill(packlist) {
    debugger;
    if (confirm('האם לשלוח להפקת חשבונית ?')) {
      packlist.readyForBill = true;

      this.formService.updatePLStatus(packlist).subscribe(data => {
        if (data) {
          this.toastr.success('נשלח להפקת חשבונית');
          this.getAllReadyForBill();
        }
      })
    }

  }


  checkTrueOrFalse(packlist) {
    if (packlist.readyForBill == false || packlist.readyForBill == 'No') {
      return 'redColor'
    } else {
      return 'greenColor'
    }
  }
  checkPLstatus(pallet) {
    if (pallet.plStatus == 'occupied' || pallet.plStatus == 'תפוס') {
      return 'redColor'
    } else {
      return 'greenColor'
    }
  }




  getAllPackedLists() {
    this.formService.getAllPackedLists().subscribe(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].readyForBill == true) {
            data[i].readyForBill = 'Yes'
          } else {
            data[i].readyForBill = 'No'
          }

        }
      }
      this.allPackedLists = data;
    })
  }

  openProductForm(packlist) {
    debugger;
    this.selectedArr = packlist.pallets
    this.currCustomer = packlist.costumerName
    this.currCustomerNumber = packlist.costumerNumber
    this.packedList.costumerName = this.currCustomer
    this.packedList.costumerNumber = this.currCustomerNumber

    this.currCustomerId = packlist._id
    this.showProductsBeforeDelivery = true;
  }

  getAllReadyForBill() {
    this.formService.getAllReadyForBillPLs().subscribe(data => {
      if (data) {

        for (let i = 0; i < data.length; i++) {
          if (data[i].readyForBill == true) {
            data[i].readyForBill = 'Yes'
          } else {
            data[i].readyForBill = 'No'
          }

        }
        this.allReadyPackedLists = data;
      }

    })
  }
}
