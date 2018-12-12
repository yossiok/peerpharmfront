import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Integer } from 'aws-sdk/clients/pi';
import { ToastrService } from 'ngx-toastr';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-wharehouse',
  templateUrl: './wharehouse.component.html',
  styleUrls: ['./wharehouse.component.css']
})
export class WharehouseComponent implements OnInit {

  @ViewChild('container')
  private container: ElementRef;
  mainDivArr: any = [];
  whareHouses: any = [];
  whareHouseId: string = ""; //wharehouse id for shelf update
  curentWhareHouseId: string = ""  //wharehouse id for qty update
  curentWhareHouseName: string = "wh"  //wharehouse id to show
  changeWh: boolean = false;
  shelfs: any = [];
  shelfsCopy: any = [];
  dir: string = "";
  response = { color: '', body: '' }
  i: Integer = 0;
  constructor(private renderer: Renderer2, private inventoryService: InventoryService, private toasterSer:ToastrService) { }

  ngOnInit() {
    this.inventoryService.getWhareHousesList().subscribe(res => {
      this.whareHouses = res;
      console.log(res);
    })
  }
 
/*
  dirSet(direction) {
    this.dir = direction;
    const childElements = this.container.nativeElement.children;

    for (let child of childElements) {
      const elemnts = child.children;
      for (let elm of elemnts) {
        const mnts = elm.children;
        for (let e of mnts) {
          console.log(e.getAttribute("name"))
          if (e.getAttribute("name")) {
            if (direction == "shellChange") {
              e.style.display = 'inline';
              e.className = "dataInput";
            }
            else {
              e.style.display = 'none';
              e.className = "no";
              e.value = "";
            }
          }
        }
      }
    }

  }*/
  dirSet(direction) {
    this.dir = direction;
    const childElements = this.container.nativeElement.children;

    for (let child of childElements) {
      const elemnts = child.children;
      for (let elm of elemnts) {
        const mnts = elm.children;
        for (let e of mnts) {
          console.log(e.getAttribute("name"))
          if (e.getAttribute("name")) {
            if (direction == "shellChange" && e.getAttribute("name")=="newShelfName") {
              e.style.display = 'inline';
              e.className = "dataInput";
            } 
            else if(direction=="production" && e.getAttribute("name")=="newDemandId"){
              e.style.display = 'inline';
              e.className = "dataInput";
            }
            else {
              e.style.display = 'none';
              e.className = "no";
              e.value = "";
            }
          }
        }
      }
    }
  }

/*
  createInventoryRow(type, a) {
    let shelfsArr;
    if (type == "amount" && this.renderer.parentNode(a).getElementsByTagName("input")[0].value == "") {
      alert("נא להכניס מק``ט")
    } else {
      const rowDiv = this.renderer.createElement('div');
      const inputItem = this.renderer.createElement('input');
      const inputShelf = this.renderer.createElement('input');
      const inputQunatity = this.renderer.createElement('input');
      const inputNewShelf = this.renderer.createElement('input');
      const inputEmpty = this.renderer.createElement('input');
      const btnAdd = this.renderer.createElement('img');
      const btnShelf = this.renderer.createElement('img');
      const shelfsDiv = this.renderer.createElement('div');

      this.renderer.setProperty(btnAdd, "src", "assets/images/add.png")
      this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png")
      this.renderer.setProperty(inputShelf, "placeholder", "מדף")
      this.renderer.setProperty(inputQunatity, "placeholder", "כמות")
      this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש")
      this.renderer.setProperty(inputNewShelf, "name", "newShelfName")


      this.renderer.setStyle(btnAdd, 'width', '30px');
      this.renderer.setStyle(btnShelf, 'width', '30px');
      this.renderer.setStyle(shelfsDiv, "display", "inline-table")
      if (type == "item") {
        this.i = this.i + 1;
        this.renderer.setStyle(inputShelf, 'display', 'none');
        this.renderer.setStyle(inputQunatity, 'display', 'none');
        this.renderer.setStyle(inputNewShelf, 'display', 'none');
        this.renderer.setStyle(inputEmpty, 'display', 'none');
        this.renderer.setProperty(inputItem, "id", "id_" + this.i)

      }
      else if (type == "amount") {
        this.renderer.setProperty(btnShelf, "id", this.i)
        this.renderer.setStyle(btnShelf, 'display', 'none');
        this.renderer.setStyle(btnAdd, 'display', 'none');
        this.renderer.setStyle(shelfsDiv, 'display', 'none');
        this.renderer.setAttribute(inputItem, "class", "dataInput");
        this.renderer.setAttribute(inputShelf, "class", "dataInput");
        this.renderer.setAttribute(inputQunatity, "class", "dataInput");
        this.renderer.setAttribute(inputEmpty, "class", "dataInput");
        if (this.dir == "shellChange") {
          this.renderer.setAttribute(inputNewShelf, "class", "dataInput");
        } else {
          this.renderer.setAttribute(inputNewShelf, "class", "no");
          this.renderer.setStyle(inputNewShelf, 'display', 'none');
        }
        this.renderer.setStyle(inputItem, 'visibility', 'hidden');
        this.renderer.setProperty(inputItem, "value", this.renderer.parentNode(a).getElementsByTagName("input")[0].value)
        console.log(this.renderer.parentNode(a).getElementsByTagName("input")[0].value);
      }
      let q = this.renderer;
      this.renderer.listen(inputItem, 'focusout', () => {
        this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result=>{
          console.log(result)
          if(result[0]!=""){
            q.setProperty(shelfsDiv, "innerText", result.toString())
            q.appendChild(rowDiv, shelfsDiv);
          }else {
            q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
            q.appendChild(rowDiv, shelfsDiv);
          }
        })
      });

      this.renderer.listen(btnAdd, 'click', () => {
        this.createInventoryRow("item", btnAdd);
      });
      this.renderer.listen(btnShelf, 'click', () => {
        this.createInventoryRow("amount", btnShelf)

      });



      this.renderer.appendChild(rowDiv, btnAdd);
      this.renderer.appendChild(rowDiv, inputItem);
      this.renderer.appendChild(rowDiv, inputShelf);
      this.renderer.appendChild(rowDiv, inputQunatity);
      this.renderer.appendChild(rowDiv, inputNewShelf);
      this.renderer.appendChild(rowDiv, inputEmpty); // for the array
      this.renderer.appendChild(rowDiv, btnShelf);
      this.renderer.setStyle(inputEmpty, 'display', 'none');
      if (type == "amount") {
        this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
      } else {
        this.renderer.appendChild(this.container.nativeElement, rowDiv);
      }
    }
  }*/

