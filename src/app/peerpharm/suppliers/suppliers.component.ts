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
  addEditText: string;
  @ViewChild('container') set content(content: ElementRef) {
    this.container = this.content;
  }

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
    this.supplierService.getAllSuppliers().subscribe(res => {
      this.suppliers = res
      this.suppliersCopy = res
      var currentAlterSupp = [];
      this.suppliers.forEach(function (supplier) {
        currentAlterSupp.push(supplier.alternativeSupplier);
      });
      this.suppliersAlterArray = currentAlterSupp;
    });

  }

  // getSuppliersOrderedItems() {
  //   this.procurementService.getProcurementOrderItem().subscribe(res => {
  //     this.suppliersOrderItems = res
  //     this.suppliersOrderItemsCopy = res
  //     if(res.length == res.length) {
  //       this.hasMoreItemsToload == false;
  //     }
  //     console.log(this.suppliersOrderItems)
  //   });
  // }

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
      console.log(data)
      console.log('items: ', this.supItems)
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
    this.addEditText = addEdit
    if(index) {
      this.currentSupplier = this.suppliers[index]
      this.getAllPurchasesFromSup()
    }
    this.supplierModal = true
  }

  showAllPurchases(itemNumber) {
    this.procurementService.getAllItemPurchases(itemNumber).subscribe(data => {
      if (data) {
        this.itemPurchases = data;
        this.showItemPurchases = true;
      }
    })
  }

  updateCurrSupplier() {
    if(this.addEditText == 'Update Supplier') {
      this.supplierService.updateCurrSupplier(this.currentSupplier).subscribe(data => {
        if (data) {
          this.toastSrv.success('ספק עודכן בהצלחה !');
          this.supplierModal = false;
          this.getSuppliers();
        }
      })
    }
    else if(this.addEditText == 'Add Supplier'){
      this.supplierService.addorUpdateSupplier(this.currentSupplier).subscribe(res => {
        if(res.msg == 'Supplier Number Allready Exist') this.toastSrv.error(res.msg)
        else this.toastSrv.success(res.msg)
      })
    }
  }





  exportAsXLSX(data, fileName) {
    if (fileName == fileName) {
      data.forEach(object => {
        delete object.__v
        delete object._id
      })
    }
    this.excelService.exportAsExcelFile(data, fileName);
  }


}
