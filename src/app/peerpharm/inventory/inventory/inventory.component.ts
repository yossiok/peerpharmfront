import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  
  itemType:string;
  newItem:boolean;
  existItem:boolean;
  itemArrivals:boolean = false;
  whareHouses = [];
  currItemShelfs = [];
  currentWhareHouseId:string;
  currentWhareHouseName:string;
  allArrivals = []








  componentArrival = {
    item:'',
    position:'',
    amount:'',
    arrivalDate:this.formatDate(new Date()),
    deliveryNote:'',
    itemType:this.itemType,
    shell_id_in_whareHouse:'',
    whareHouse:this.currentWhareHouseName

  }
  
  constructor(private inventoryService:InventoryService,private authService:AuthService) { }

  ngOnInit() {
    this.getUserWhs();
  }


  setItemType(ev){
  let itemType = ev.target.value;
  this.itemType = itemType
  }

  setItemMovement(movement){
    if(movement == 'new'){
      this.newItem = true;
      this.existItem = false;
    }
    if(movement == 'exist'){
      this.existItem = true;
      this.newItem = false;
    }
  }

  setWhareHouse(ev){
    debugger;
  if(ev != ''){
    this.currentWhareHouseId = ev.target.value;
    let whareHouse = this.whareHouses.find(w=>w._id == ev.target.value);
    this.currentWhareHouseName = whareHouse.name
  }
  }

  fillShelfPosition(shelf){
    if(shelf){
      this.componentArrival.position = shelf.position
      this.componentArrival.shell_id_in_whareHouse = shelf.shell_id_in_whareHouse

    }
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

  addComponentToTable(componentArrival){
    let ObjToPush = {...componentArrival}
    this.allArrivals.push(ObjToPush)
    this.cleanArrivalFields();

  }

  cleanArrivalFields(){
    this.componentArrival.amount = '';
    this.componentArrival.arrivalDate = this.formatDate(new Date());
    this.componentArrival.deliveryNote = '';
    this.componentArrival.item = '';
    this.componentArrival.position = '';
    this.currItemShelfs = [];
  }







  // ---------------------- POST --------------------- //


  recieveComponents(){
  debugger;
  this.allArrivals

  this.inventoryService.recieveNewComponents(this.allArrivals).subscribe(data=>{

  })

  
  }












  // ------------------------- GET ---------------------- //

  getUserWhs(){
    debugger;
    this.inventoryService.getWhareHousesList().subscribe(async res => {
      let displayAllowedWH = [];
        // for (const wh of res) {
        await res.forEach((wh)=> {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        });
        this.whareHouses = displayAllowedWH;
   

        });
  }

  searchItemShelfs(ev){
    debugger;
    if(ev!=""){
      this.inventoryService.getShelfListForItemInWhareHouse(ev.target.value, this.currentWhareHouseId).subscribe(async res => {
        debugger;
        if(res.length>0){
          this.currItemShelfs=res;
          
        }else{
          this.currItemShelfs=[];
          this.currItemShelfs.push("NO SHELFS WITH ITEM # "+ev.target.value);
        }
      });  
    }
   
 }
}
