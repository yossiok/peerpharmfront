import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { PlatformLocation } from '@angular/common';
import { log } from 'util';
import { OrdersService } from 'src/app/services/orders.service';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-qa-pallets',
  templateUrl: './qa-pallets.component.html',
  styleUrls: ['./qa-pallets.component.scss']
})
export class QaPalletsComponent implements OnInit {

  EditRow: any;
  EditRowTwo: any;
  EditRowN: any;
  editBill: any;
  editCustomer: any;
  currPLNumber: any;
  customerForPL: any;
  customerForPallet: any;
  unitsToPallet: any;
  deleteLine: boolean = false;
  currentPallet: any;
  currPLWeight: number = 0;
  allQaPallets: any[]
  allQaPalletsCopy: any[]
  allProducts: any[]
  combinedPallets: any[]
  allCustomers: any[]
  allClosedPallets: any[]
  allClosedPalletsCopy: any[]
  selectedArr: any[] = [];
  showProductsBeforeDeliveryHE: boolean = false;
  showProductsBeforeDeliveryEN: boolean = false;
  deleteOrMoveModal: boolean = false;
  itemsInPalletModal: boolean = false;
  currCustomer: string;
  currCustomerNumber: string;
  currCustomerId: string;
  allPackedLists: any[];
  allPackedListsCopy: any[];
  showAllReadyCostumers: boolean = false;
  showAllClosedPallets: boolean = false;
  showAllPackedLists: boolean = false;
  combineModal: boolean = false;
  palletToAdd: any;
  lineToAdd: any;
  allReadyPackedLists: any[];
  allReadyPackedListsCopy: any[];
  readyBills: any[];
  readyBillsCopy: any[];

  today: Date = new Date();


  pallet = {
    customer: '',
    lines: [],
    status: '',
    palletNumber: '',
    plStatus: '',
    palletWeight: '',
    palletSize: ''

  }



  packedList = {
    costumerName: '',
    costumerNumber: '',
    pallets: [],
    readyForBill: false
  }


  @ViewChild('billNumberToUpdate') billNumberToUpdate: ElementRef;
  @ViewChild('newPalletWeight') newPalletWeight: ElementRef;
  @ViewChild('newPalletSize') newPalletSize: ElementRef;




  constructor(private itemService: ItemsService, private inventorySrv: InventoryService, private authService: AuthService, private orderService: OrdersService, private toastr: ToastrService, private customerService: CostumersService, private formService: FormsService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.editBillNumber('')
    this.edit('', '')
    this.editPallet('')
    this.updateCustomer('')
  }

  ngOnInit() {
    this.getAllqaPallets();
    this.getAllPackedLists();
    this.getAllReadyForBill();
    this.getAllClosedPallets();
    this.getAllReadyBills();
    this.getCostumers();
    // this.getAllProducts();
    this.getUser();
  }
  getUser() {
    if (this.authService.loggedInUser.userName == 'sima' || this.authService.loggedInUser.userName == 'effi') {
      this.deleteLine = true
    }
  }

  deleteQAPallet(id) {
    if (confirm('האם לסגור משטח זה ?')) {
      this.formService.deletePalletById(id).subscribe(data => {
        ;
        if (data) {
          this.allQaPallets = this.allQaPallets.filter(p => p._id != data._id)
        }
      })
    }

  }

  deleteNewPallete(palletNumber, customerName) {
    if (confirm(`DELETE PALLET ${palletNumber}`)) {
      if(confirm('המשטח וכל הפריטים שבו יימחקו. האם להמשיך?')) {
        this.formService.deleteNewPallete(palletNumber, customerName).subscribe(data => {
          if(!data.msg) {
            this.toastr.success('משטח נמחק בהצלחה')
            // location.reload()
          }
          else this.toastr.error(data.msg)
        })
      }
    }
  }

  cancelPackList(pLId) {
    if (confirm('האם לבטל רשימה זו ?')) {
      this.formService.cancelPackListById(pLId).subscribe(data => {
        if (data) {
          this.toastr.success('רשימה בוטלה בהצלחה !')
          this.getAllPackedLists();
        }
      })
    }
  }

