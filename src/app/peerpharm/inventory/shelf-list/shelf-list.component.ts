import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ExcelService } from 'src/app/services/excel.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


  allShelfs: any;
  allCostumers: any;
  EditRow: any;
  shelfPos: any;
  shelfItemN: any;
  materialShelfs: any;
  allShelfsCopy: any;
  itemType: any;
  whareHouse: any;
  allowedWHS: string[]
  allowedCountYear: boolean = false


  item = {
    countDate: this.formatDate(new Date()),
    countedAmount: '',
    signature: 'עמר',
    costumer: ''
  }

  @ViewChild('shelfPosition') shelfPosition: ElementRef;
  @ViewChild('shelfAmount') shelfAmount: ElementRef;
  updatingAmount: boolean;
  fetchingShelfs: boolean;

  newShelfForm: FormGroup = new FormGroup({
    item: new FormControl(null, Validators.required),
    whareHouse: new FormControl(null, Validators.required),
    position: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
  })
  shellNums: any;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.edit('');
    this.editShelfAmount('', '')
  }

  constructor(
    private costumerSrv: CostumersService,
    private toastSrv: ToastrService,
    private itemService: ItemsService,
    private inventorySrv: InventoryService,
    private xlSrv: ExcelService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getAllCostumers();
    this.allowedWHS = this.authService.loggedInUser.allowedWH
    this.allowedCountYear = this.authService.loggedInUser.authorization.includes('allowedCountYear')
  }



  editShelfAmount(item, position) {
    ;
    if (item != '' && position != '') {
      this.shelfPos = position
      this.shelfItemN = item
    } else {
      this.shelfPos = ''
      this.shelfItemN = ''
    }
  }


  getAllWhShelfs() {
    this.inventorySrv.getWhareHousesList().subscribe(res => {
      let whid = res.find(wh => wh.name == this.whareHouse)._id
      if(this.allowedWHS.includes(whid)) {
      this.inventorySrv.getWhareHouseShelfList(whid).subscribe(res => {
        this.shellNums = res.map(shell => {
          shell.shell_id_in_whareHouse = shell._id
          return shell
        })
      })
    }
    else this.toastSrv.error('אינך מורשה למחסן זה!')
    })
  }

  getShelfsByWH(ev) {
    this.fetchingShelfs = true;
    let whareHouse = ev.target.value;
    this.whareHouse = ev.target.value;
    this.getAllWhShelfs()
    switch (whareHouse) {
      case 'material':
        this.itemType = whareHouse
        whareHouse = 'Rosh HaAyin'
        break
      case 'component':
        this.itemType = whareHouse
        whareHouse = 'Rosh HaAyin'
        break
      case 'Rosh HaAyin products':
        this.itemType = 'product'
        break
      case 'NEW KASEM':
        this.itemType = 'component'
        break
      case 'kasem':
        this.itemType = 'component'
        break
      case 'Labels':
        this.itemType = 'component'
    }
    if (whareHouse == 'material' || whareHouse == 'component') {
      this.itemType = whareHouse
      whareHouse = 'Rosh HaAyin'
    }
    this.inventorySrv.shelfListByWH(whareHouse, this.itemType).subscribe(data => {
      this.fetchingShelfs = false
      if (data) {
        data.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        this.allShelfs = data;
        this.allShelfsCopy = data;
      }
      else this.toastSrv.error('No Shelfs in Wharehouse')
    })
  }

  filterByShelf(ev) {
    this.allShelfs = this.allShelfsCopy
    let position = ev.target.value;

    if (position != '') {
      if (position == 'QC ROOM') {
        this.allShelfs = this.allShelfs.filter(s => s.position.includes(position))
      } else {
        this.allShelfs = this.allShelfs.filter(s => s.position == position)
      }

    } else {
      this.allShelfs = this.allShelfsCopy
    }


  }

  searchForShelfs(ev) {
    ;
    if (ev.target.value != '') {
      this.inventorySrv.getShelfListForMaterial(ev.target.value).subscribe(data => {
        if (data.msg == 'noShelf') {
          this.toastSrv.error('חומר גלם לא נמצא על מדף מסוים')
        } else {
          this.materialShelfs = data;
        }
      })
    }

  }

  exportShelfListToXl() {
    let shelfs = [...this.allShelfs]
    this.xlSrv.exportAsExcelFile(shelfs, 'Shelf Report')
  }

  updateShelfAmount(shelf) {
    this.updatingAmount = true;
    shelf.countDate = this.item.countDate
    shelf.signature = this.item.signature
    if (confirm('האם לעדכן מדף ?')) {
      this.inventorySrv.updateShelfAmount(shelf).subscribe(data => {
        this.updatingAmount = false;
        if (data) {
          let UIShelf = this.allShelfs.find(s => s._id == data.item && s.position == data.position);
          if (UIShelf) {
            UIShelf.total = data.amount
            this.toastSrv.success('פריט עודכן בהצלחה !')
          }
          else this.toastSrv.error('משהו השתבש')
          this.editShelfAmount('', '')
          this.item.countedAmount = ''
          this.item.signature = 'עמר'
        }
      })
    }

  }

  validateItem() {
    if (!this.itemType) this.toastSrv.error('', 'יש להגדיר מחסן')
    else {
      this.inventorySrv.getCmptByNumber(this.newShelfForm.value.item, this.itemType).subscribe(data => {
        if (data.length == 0) this.toastSrv.error('', '!פריט לא קיים')
      })
    }
  }

  addNewItemShelf() {
    this.inventorySrv.newShelfYearCount(this.newShelfForm.value, this.whareHouse).subscribe(data => {
      if (data.length > 0) {
        this.allShelfs = data
        this.allShelfsCopy = data
        this.toastSrv.success('מדף הוקם בהצלחה')
      }
      else this.toastSrv.error('משהו השתבש')
    })
  }

  edit(id) {
    if (id != '') {
      this.EditRow = id
    } else {
      this.EditRow = ''
    }
  }

  filterByCostumer(ev) {
    ;
    this.allShelfs = this.allShelfsCopy
    let costumer = ev.target.value;

    if (costumer != '') {
      this.allShelfs = this.allShelfs.filter(s => s.costumer == costumer)
    } else {
      this.allShelfs = this.allShelfsCopy
    }
  }

  updateShelfCostumer(shelf) {
    this.inventorySrv.updateShelfCostumer(shelf, this.item.costumer).subscribe(data => {
      ;
      if (data) {
        let shelf = this.allShelfs.find(s => s.item == data.item && s.position == data.position);
        if (shelf) {
          shelf.costumer = data.tempCostumer
          this.toastSrv.success('לקוח עודכן בהצלחה !')
          this.editShelfAmount('', '')
        }

      }
    })
  }

  updateShelf(id) {
    ;
    let amount = this.shelfAmount.nativeElement.value;
    let position = this.shelfPosition.nativeElement.value;

    let shelfToUpdate = this.materialShelfs.find(s => s._id == id);
    shelfToUpdate.amount = amount;
    shelfToUpdate.position = position;

    this.inventorySrv.updateShelf(shelfToUpdate).subscribe(data => {
      if (data) {
        this.toastSrv.success('מדף עודכן בהצלחה !')
        this.edit('');
      }
    })
  }

  getAllCostumers() {
    this.costumerSrv.getAllCostumers().subscribe(data => {
      ;
      this.allCostumers = data;
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


}