  getFormData() {
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    //  for (let innerDiv of div.getElementsByTagName('input')) {
    for (let innerDiv of div.getElementsByClassName('dataInput')) {

      console.log(innerDiv.value);
      if (innerDiv.value.length > 0) {
        divArr.push(innerDiv.value);
      }
      else {
        let itemData = {
          item: divArr[0],
          shell: divArr[1],
          amount: divArr[2],
          newShelf:"",
          demandOrderId:"",
          actionType: this.dir,
          whareHouse: this.curentWhareHouseId,
        }
            debugger
            if(this.dir=="shellChange"){ // if it's for shellChange
             //   Object.assign({newShelf:divArr[3]}, itemData);
             itemData.newShelf=divArr[3];
            }  
            if(this.dir=="production"){ // if it's for production - add demandOrderId for server update
               // Object.assign({demandOrderId:divArr[3]}, itemData);
             itemData.demandOrderId=divArr[3];
                
            } 
        this.mainDivArr.push(itemData);
        divArr = [];
      }
    }
    console.log(this.mainDivArr);
   this.inventoryService.updateInventoryChanges(this.mainDivArr).subscribe(res => {
     console.log(res)
     if (res != null) {
        
     }
   });
  }

  resetForm() {
    const childElements = this.container.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.container.nativeElement, child);
    }
  }
  getShelfsList(whname) {
    let i = this.whareHouses.findIndex(wh => wh.name == whname);
    this.whareHouseId = this.whareHouses[i]._id;
    this.shelfs = [];
    this.inventoryService.getWhareHouseShelfList(this.whareHouseId).subscribe(res => {
      this.shelfs = res;
      this.shelfsCopy = res;
      console.log(this.whareHouses);
    })
  }

  addNewShelf(position) {
    //to upper case and remove spaces
    position= position.toUpperCase();
    position= position.replace(/\s/g, '');
    debugger;
    if (this.whareHouseId == "") {
      this.response.body = "Pleae choose wharehose- נא לבחור מחסן"
      this.response.color = "red"
    } else
    if (position == "") {
      this.response.body = "Pleae enter shelf - נא להקליד מדף"
      this.response.color = "red"
    }
    else {
      let shellObj = { whareHouseId: this.whareHouseId, position: position }
      this.inventoryService.addNewShelf(shellObj).subscribe(res => {
        console.log(res)
        if (res._id.length > 0) {
          this.shelfs.push(res)
          this.response.body = "Shelf Added- מדף התווסף"
          this.response.color = 'Aquamarine'
        } else {
          this.response.body = "Shelf is already exist - מדף קיים כבר"
          this.response.color = 'red'
        }
      })
    }
  }

  addNewWhareHouse(whareHouseName) {
    this.inventoryService.addNewWhareHouse(whareHouseName).subscribe(res => {
      console.log(res)
      if (res != "faild") {
        this.whareHouses.push(res)
      }
    })
  }

  setWhareHouse(whname) {
    let i = this.whareHouses.findIndex(wh => wh.name == whname);
    this.curentWhareHouseId = this.whareHouses[i]._id;
    this.curentWhareHouseName = this.whareHouses[i].name;
    this.changeWh = false;
  }

  changeCurentWh() {
    this.changeWh = true;
  }

  searchShelf(shelf) {
    console.log(shelf)
    if (shelf == "") {
      this.shelfs = this.shelfsCopy.slice();
    }
    else {
      this.shelfs = this.shelfs.filter(x => x.position.toLowerCase().includes(shelf.toLowerCase()));
    }
  }


  getItemWhShelfsList(itemNumber, shelfsDiv) {
    let a= this.inventoryService;
    let b = this.curentWhareHouseId;
    return new Promise(function (resolve, reject) {
      a.getShelfListForItemInWhareHouse(itemNumber, b).subscribe(res => {
        if(res.length>0){
             console.log(res)
             resolve(res);
        }else resolve([])
      });
    });
  }

  getChildArr(event){
    
    console.log(event)
    if(event.length>0){
      this.dir="production";
    }
    alert(event);
    event.forEach(item => {
        this.appendItems(item.number, item.orderDemandId)
    });
  }


  appendItems(number, demandOrderId){
    let shelfsArr;
   
      const rowDiv = this.renderer.createElement('div');
      const inputItem = this.renderer.createElement('input');
      const inputShelf = this.renderer.createElement('input');
      const inputQunatity = this.renderer.createElement('input');
      const inputNewShelf = this.renderer.createElement('input');
      const inputDemandId = this.renderer.createElement('input');
      const inputEmpty = this.renderer.createElement('input');
      const btnAdd = this.renderer.createElement('img');
      const btnShelf = this.renderer.createElement('img');
      const shelfsDiv = this.renderer.createElement('div');

      this.renderer.setProperty(inputItem, "value", number);
      this.renderer.setProperty(inputDemandId, "value", demandOrderId);
      this.renderer.setProperty(btnAdd, "src", "assets/images/add.png")
      this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png")
      this.renderer.setProperty(inputShelf, "placeholder", "מדף")
      this.renderer.setProperty(inputQunatity, "placeholder", "כמות")
      this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש")
      this.renderer.setProperty(inputNewShelf, "name", "newShelfName")
      this.renderer.setProperty(inputDemandId, "name", "newDemandId")


      this.renderer.setStyle(btnAdd, 'width', '30px');
      this.renderer.setStyle(btnShelf, 'width', '30px');
      this.renderer.setStyle(shelfsDiv, "display", "inline-table")

        this.i = this.i + 1;
        this.renderer.setStyle(inputShelf, 'display', 'none');
        this.renderer.setStyle(inputQunatity, 'display', 'none');
        this.renderer.setStyle(inputNewShelf, 'display', 'none');
        this.renderer.setStyle(inputEmpty, 'display', 'none');
        this.renderer.setProperty(inputItem, "id", "id_" + this.i)
     
        let q = this.renderer;
      this.renderer.listen(inputItem, 'focusout', () => {
        this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result=>{
          console.log(result)
          if(result[0]!=""){
            q.setProperty(shelfsDiv, "innerText", result.toString())
            q.appendChild(rowDiv, shelfsDiv);
          }else {
            q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
            q.appendChild(rowDiv, shelfsDiv);
          }
        })
      });

      this.renderer.listen(btnAdd, 'click', () => {
        this.createInventoryRow("item", btnAdd, demandOrderId);
      });
      this.renderer.listen(btnShelf, 'click', () => {
        this.createInventoryRow("amount", btnShelf, demandOrderId)

      });



      this.renderer.appendChild(rowDiv, btnAdd);
      this.renderer.appendChild(rowDiv, inputItem);
      this.renderer.appendChild(rowDiv, inputShelf);
      this.renderer.appendChild(rowDiv, inputQunatity);
      this.renderer.appendChild(rowDiv, inputNewShelf);
      this.renderer.appendChild(rowDiv, inputEmpty); // for the array
      this.renderer.appendChild(rowDiv, btnShelf);
      this.renderer.appendChild(rowDiv, inputDemandId);
      this.renderer.setStyle(inputEmpty, 'display', 'none');

        this.renderer.appendChild(this.container.nativeElement, rowDiv);
      
    }
  


    createInventoryRow(type, a, demandOrderId) {
      let shelfsArr;
      if (type == "amount" && this.renderer.parentNode(a).getElementsByTagName("input")[0].value == "") {
        alert("נא להכניס מק``ט")
      } else {
        const rowDiv = this.renderer.createElement('div');
        const inputItem = this.renderer.createElement('input');
        const inputShelf = this.renderer.createElement('input');
        const inputQunatity = this.renderer.createElement('input');
        const inputNewShelf = this.renderer.createElement('input');
        const inputEmpty = this.renderer.createElement('input');
        const inputDemandId = this.renderer.createElement('input');
        const btnAdd = this.renderer.createElement('img');
        const btnShelf = this.renderer.createElement('img');
        const shelfsDiv = this.renderer.createElement('div');
  
        this.renderer.setProperty(inputDemandId, "value", demandOrderId);
        this.renderer.setProperty(btnAdd, "src", "assets/images/add.png")
        this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png")
        this.renderer.setProperty(inputShelf, "placeholder", "מדף")
        this.renderer.setProperty(inputQunatity, "placeholder", "כמות")
        this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש")
        this.renderer.setProperty(inputNewShelf, "name", "newShelfName")
        this.renderer.setProperty(inputDemandId, "name", "newDemandId")
  
  
        this.renderer.setStyle(btnAdd, 'width', '30px');
        this.renderer.setStyle(btnShelf, 'width', '30px');
        this.renderer.setStyle(shelfsDiv, "display", "inline-table")
        if (type == "item") {
          this.i = this.i + 1;
          this.renderer.setStyle(inputShelf, 'display', 'none');
          this.renderer.setStyle(inputQunatity, 'display', 'none');
          this.renderer.setStyle(inputNewShelf, 'display', 'none');
          this.renderer.setStyle(inputEmpty, 'display', 'none');
          this.renderer.setProperty(inputItem, "id", "id_" + this.i)
  
        }
        else if (type == "amount") {
          this.renderer.setProperty(btnShelf, "id", this.i)
          this.renderer.setStyle(btnShelf, 'display', 'none');
          this.renderer.setStyle(btnAdd, 'display', 'none');
          this.renderer.setStyle(shelfsDiv, 'display', 'none');
          this.renderer.setAttribute(inputItem, "class", "dataInput");
          this.renderer.setAttribute(inputShelf, "class", "dataInput");
          this.renderer.setAttribute(inputQunatity, "class", "dataInput");
          this.renderer.setAttribute(inputEmpty, "class", "dataInput");
          if (this.dir == "shellChange") {
            this.renderer.setAttribute(inputNewShelf, "class", "dataInput");
          } else {
            this.renderer.setAttribute(inputNewShelf, "class", "no");
            this.renderer.setStyle(inputNewShelf, 'display', 'none');
          }
          this.renderer.setStyle(inputItem, 'visibility', 'hidden');
          this.renderer.setProperty(inputItem, "value", this.renderer.parentNode(a).getElementsByTagName("input")[0].value)
          console.log(this.renderer.parentNode(a).getElementsByTagName("input")[0].value);
        }
        let q = this.renderer;
        this.renderer.listen(inputItem, 'focusout', () => {
          this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result=>{
            console.log(result)
            if(result[0]!=""){
              q.setProperty(shelfsDiv, "innerText", result.toString())
              q.appendChild(rowDiv, shelfsDiv);
            }else {
              q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
              q.appendChild(rowDiv, shelfsDiv);
            }
          })
        });
  
        this.renderer.listen(btnAdd, 'click', () => {
          this.createInventoryRow("item", btnAdd, demandOrderId);
        });
        this.renderer.listen(btnShelf, 'click', () => {
          this.createInventoryRow("amount", btnShelf, demandOrderId)
  
        });
  
  
  
        this.renderer.appendChild(rowDiv, btnAdd);
        this.renderer.appendChild(rowDiv, inputItem);
        this.renderer.appendChild(rowDiv, inputShelf);
        this.renderer.appendChild(rowDiv, inputQunatity);
        this.renderer.appendChild(rowDiv, inputNewShelf);
        this.renderer.appendChild(rowDiv, inputDemandId);
        this.renderer.appendChild(rowDiv, inputEmpty); // for the array
        this.renderer.appendChild(rowDiv, btnShelf);
        this.renderer.setStyle(inputEmpty, 'display', 'none');
        if (type == "amount") {
          this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
        } else {
          this.renderer.appendChild(this.container.nativeElement, rowDiv);
        }
      }
    }
}