  saveNewCustomerForPallet(ev, id) {
    let pallet = this.allQaPallets.find(p => p._id == id);
    pallet.customerName = ev.target.value;
    this.formService.updateQAPallet(pallet).subscribe(data => {
      if (data) {
        this.toastr.success('לקוח עודכן בהצלחה !')
        this.updateCustomer('')
      }
    })
  }

  updateCustomer(id) {
    if (id != '') {
      this.editCustomer = id
    } else {
      this.editCustomer = ''
    }
  }

  editBillNumber(id) {
    if (id != '') {
      this.editBill = id
    } else {
      this.editBill = ''
    }
  }

  editPallet(palletNumber) {
    if (palletNumber != '') {
      this.EditRowN = palletNumber;

    } else {
      this.EditRowN = '';

    }
  }

  edit(itemNumber, customerName) {
    ;
    if (itemNumber != '' && customerName != '') {
      this.EditRow = itemNumber;
      this.EditRowTwo = customerName;
    } else {
      this.EditRow = '';
      this.EditRowTwo = '';
    }
  }

  addPalletToPackList(pallet) {
    ;
    pallet.plStatus = 'occupied'
    this.palletToAdd = pallet
    this.showAllPackedLists = true
  }

  addLineToPallet(line) {
    debugger
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
    ;



  }

  getAllqaPallets() {
    ;
    this.formService.getAllqaPallets().subscribe(data => {
      this.allQaPallets = data;
      this.allQaPalletsCopy = data;
      this.filterTable('ready')

    })

  }

  filterTable(type) {
    ;
    this.allQaPallets = this.allQaPalletsCopy
    switch (type) {

      case 'all':
        this.allQaPallets = this.allQaPalletsCopy
        break;
      case 'ready':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'מוכן לשליחה')
        break;
      case 'stickers':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר מדבקות')
        break;
      case 'laser':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר לייזר')
        break;
      case 'cartons':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר קרטונים')
        break;
      case 'cartonsMaster':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר קרטוני מאסטר')
        break;
      case 'personalPackge':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'עובר לאריזה אישית')
        break;

