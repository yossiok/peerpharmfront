import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CostumersService } from 'src/app/services/costumers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-shelf-list',
  templateUrl: './shelf-list.component.html',
  styleUrls: ['./shelf-list.component.scss']
})
export class ShelfListComponent implements OnInit {


  allShelfs:any;
  allCostumers:any;
  EditRow:any;
  shelfPos:any;
  shelfItemN:any;
  materialShelfs:any;
  allShelfsCopy:any;
  itemType:any;


  item = {
    countDate:this.formatDate(new Date()),
    countedAmount:'',
    signature:'עמר',
    costumer:''
  }

  @ViewChild('shelfPosition') shelfPosition: ElementRef;
  @ViewChild('shelfAmount') shelfAmount: ElementRef;
  updatingAmount: boolean;
  fetchingShelfs: boolean;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.edit('');
    this.editShelfAmount('','')
  }

  constructor(private costumerSrv:CostumersService,private toastSrv:ToastrService,private itemService:ItemsService,private inventorySrv:InventoryService) { }

  ngOnInit() {
    this.getAllCostumers();
  }



  editShelfAmount(item , position){
    ;
    if(item != '' && position != ''){
      this.shelfPos = position
      this.shelfItemN = item
    } else {
      this.shelfPos = ''
      this.shelfItemN = ''
    }
    }
  
  getShelfsByWH(ev){
    this.fetchingShelfs = true;
    let whareHouse = ev.target.value;
    switch(whareHouse) {
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
    }
    if(whareHouse == 'material' || whareHouse == 'component'){
      this.itemType = whareHouse
      whareHouse = 'Rosh HaAyin'
    }
    this.inventorySrv.shelfListByWH(whareHouse, this.itemType).subscribe(data=>{
      this.fetchingShelfs = false
    if(data){
      data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
      this.allShelfs = data;
      this.allShelfsCopy = data;
    }
    else this.toastSrv.error('No Shelfs in Wharehouse')
    })
  }

  filterByShelf(ev){
    this.allShelfs = this.allShelfsCopy
    let position = ev.target.value;

    if(position != ''){
      if(position == 'QC ROOM'){
        this.allShelfs = this.allShelfs.filter(s=>s.position.includes(position))
      } else {
        this.allShelfs = this.allShelfs.filter(s=>s.position == position)
      }
    
    } else {
      this.allShelfs = this.allShelfsCopy
    }
    

  }

  searchForShelfs(ev){
    ;
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
    this.updatingAmount = true;
    this.item;
    ;
    let objToUpdate = {
      item:shelf.item,
      position:shelf.position,
      amountBefore:shelf.total,
      countDate:this.item.countDate,
      arrivalDate: shelf.arrivalDate,
      countedAmount:shelf.countedAmount,
      signature:this.item.signature
    }
    if(confirm('האם לעדכן מדף ?')){
      this.inventorySrv.updateShelfAmount(objToUpdate).subscribe(data=>{
        this.updatingAmount = false;
        if(data){
          ;
          let shelf = this.allShelfs.find(s=>s.item == data.item && s.position == data.position);
          shelf.total = data.amount
          this.toastSrv.success('פריט עודכן בהצלחה !')
          this.editShelfAmount('','')
          this.item.countedAmount = ''
          this.item.signature = 'עמר'
        }
        })
    }
 
  }

  edit(id){
  if(id != ''){
    this.EditRow = id
  } else {
    this.EditRow = ''
  }
  }

  filterByCostumer(ev){
    ;
    this.allShelfs = this.allShelfsCopy
    let costumer = ev.target.value;

    if(costumer != ''){
      this.allShelfs = this.allShelfs.filter(s=>s.costumer == costumer)
    } else {
      this.allShelfs = this.allShelfsCopy
    }
  }

  updateShelfCostumer(shelf){
  this.inventorySrv.updateShelfCostumer(shelf,this.item.costumer).subscribe(data=>{
    ;
    if(data){
      let shelf = this.allShelfs.find(s=>s.item == data.item && s.position == data.position);
      if(shelf){
        shelf.costumer = data.tempCostumer
        this.toastSrv.success('לקוח עודכן בהצלחה !')
        this.editShelfAmount('','')
      }
      
    }
  })
  }

  updateShelf(id){
  ;
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

  getAllCostumers(){
  this.costumerSrv.getAllCostumers().subscribe(data=>{
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
