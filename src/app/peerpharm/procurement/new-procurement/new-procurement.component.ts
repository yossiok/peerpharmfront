import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-procurement',
  templateUrl: './new-procurement.component.html',
  styleUrls: ['./new-procurement.component.css']
})
export class NewProcurementComponent implements OnInit {


  openOrdersModal: boolean = false;
  newProcurementForm: any;
  procurementSupplier: boolean = true;
  procurementItems: boolean = false;
  allSuppliers: any[];
  hasAuthorization: boolean = false;
  existOpenOrderAlert: boolean = false;
  allMaterials: any[];
  itemExistInOrders: any[];
  allComponents: any[];

  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('coin') coin: ElementRef;
  @ViewChild('measurement') measurement: ElementRef;
  @ViewChild('supplierPrice') supplierPrice: ElementRef;
  @ViewChild('supplierAmount') supplierAmount: ElementRef;
  @ViewChild('itemRemarks') itemRemarks: ElementRef;

  newItem = {

    itemNumber: '',
    itemName: '',
    coin: '',
    measurement: '',
    supplierPrice: 0,
    supplierAmount: '',
    color: '',
    orderNumber: '',
    itemRemarks: '',
    itemPrice: '',
    componentNs:'',
    componentType:''

  }
  newProcurement = {
    supplierNumber: '',
    supplierName: '',
    outDate: this.formatDate(new Date()),
    validDate: '',
    item: [],
    outOfCountry: false,
    orderType: '',
    remarks: '',
    comaxNumber: '',
    recommendRemarks: '',

  }

  constructor(private toastr: ToastrService, private procurementService: Procurementservice, private authService: AuthService, private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder, ) {

  }

  ngOnInit() {
    this.getAllSuppliers();
    this.getAllMaterials();
    this.getAllComponents();


  }

  // checkIfExist(){
  //   var comaxNumber = this.newProcurement.comaxNumber;

  //   this.procurementService.findIfComaxExist(comaxNumber).subscribe(data=>{
  //     if(data.length > 0){
  //       this.toastr.error('מספר הזמנת קומקס כבר קיים במערכת')
  //     } else {

  //     }
  //   })
  // }




  moveToProcItems() {

    if (this.newProcurementForm.value.orderNumber != "") {
      this.procurementSupplier = false;
      this.procurementItems = true;
    }
  }

  findMaterialByNumber() {
    debugger
    if (this.newItem.itemNumber != '') {

      if (this.newProcurement.orderType == 'material') {
        this.inventoryService.getMaterialStockItemByNum(this.newItem.itemNumber).subscribe(data => {
          debugger;
          if (data[0]) {
            this.newItem.itemName = data[0].componentName;
            this.newItem.coin = data[0].coin
            this.newItem.measurement = data[0].unitOfMeasure
            this.newItem.componentNs = data[0].componentNs
            var supplier = data[0].alternativeSuppliers.find(s=>s.supplierName == this.newProcurement.supplierName);
            this.newItem.supplierPrice = parseFloat(supplier.price)
            if (data[0].frameQuantity || data[0].frameSupplier) {
              alert('שים לב , פריט זה נמצא במסגרת אצל ספק:' + "  " + data[0].frameSupplier + " " + 'כמות:' + " " + data[0].frameQuantity)
            }

          } else {
            this.toastr.error('פריט לא קיים במערכת')
          }

        })
      } else {
        this.inventoryService.getCmptByitemNumber(this.newItem.itemNumber).subscribe(data => {
          debugger;
          this.newItem.itemName = data[0].comaxName;
          if (this.newItem.supplierPrice == 0 || isNaN(this.newItem.supplierPrice)) {
            this.newItem.supplierPrice = Number(data[0].price)
          }
          // this.newItem.coin = data[0].coin
          this.newItem.componentType = data[0].componentType
          this.newItem.measurement = data[0].unitOfMeasure
          $("#setCoin").val("data[0].coin");
        })
      }

      this.procurementService.getPurchaseOrderByItem(this.newItem.itemNumber).subscribe(data => {
        debugger;

        for (let i = 0; i < data.length; i++) {
          if (data[i].status == 'supplierGotOrder' || data[i].status == 'sentToSupplier') {
            data[i].status = 'open'
          }
          if (data[i].supplierName == this.newProcurement.supplierName && data[i].status == 'open') {
            this.existOpenOrderAlert = true;
          }

        }
        this.itemExistInOrders = data;

        if (data.length > 0) {
          this.openOrdersModal = true;
          if (this.newItem.supplierPrice == 0 || isNaN(this.newItem.supplierPrice)) {
            this.newItem.supplierPrice = Number(data[0].price)
          }
        }
       

      })

    } else {
      this.itemExistInOrders = [];
      this.openOrdersModal = false;
    }


  }