      case 'components':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר קומפוננטים')
        break;
      case 'leaflet':
        this.allQaPallets = this.allQaPallets.filter(p => p.qaStatus == 'חסר עלונים לצרכן')
        break;


    }
  }



  movePalletToPL() {
    ;
    this.currentPallet
    this.currentPallet.packListID = this.customerForPL
    var objToSend = { ...this.currentPallet }
    this.formService.movePalletToPL(objToSend).subscribe(data => {
      if (data) {
        ;
        this.toastr.success('משטח הועבר בהצלחה !')
        this.getAllPackedLists();
        for (let i = 0; i < this.selectedArr.length; i++) {
          if (this.selectedArr[i]._id == this.currentPallet._id) {
            this.selectedArr.splice(i, 1);
          }

        }

      }
    })
  }

  updatePalletDetails(pallet) {
    ;
    let size = this.newPalletSize.nativeElement.value;
    let weight = this.newPalletWeight.nativeElement.value;
    pallet.palletSize = size;
    pallet.palletWeight = weight;
    this.formService.updatePallet(pallet).subscribe(pallet => {
      ;
      if (pallet) {
        let oldPallet = this.allClosedPallets.find(p => p._id == pallet._id);
        oldPallet.palletSize = pallet.palletSize
        oldPallet.palletWeight = pallet.palletWeight
        this.editPallet('')
        this.toastr.success('פרטים עודכנו בהצלחה !')
        this.getAllPackedLists();
      }
    })
  }

  isSelected(ev, pallet) {
    

    this.orderService.getOrderItemsByNumber(pallet.orderNumber).subscribe(data => {
      if (data) {
        ;
        data.forEach(item => {
          if (pallet.itemNumber == item.itemNumber) {
            pallet.orderAmount = item.quantity
          }
        });
      }
    })
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr;
      pallet.fullKartons = Number(pallet.floorNumber) * Number(pallet.kartonQuantity) + pallet.lastFloorQuantity;
      if (pallet.allUnits == undefined || pallet.allUnits == null) {
        pallet.allUnits = (Number(pallet.floorNumber) * Number(pallet.kartonQuantity) + pallet.lastFloorQuantity) * Number(pallet.unitsInKarton)
        if (Number(pallet.lastFloorQuantity) > 0 && pallet.kartonQuantity > 0) {
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
    ;
    var billNumber = this.billNumberToUpdate.nativeElement.value;
    this.formService.insertBillNumber(id, billNumber).subscribe(data => {
      ;
      if (data) {
        for (let i = 0; i < this.allReadyPackedLists.length; i++) {
          if (this.allReadyPackedLists[i]._id == data._id) {
            this.allReadyPackedLists[i].billNumber = data.billNumber
          }

        }
        this.editBillNumber('')
        this.toastr.success("מספר חשבונית עודכן בהצלחה!")

        setTimeout(() => {
          this.getAllReadyForBill();
        }, 2000);
      }

    })
  }

  filterQAPalletesByCustomer(ev, type) {
    let customerName = ev.target.value.toLowerCase();
    switch (type) {
      case 'readyPallets':
        if (customerName && customerName != '') {
          let tempArray = this.allQaPalletsCopy.filter(pallet => pallet.customerName && pallet.customerName.toLowerCase().includes(customerName));
          this.allQaPallets = tempArray
        } else {
          this.allQaPallets = this.allQaPalletsCopy;
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

  filterQAPalletesByOrderNumber(ev) {
    this.allQaPallets = this.allQaPalletsCopy
    let orderNumber = ev.target.value.toLowerCase();
    let tempArray = this.allQaPallets.filter(pallet => pallet.orderNumber && pallet.orderNumber.toLowerCase().includes(orderNumber))
    this.allQaPallets = tempArray
  }

  filterQAPalletesByItemNumber(ev) {
    this.allQaPallets = this.allQaPalletsCopy
    let itemNumber = ev.target.value.toLowerCase();
    let tempArray = this.allQaPallets.filter(pallet => pallet.itemNumber && pallet.itemNumber.toLowerCase().includes(itemNumber))
    this.allQaPallets = tempArray
  }

  //רשימות אריזה
  filterPackedListsByCustomer(ev) {
    this.allPackedLists = this.allPackedListsCopy
    let customerName = ev.target.value.toLowerCase();
    let tempArray = this.allPackedLists.filter(list => list.costumerName && list.costumerName.toLowerCase().includes(customerName))
    this.allPackedLists = tempArray
  }

  //מוכנים לחשבונית
  filterReadyPackedListsByCustomer(ev) {
    this.allReadyPackedLists = this.allReadyPackedListsCopy
    let customerName = ev.target.value.toLowerCase();
    let tempArray = this.allReadyPackedLists.filter(list => list.costumerName && list.costumerName.toLowerCase().includes(customerName))
    this.allReadyPackedLists = tempArray
  }

  filterReadyBillsByBillNumber(ev) {
    this.readyBills = this.readyBillsCopy
    let billNumber = ev.target.value
    let tempArray = this.readyBills.filter(bill => bill.billNumber && bill.billNumber.toLowerCase().includes(billNumber))
    this.readyBills = tempArray
  }






  // openData() {
  //   ;

  //   this.currCustomer = this.selectedArr[0].customerName
  //   this.packedList.costumerName = this.selectedArr[0].customerName

  //   this.customerService.getCostumerByName(this.currCustomer).subscribe(data => {
  //     ;
  //     this.currCustomerNumber = data[0].costumerId
  //     this.packedList.costumerNumber = data[0].costumerId
  //     this.packedForBill();

  //   })
  // }

  getAllClosedPallets() {
    ;
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
    ;
    var pallet = this.selectedArr.find(p => p._id == item._id)
    if (pallet) {
      if (this.unitsToPallet == '') {
        this.toastr.error('חובה למלא כמות חדשה')
      } else {
        pallet.unitsToCombine = this.unitsToPallet

        this.edit('', '');
        this.toastr.success('כמות חדשה עודכנה בהצלחה')
        this.unitsToPallet = ''

      }
    }
  }



  chooseCostumerToAdd(packedlist) {
    ;
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
    ;
    if (this.lineToAdd.allUnits > 0) {
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
    ;
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
        this.allReadyPackedListsCopy = data;
      }
    })

  }

  getCostumers() {
    this.customerService.getAllCostumers().subscribe(res => this.allCustomers = res);
  }

  viewItemsInPallet(pallet) {
    ;
    this.currentPallet = pallet;
    this.itemsInPalletModal = true;
  }

  delOrMovePallet(pallet) {
    ;

    this.deleteOrMoveModal = true;
    this.currentPallet = pallet


    // if (confirm("האם למחוק משטח זה ?")) {
    //   ;
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

    ;
    this.pallet.customer = this.selectedArr[0].customerName
    this.pallet.status = 'closedPallet'
    this.pallet.plStatus = 'occupied'
    this.pallet.lines = this.selectedArr
    this.formService.createNewPallet(this.pallet).subscribe(data => {
      if (data) {
        this.toastr.success('משטח הוקם בהצלחה !')
        this.pallet.palletSize = ''
        this.pallet.palletWeight = ''
        this.getAllClosedPallets()
        this.getAllqaPallets();
        this.getAllPackedLists();
        this.selectedArr = [];
      }
    })


  }

  createNewPL() {
    ;
    if (this.customerForPL != '' && this.customerForPL != undefined) {
      this.packedList.costumerName = this.customerForPL
      this.formService.addNewPackedList(this.packedList).subscribe(data => {
        if (data) {
          this.toastr.success("טופס נשמר בהצלחה")
          this.allPackedLists = data;
          this.getAllClosedPallets();

        }


      })
    } else {
      this.toastr.error('אנא בחר לקוח')
    }
  }

  sendForBill(packlist) {
    ;
    if (confirm('האם לשלוח להפקת חשבונית ?')) {
      packlist.readyForBill = true;

      this.formService.updatePLStatus(packlist).subscribe(data => {
        if (data) {
          this.allPackedLists = data;
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
      this.allPackedLists = data;
      this.allPackedListsCopy = data;
    })
  }

  openProductForm(packlist, language) {
    ;
    this.currPLNumber = packlist.packListNumber
    this.selectedArr = packlist.pallets

    // this.selectedArr.forEach(pallet => {
    //   pallet.lines.forEach(line => {
    //     this.allProducts.forEach(product => {
    //       if(product.componentN == line.itemNumber){
    //         line.itemName = product.componentName
    //       }
    //     });
    //   });
    // });
    this.currCustomer = packlist.costumerName
    this.currCustomerNumber = packlist.costumerNumber
    this.packedList.costumerName = this.currCustomer
    this.packedList.costumerNumber = this.currCustomerNumber
    this.currPLWeight = 0;
    packlist.pallets.forEach(pallet => {
      if (pallet.palletWeight) {
        this.currPLWeight += Number(pallet.palletWeight)
      }

    });
    let result = []

    packlist.pallets.forEach(pallet => {
      pallet.lines.forEach(line => {
        let obj = {
          itemNumber: line.itemNumber,
          quantity: line.unitsToCombine
        }

        result.push(obj)

      });
    });


    const totals = result.reduce((acc, val) => {
      const key = val.itemNumber;
      const { quantity } = val;
      const totalSoFar = acc[key] || 0;
      return { ...acc, [key]: totalSoFar + quantity };
    }, {});

    const combinedResult = Object.entries(totals)
      .map(([itemNumber, quantity]) => ({ itemNumber, quantity }));
    console.log(result);
    this.currCustomerId = packlist._id
    this.combinedPallets = combinedResult

    if (language == 'HE') {
      this.showProductsBeforeDeliveryHE = true;
      this.showProductsBeforeDeliveryEN = false;
    }
    if (language == 'EN') {
      this.showProductsBeforeDeliveryEN = true;
      this.showProductsBeforeDeliveryHE = false;
    }
  }

  getAllReadyBills() {
    this.formService.getAllReadyBills().subscribe(data => {
      if (data) {
        this.readyBills = data
        this.readyBillsCopy = data
      }
    })
  }

  getAllReadyForBill() {
    this.formService.getAllReadyForBillPLs().subscribe(data => {
      if (data) {

        ;
        data.forEach(PL => {
          if (PL.pallets) {
            PL.pallets.forEach(pallet => {
              if (pallet.lines) {
                pallet.lines.forEach(line => {
                  if (PL.orders == undefined) {
                    PL.orders = []
                    PL.orders.push(line.orderNumber)
                  } else {
                    PL.orders.push(line.orderNumber)
                  }

                });
              }
            });
          }

        });

        data.forEach(PL => {
          PL.orders = [...new Set(PL.orders)];
        });



        this.allReadyPackedLists = data;
      }

    })
  }
}
