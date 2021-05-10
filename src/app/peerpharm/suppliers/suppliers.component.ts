import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { Procurementservice } from 'src/app/services/procurement.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

const defaultSupplier = {
  suplierNumber: '',
  suplierName: '',
  address: '',
  city: '',
  phoneNum: '',
  cellularNum: '',
  faxNum: '',
  lastUpdated: '',
  country: '',
  email: '',
  contactName: '',
  currency: '',
  remarks: '',
  alternativeSupplier: [],
  priceList: [],
  import: ''
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})



export class SuppliersComponent implements OnInit {
  @ViewChild('fromDateStr') fromDateStr: ElementRef;
  @ViewChild('toDateStr') toDateStr: ElementRef;
  itemNumber: any;
  @ViewChild('container') set content(content: ElementRef) {
    this.container = this.content;
  }
  
  countries: any = []
  closeResult: string;
  suppliersAlterArray: any[];
  suppliers: any[];
  itemPurchases: any[];
  suppliersCopy: any[];
  alternSupplier: any[];
  alterSupplierToPush: string;
  alterSupplierArray: any[] = [];
  tableType: string = "suppliers";
  suppliersOrderItems: any[];
  suppliersOrderItemsCopy: any[];
  hasMoreItemsToload: boolean = true;
  supplierModal: boolean = false;
  showItemPurchases: boolean = false;
  currentSupplier: any = defaultSupplier
  supItems: any[] = []
  supPurchases: any[] = []
  private container: ElementRef;
  showPurchaseItems: boolean;
  purchaseStockitems: any[] = []
  purchaseNumber: any;
  addEditText: string;
  counter: number = 0;
  updatingData: boolean = false;

  constructor(private inventoryService: InventoryService, private route: ActivatedRoute, private excelService: ExcelService, private procurementService: Procurementservice, private modalService: NgbModal, private supplierService: SuppliersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

  ngOnInit() {
    this.getSuppliers();
    this.getAlternativeSuppliers();
    // this.getSuppliersOrderedItems();
  }



  getAlternativeSuppliers() {
    this.supplierService.getAllAlternativeSuppliers().subscribe(res => {
      this.alternSupplier = res
      console.log(this.alternSupplier);
    });
  }

  getSuppliers() {
    let countries = []
    this.supplierService.getAllSuppliers().subscribe(res => {
      this.suppliers = res
      this.suppliersCopy = res
      var currentAlterSupp = [];
      this.suppliers.forEach(function (supplier) {
        currentAlterSupp.push(supplier.alternativeSupplier);
      });
      this.suppliersAlterArray = currentAlterSupp;
      this.countries = this.suppliers.map(supplier => {
        if(!countries.includes(supplier.country)) countries.push(supplier.country)
      }) 
      this.countries = countries
    });

  }

  getAllPurchasesFromSup() {
    this.procurementService.getAllOrdersFromSupplier(this.currentSupplier.suplierNumber).subscribe(data => {
      this.supPurchases = data.filter(purchase => purchase.status == 'open')
      for (let order of data) {
        for (let item of order.stockitems) {
          this.supItems.push({
            orderNumber: order.orderNumber,
            arrivalDate: order.arrivalDate,
            ...item
          })
        }
      }
    })
  }

  openItems(stockitems, orderNumber) {
    this.showPurchaseItems = true
    this.purchaseStockitems = [...stockitems]
    this.purchaseNumber = orderNumber
  }

  filterSuppliers(by, e) {
    this.suppliers = this.suppliersCopy.filter(supplier => supplier[by] && supplier[by].includes(e.target.value))
  }

  filterSuppliersByItem(itemNumber) {

  }

  filterSuppliersByOpenOrders() {

  }

  sortBy(array, by){
    if(by.includes('Date')) {
      this[array].map(element => {
        element.formatedDate = new Date(element[by])
        return element;
      })
      by = 'formatedDate'
    }
    if (this.counter % 2 == 0) this[array].sort((a, b) => (a[by]) - (b[by]))
    else this[array].sort((a, b) => (b[by]) - (a[by]))
    this.counter++
  }

  setType(type) {
    switch (type) {
      case 'suppliers':
        this.tableType = "suppliers"
        break;
      case 'supplierReports':
        this.tableType = "supplierReports"
        break;
    }
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }




  dateChange() {
    if (this.fromDateStr.nativeElement.value != "" && this.toDateStr.nativeElement.value != "") {
      this.procurementService.getProcurementOrderItemByDate(this.fromDateStr.nativeElement.value, this.toDateStr.nativeElement.value).subscribe(data => {
        this.suppliersOrderItems = data;
        this.suppliersOrderItemsCopy = data;
      })
    }
  }

  addAlterSupplier() {
    let alterSuppToPush = this.alterSupplierToPush
    this.alterSupplierArray.push(alterSuppToPush)
    this.toastSrv.success("Alternative supplier added")
  }

  openData(addEdit: string, index?) {
    this.currentSupplier = {...defaultSupplier}
    this.supItems = []
    this.supPurchases = []
    this.addEditText = addEdit
    if(index) {
      this.currentSupplier = this.suppliers[index]
      this.getAllPurchasesFromSup()
    }
    this.supplierModal = true
  }

  showAllPurchases(itemNumber) {
    this.itemNumber = itemNumber
    this.procurementService.getLastOrdersForItem(itemNumber, 10).subscribe(data => {
      if (data) {
        this.itemPurchases = data;
        this.showItemPurchases = true;
      }
    })
  }

  updateCurrSupplier() {
    this.updatingData = true;
    if(this.addEditText == 'Update Supplier') {
      this.supplierService.updateCurrSupplier(this.currentSupplier).subscribe(data => {
        this.updatingData = false;
        if (data) {
          this.toastSrv.success('ספק עודכן בהצלחה !');
          this.supplierModal = false;
          this.getSuppliers();
        }
      })
    }
    else if(this.addEditText == 'Add Supplier'){
      this.supplierService.addorUpdateSupplier(this.currentSupplier).subscribe(res => {
        this.updatingData = false;
        if(res.msg == 'Supplier Number Allready Exist') this.toastSrv.error(res.msg)
        else this.toastSrv.success(res.msg)
      })
    }
  }





  exportAsXLSX(data, fileName) {
    if(fileName == 'הזמנות פתוחות') {
      data.map(object => ({
        orderNumber: object.orderNumber,
        arrivalDate: object.arrivalDate,
        creationDate: object.creationDate,
        user: object.user
      }))
    }
    if (fileName == 'פריטים ספק') {
      data.forEach(object => {
        delete object.threatment
        delete object.color
        delete object.supplierAmount
        delete object.recommendationNumber
      })
    }
    this.excelService.exportAsExcelFile(data, fileName);
  }


}
