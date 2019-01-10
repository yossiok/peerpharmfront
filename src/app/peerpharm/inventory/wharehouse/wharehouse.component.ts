import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from './../../../services/users.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Integer } from 'aws-sdk/clients/pi';
import { ToastrService } from 'ngx-toastr';
import { UpperCasePipe } from '@angular/common';
import { UserInfo } from '../../taskboard/models/UserInfo';

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
  curentWhareHouseName: string = ""  //wharehouse id to show
  changeWh: boolean = false;
  shelfs: any = [];
  shelfsCopy: any = [];
  dir: string = "production";
  screen: String = "stkManagment";
  response = { color: '', body: '' }
  i: Integer = 0;
  currTab: string = '';
  constructor(private renderer: Renderer2, private authService: AuthService, private inventoryService: InventoryService, private toasterSer: ToastrService, ) { }

  ngOnInit() {
    this.inventoryService.getWhareHousesList().subscribe(res => {
      let displayAllowedWH = [];
        for (const wh of res) {
          if (this.authService.loggedInUser.allowedWH.includes(wh._id)) {
            displayAllowedWH.push(wh);
          }
        }
        this.whareHouses = displayAllowedWH;
        this.curentWhareHouseId = displayAllowedWH[0]._id;
        this.curentWhareHouseName = displayAllowedWH[0].name;
      console.log(res);
    })
  }


  dirSet(action, direction) {
    this.screen = action;
    if (action == 'whManagment') {

      this.dir = 'managment';
      const childElements = this.container.nativeElement.children;
        for (let child of childElements) {
        const elemnts = child.children;
        for (let elm of elemnts) {
          const mnts = elm.children;
          for (let e of mnts) {
            console.log(e.getAttribute("name"))
            if (e.getAttribute("name")) {
              if (direction == "shellChange" && e.getAttribute("name") == "newShelfName") {
                e.style.display = 'inline';
                e.className = "dataInput";
              }
              else if (direction == "production" && e.getAttribute("name") == "newDemandId") {
                e.style.display = 'inline';
                e.className = "dataInput";
                // e.style.visibility = "hidden";
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
    } else if (action == 'stkManagment') {
      this.dir = direction;
    }

  }

  getFormData() {
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    //  for (let innerDiv of div.getElementsByTagName('input')) {
    for (let innerDiv of div.getElementsByClassName('dataInput')) {

      console.log(innerDiv.value);
      if (innerDiv.value.length > 0) {
       debugger;
        divArr.push(innerDiv.value);
      }
      else {
        //temp fix
        if(this.dir!="production"){
          divArr.splice(0,1);
        }
        let itemData = {
          item: divArr[0],
          shell: divArr[1],
          amount: divArr[2],
          newShelf: "",
          demandOrderId: "",
          actionType: this.dir,
          whareHouse: this.curentWhareHouseId,
        }
        
        if (this.dir == "shellChange") { // if it's for shellChange
          //   Object.assign({newShelf:divArr[3]}, itemData);
          itemData.newShelf = divArr[3];
        }
        if (this.dir == "production") { // if it's for production - add demandOrderId for server update
          // Object.assign({demandOrderId:divArr[3]}, itemData);
          itemData.demandOrderId = divArr[3];
          debugger
        }
        this.mainDivArr.push(itemData);
            divArr = [];
      }
    }
    console.log(this.mainDivArr);
    debugger;
    this.inventoryService.updateInventoryChanges(this.mainDivArr).subscribe(res => {
      debugger
      console.log("updateInventoryChanges res: "+res);
        if (res != null) {
          
      }else{
        ;
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
    position = position.toUpperCase();
    position = position.replace(/\s/g, '');
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
    shelf = shelf.toUpperCase();
    console.log(shelf)
    if (shelf == "") {
      this.shelfs = this.shelfsCopy.slice();
    }
    else {
      this.shelfs = this.shelfs.filter(x => x.position.toLowerCase().includes(shelf.toLowerCase()));
    }
  }


  getItemWhShelfsList(itemNumber, shelfsDiv) {
    let a = this.inventoryService;
    let b = this.curentWhareHouseId;
    return new Promise(function (resolve, reject) {
      a.getShelfListForItemInWhareHouse(itemNumber, b).subscribe(res => {
        if (res.length > 0) {
          console.log(res)
          resolve(res);
        } else resolve([])
      });
    });
  }

  async getChildArr(event) {
    await this.dirSet('stkManagment', 'production');
    
    console.log(event)
    if (event.length > 0) {
      this.dir = "production";
    }
    alert(event);
    event.forEach(item => {
      this.appendItems(item.number, item.orderDemandId)
    });
  }

// ***************************************************************************************
  appendItems(number, demandOrderId) {
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
    const btnRemove = this.renderer.createElement('img');
    const shelfsDiv = this.renderer.createElement('div');

    this.renderer.setProperty(inputItem, "value", number);
    this.renderer.setProperty(inputDemandId, "value", demandOrderId);
    this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
    this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
    this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
    this.renderer.setProperty(inputShelf, "placeholder", "מדף");
    this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
    this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
    this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
    this.renderer.setProperty(inputDemandId, "name", "newDemandId");
    this.renderer.setAttribute(inputDemandId, "disabled", "true");

    // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
    this.renderer.setStyle(btnAdd, 'width', '30px');
    this.renderer.setStyle(btnShelf, 'width', '30px');
    this.renderer.setStyle(btnRemove, 'width', '30px');
    this.renderer.setStyle(shelfsDiv, "display", "inline-table")

    this.i = this.i + 1;
    this.renderer.setStyle(inputShelf, 'display', 'none');
    this.renderer.setStyle(inputQunatity, 'display', 'none');
    this.renderer.setStyle(inputNewShelf, 'display', 'none');
   // this.renderer.setStyle(inputEmpty, 'display', 'none');
    this.renderer.setProperty(inputItem, "id", "id_" + this.i)

    let q = this.renderer;
    this.renderer.listen(inputItem, 'focusout', () => {
      this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result => {
        console.log(result)
        if (result[0] != "") {
          debugger
          q.setProperty(shelfsDiv, "innerText", result.toString())
          q.appendChild(rowDiv, shelfsDiv);
        } else {
          q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
          q.appendChild(rowDiv, shelfsDiv);
        }
      })
    });

    this.renderer.listen(btnAdd, 'click', () => {
      this.createInventoryRow("item", btnAdd, demandOrderId);
    });
    this.renderer.listen(btnRemove, 'click', () => {
      this.deleteInventoryRow("item", btnRemove, rowDiv);
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
    this.renderer.appendChild(rowDiv, btnRemove);


    this.renderer.appendChild(this.container.nativeElement, rowDiv);
  }
// ***************************************************************************************


// ***************************************************************************************
  //pressing the add item icon
  createInventoryRow(type, a, demandOrderId) {
    // let shelfsArr;
    //checking if there is an item number
    if (type == "amount" && this.renderer.parentNode(a).getElementsByTagName("input")[0].value == "") {
      alert("נא להכניס מק``ט")
    } else {
        //creating elements to variables
      const rowDiv = this.renderer.createElement('div');
      const inputItem = this.renderer.createElement('input');
      const inputShelf = this.renderer.createElement('input');
      const inputQunatity = this.renderer.createElement('input');
      const inputNewShelf = this.renderer.createElement('input');
      const inputEmpty = this.renderer.createElement('input');
      const inputDemandId = this.renderer.createElement('input');
      const btnAdd = this.renderer.createElement('img');
      const btnShelf = this.renderer.createElement('img');
      const btnRemove = this.renderer.createElement('img');
      const shelfsDiv = this.renderer.createElement('div');
      //stting attributes to rendered elements
      this.renderer.setProperty(inputDemandId, "value", demandOrderId);
      this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
      this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
      this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
      this.renderer.setProperty(inputItem, "placeholder", 'מק"ט פריט');
      this.renderer.setProperty(inputShelf, "placeholder", "מדף");
      this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
      this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
      this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
      this.renderer.setProperty(inputDemandId,"name", "newDemandId");
      this.renderer.setAttribute(inputDemandId, "class", "dataInput");
      this.renderer.setAttribute(inputDemandId, "disabled", "true");


      //setting style to rendered elements
      // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
      this.renderer.setStyle(btnAdd, 'width', '30px');
      this.renderer.setStyle(btnShelf, 'width', '30px');
      this.renderer.setStyle(btnRemove, 'width', '30px');
      this.renderer.setStyle(shelfsDiv, "display", "inline-table");

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
        this.getItemWhShelfsList(inputItem.value, shelfsDiv).then(result => {
          console.log(result)
          if (result[0] != "") {
            debugger
            q.setProperty(shelfsDiv, "innerText", result.toString())
            q.appendChild(rowDiv, shelfsDiv);
          } else {
            q.setProperty(shelfsDiv, "innerText", "לא נמצאו מדפים - N/A")
            q.appendChild(rowDiv, shelfsDiv);
          }
        })
      });

      this.renderer.listen(btnAdd, 'click', () => {
        this.createInventoryRow("item", btnAdd, demandOrderId);
      });
      this.renderer.listen(btnRemove, 'click', () => {
        this.deleteInventoryRow("item", btnRemove, rowDiv);
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
      this.renderer.appendChild(rowDiv, btnRemove);

      if (type == "amount") {
        this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
      } else {
                //creating elements to variables
          const rowDiv = this.renderer.createElement('div');
          const inputItem = this.renderer.createElement('input');
          const inputShelf = this.renderer.createElement('input');
          const inputQunatity = this.renderer.createElement('input');
          const inputNewShelf = this.renderer.createElement('input');
          const inputEmpty = this.renderer.createElement('input');
          const inputDemandId = this.renderer.createElement('input');
          const btnAdd = this.renderer.createElement('img');
          const btnShelf = this.renderer.createElement('img');
          const btnRemove = this.renderer.createElement('img');
          const shelfsDiv = this.renderer.createElement('div');
          //stting attributes to rendered elements
          this.renderer.setProperty(inputDemandId, "value", demandOrderId);
          this.renderer.setProperty(btnAdd, "src", "assets/images/add.png");
          this.renderer.setProperty(btnShelf, "src", "assets/images/addShell.png");
          this.renderer.setProperty(btnRemove, "src", "assets/images/delete.png");
          this.renderer.setProperty(inputItem, "placeholder", 'מק"ט פריט');
          this.renderer.setProperty(inputShelf, "placeholder", "מדף");
          this.renderer.setProperty(inputQunatity, "placeholder", "כמות");
          this.renderer.setProperty(inputNewShelf, "placeholder", "מדף חדש");
          this.renderer.setProperty(inputNewShelf, "name", "newShelfName");
          this.renderer.setProperty(inputDemandId, "name", "newDemandId");
          this.renderer.setAttribute(inputDemandId, "class", "dataInput");
          this.renderer.setAttribute(inputDemandId, "disabled", "true");

          //setting style to rendered elements
          // this.renderer.setStyle(inputDemandId, 'visibility', 'hidden');
          this.renderer.setStyle(btnAdd, 'width', '30px');
          this.renderer.setStyle(btnShelf, 'width', '30px');
          this.renderer.setStyle(btnRemove, 'width', '30px');
          this.renderer.setStyle(shelfsDiv, "display", "inline-table");

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
                debugger
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
          this.renderer.listen(btnRemove, 'click', () => {
            this.deleteInventoryRow("item", btnRemove, rowDiv);
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
          this.renderer.appendChild(rowDiv, btnRemove);

          if (type == "amount") {
            this.renderer.appendChild(this.renderer.parentNode(a), rowDiv);
          } else {
            this.renderer.appendChild(this.container.nativeElement, rowDiv);
          }
      }
    }
  }
// ***************************************************************************************


    deleteInventoryRow(type, a, rowDiv){
      this.renderer.removeChild(this.renderer.parentNode(a), rowDiv);

  }



}