  getAllMaterials() {
    this.inventoryService.getAllMaterialsForFormules().subscribe(data => {
      this.allMaterials = data;
    })
  }

  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(data => {
      this.allComponents = data;
    })
  }
  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe(data => {
      this.allSuppliers = data;
    })
  }

  findSupplierByNumber(ev) {

    let supplier = ev.target.value;
    let result = this.allSuppliers.filter(x => supplier == x.suplierName)

    this.newProcurement.supplierNumber = result[0].suplierNumber

  }


  addItemToProcurement() {
    debugger;
    var newItem = {
      coin: this.coin.nativeElement.value,
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      measurement: this.measurement.nativeElement.value,
      supplierAmount: this.supplierAmount.nativeElement.value,
      supplierPrice: this.supplierPrice.nativeElement.value,
      itemPrice: Number(this.supplierPrice.nativeElement.value) * Number(this.supplierAmount.nativeElement.value),
      itemRemarks: this.itemRemarks.nativeElement.value,
      componentNs:this.newItem.componentNs,
      componentType:this.newItem.componentType
    }

    if(newItem.itemName){
      newItem.itemName.trim()
    }
    if(newItem.itemNumber){
      newItem.itemNumber.trim()
    }
    if(newItem.componentNs){
      newItem.componentNs.trim()
    }



    if (this.itemName.nativeElement.value == "" || this.itemNumber.nativeElement.value == "" || this.measurement.nativeElement.value == "" || this.supplierAmount.nativeElement.value == "") {
      this.toastr.error('שים לב , לא כל הפרטים מלאים.')
    } else {
      if (this.newProcurement.orderType == 'material') {
        var material = this.allMaterials.find(m => m.componentN == newItem.itemNumber);
        debugger;
        if (material.permissionDangerMaterials == true || material.permissionDangerMaterials == 'true') {
          if (confirm('שים לב , לחומר גלם זה מסומן היתר רעלים והכמות המותרת לאחסון הינה' + ' ' + material.allowQtyInStock)) {
            this.newProcurement.item.push(newItem);

            this.newItem.coin = "";
            this.newItem.itemName = "";
            this.newItem.itemNumber = "";
            this.newItem.measurement = "";
            this.newItem.supplierAmount = "";
            this.newItem.supplierPrice = 0;
            this.itemExistInOrders = [];
            this.openOrdersModal = false;
            this.toastr.success("פריט התווסף בהצלחה!")
         
          }
        } else {
          this.newProcurement.item.push(newItem);

          this.newItem.coin = "";
          this.newItem.itemName = "";
          this.newItem.itemNumber = "";
          this.newItem.measurement = "";
          this.newItem.supplierAmount = "";
          this.newItem.supplierPrice = 0;
          this.itemExistInOrders = [];
          this.openOrdersModal = false;
          this.toastr.success("פריט התווסף בהצלחה!")
       
        }
      } else {
        this.newProcurement.item.push(newItem);

        this.newItem.coin = "";
        this.newItem.itemName = "";
        this.newItem.itemNumber = "";
        this.newItem.measurement = "";
        this.newItem.supplierAmount = "";
        this.newItem.supplierPrice = 0;
        this.itemExistInOrders = [];
        this.openOrdersModal = false;
        this.toastr.success("פריט התווסף בהצלחה!")
        
      }




    }
  }

  fillMaterialNumber(ev) {
    debugger;
    var materialName = ev.target.value;

    var material = this.allMaterials.find(material => material.componentName == materialName)

    this.newItem.itemNumber = material.componentN;
    this.findMaterialByNumber();

  }

  sendNewProc() {

    debugger;
    if (confirm("האם להקים הזמנה זו ?")) {
      this.procurementService.addNewProcurement(this.newProcurement).subscribe(data => {
        if (data) {
          this.toastr.success("הזמנה מספר" + data.orderNumber + "נשמרה בהצלחה!")
          this.procurementService.removeFromFrameQuantity(data.item[0]).subscribe(data => {
            if (data) {
              this.toastr.success("כמות זו ירדה מכמות המסגרת")
            }

          })
          this.newProcurement.validDate = ""

          this.newProcurement.supplierName = ""
          this.newProcurement.supplierNumber = ""
          this.newProcurement.item = [];
          this.newProcurement.comaxNumber = ''


        }
      })
    }

  }

  addToSupplierPriceList() {
    debugger;
    if (confirm('האם להוסיף למחירון ספק ?')) {
      var obj = {
        itemName: this.newItem.itemName,
        itemNumber: this.newItem.itemNumber,
        supplierPrice: this.newItem.supplierPrice,
        supplierNumber: this.newProcurement.supplierNumber
      }

      this.supplierService.addToSupplierPriceList(obj).subscribe(data => {
        if (data) {
          this.toastr.success('הוסף למחירון ספק בהצלחה !')
        }
      })
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

}