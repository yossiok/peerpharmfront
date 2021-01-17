import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


  allShelfs:any;
  EditRow:any;
  shelfPos:any;
  shelfItemN:any;
  materialShelfs:any;
  allShelfsCopy:any;
  itemType:any;


  item = {
    countDate:this.formatDate(new Date()),
    countedAmount:'',
    signature:''
  }

  @ViewChild('shelfPosition') shelfPosition: ElementRef;
  @ViewChild('shelfAmount') shelfAmount: ElementRef;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.edit('');
    this.editShelfAmount('','')
  }

  constructor(private toastSrv:ToastrService,private itemService:ItemsService,private inventorySrv:InventoryService) { }

  ngOnInit() {
  }



  editShelfAmount(item , position){
    debugger;
    if(item != '' && position != ''){
      this.shelfPos = position
      this.shelfItemN = item
    } else {
      this.shelfPos = ''
      this.shelfItemN = ''
    }
    }
  
  getShelfsByWH(ev){
    debugger;
    let whareHouse = ev.target.value;
    if(whareHouse == 'materials' || whareHouse == 'components'){
      this.itemType = whareHouse
      whareHouse = '5c1124ef2db99c4434914a0e'
      
    }
    this.inventorySrv.shelfListByWH(whareHouse).subscribe(data=>{
    if(data){
      data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      if(this.itemType == 'components') data = data.filter(s=>s.itemType == 'component')
      if(this.itemType == 'materials') data = data.filter(s=>s.itemType == 'material')
      this.allShelfs = data;
      this.allShelfsCopy = data;

      
    }
    })
  }

  filterByShelf(ev){
    debugger;
    this.allShelfs = this.allShelfsCopy
    let position = ev.target.value;

    if(position != ''){
      this.allShelfs = this.allShelfs.filter(s=>s.position == position)
    } else {
      this.allShelfs = this.allShelfsCopy
    }
    

  }

  searchForShelfs(ev){
    debugger;
    if(ev.target.value != ''){
      this.inventorySrv.getShelfListForMaterial(ev.target.value).subscribe(data=>{
      if(data.msg =='noShelf'){
        this.toastSrv.error('חומר גלם לא נמצא על מדף מסוים')
      } else {
      this.materialShelfs = data;
      }
      })
    }
  
  }

  updateShelfAmount(shelf){
    this.item;
    debugger;
    let objToUpdate = {
      item:shelf.item,
      position:shelf.position,
      amountBefore:shelf.total,
      countDate:this.item.countDate,
      countedAmount:this.item.countedAmount,
      signature:this.item.signature
    }

    this.inventorySrv.updateShelfAmount(objToUpdate).subscribe(data=>{
    if(data){
      debugger;
      let shelf = this.allShelfs.find(s=>s.item == data.item && s.position == data.position);
      shelf.total = data.amount
      this.toastSrv.success('פריט עודכן בהצלחה !')
      this.editShelfAmount('','')
      this.item.countedAmount = ''
      this.item.signature = ''
    }
    })
  }

  edit(id){
  if(id != ''){
    this.EditRow = id
  } else {
    this.EditRow = ''
  }
  }

  updateShelf(id){
  debugger;
  let amount = this.shelfAmount.nativeElement.value;
  let position = this.shelfPosition.nativeElement.value;

  let shelfToUpdate = this.materialShelfs.find(s=>s._id == id);
  shelfToUpdate.amount = amount;
  shelfToUpdate.position = position;

  this.inventorySrv.updateShelf(shelfToUpdate).subscribe(data =>{
    if(data){
      this.toastSrv.success('מדף עודכן בהצלחה !')
      this.edit('');
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
    

}
