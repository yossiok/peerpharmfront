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
  unitsToPallet: any;
  allReadyPallets: any[]
  allReadyPalletsCopy: any[]
  selectedArr: any[] = [];
  showProductsBeforeDelivery: boolean = false;
  currCustomer: string;
  currCustomerNumber: string;
  currCustomerId: string;
  allPackedLists: any[];
  showAllReadyCostumers: boolean = false;
  showBillNumber: boolean = false;
  combineModal: boolean = false;
  palletToAdd: any[];
  allReadyPackedLists: any[];



  packedList = {
    costumerName: '',
    costumerNumber: '',
    pallets: this.selectedArr,
    readyForBill: false
  }


  @ViewChild('billNumberToUpdate') billNumberToUpdate: ElementRef;




  constructor(private toastr: ToastrService, private customerService: CostumersService, private formService: FormsService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.insertBill();
    this.edit('', '')
  }

  ngOnInit() {
    this.getAllReadyPallets();
    this.getAllPackedLists();
    this.getAllReadyForBill();
  }

  insertBill() {
    if (this.showBillNumber == false) {
      this.showBillNumber = true;
    } else {
      this.showBillNumber = false;
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



  getAllReadyPallets() {
    debugger;
    this.formService.getAllReadyPallets().subscribe(data => {
      this.allReadyPallets = data;
      this.allReadyPalletsCopy = data;

    })

  }

  isSelected(ev, pallet) {
    debugger
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr;
      pallet.fullKartons = Number(pallet.floorNumber) * Number(pallet.kartonQuantity) + Number(pallet.lastFloorQuantity)
      pallet.allUnits = (Number(pallet.floorNumber) * Number(pallet.kartonQuantity) * Number(pallet.unitsInKarton)) + (Number(pallet.lastFloorQuantity) * Number(pallet.unitsInKarton)) + pallet.unitsQuantityPartKarton
      if (pallet.unitsQuantityPartKarton > 0) {
        pallet.allKartons = Number(pallet.floorNumber) * Number(pallet.kartonQuantity) + Number(pallet.lastFloorQuantity) + 1
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
        this.showBillNumber = false;
        this.toastr.success("מספר חשבונית עודכן בהצלחה!")
      }

    })
  }

  filterByCustomer(ev) {
    let customerName = ev.target.value;

    if (customerName != "") {
      let tempArray = this.allReadyPalletsCopy.filter(pallet => pallet.customerName.includes(customerName));
      this.allReadyPallets = tempArray

    } else {
      this.allReadyPallets = this.allReadyPalletsCopy;
    }
  }

  openData() {
    debugger;

    this.currCustomer = this.selectedArr[0].customerName
    this.packedList.costumerName = this.selectedArr[0].customerName

    this.customerService.getCostumerByName(this.currCustomer).subscribe(data => {
      debugger;
      this.currCustomerNumber = data[0].costumerId
      this.packedList.costumerNumber = data[0].costumerId
      this.packedForBill();

    })
  }

  createNewPallet() {
    this.selectedArr
    debugger;
  }

  saveNewUnits(item){
  var pallet = this.selectedArr.find(p=>p._id == item._id)
  if(pallet){
    pallet.unitsToCombine = this.unitsToPallet
    this.edit('','');
    this.toastr.success('כמות חדשה עודכנה בהצלחה')
    this.unitsToPallet = ''
  }
  }

  addPalletToCostumer(pallet) {
    this.showAllReadyCostumers = true;
    this.palletToAdd = pallet
    debugger;



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

  deletePallet(pallet) {
    if (confirm("האם למחוק משטח זה ?")) {
      debugger;
      var palletToDelete = {
        id: pallet._id,
        costumerName: pallet.customerName,
        costumerId: this.currCustomerId
      }
      this.formService.deletePalletById(palletToDelete).subscribe(data => {
        this.allPackedLists = data;

      })
    }


  }

  packedForBill() {
    debugger;

    this.packedList;

    this.formService.addNewPackedList(this.packedList).subscribe(data => {
      if (data) {
        this.toastr.success("טופס נשמר בהצלחה")
        this.allPackedLists = data;

      }


    })

  }

  sendForBill(packlist) {
    debugger;
    if (confirm('האם לשלוח להפקת חשבונית ?')) {
      packlist.readyForBill = true;

      this.formService.updatePLStatus(packlist).subscribe(data => {

      })
    }

  }


  checkTrueOrFalse(packlist) {
    if (packlist.readyForBill == false) {
      return 'redColor'
    } else {
      return 'greenColor'
    }
  }



  getAllPackedLists() {
    this.formService.getAllPackedLists().subscribe(data => {
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
        this.allReadyPackedLists = data;
      }

    })
  }
}
