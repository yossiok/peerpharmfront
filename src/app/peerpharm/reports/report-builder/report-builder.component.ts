import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise'

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.scss']
})
export class ReportBuilderComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'my-app';
  itemShellColumns = [
    { field: '_id', sortable: true, filter: true },
    { field: 'amount', sortable: true, filter: true },
    { field: 'item', sortable: true, filter: true },
    { field: 'shell_id_in_whareHouse', sortable: true, filter: true },
    { field: 'position', sortable: true, filter: true },
    { field: 'inventoryReqNum', sortable: true, filter: true },
    { field: 'arrivalDate', sortable: true, filter: true },
    { field: 'deliveryNoteNum', sortable: true, filter: true },
    { field: 'expirationDate', sortable: true, filter: true },
    { field: 'productionDate', sortable: true, filter: true },
    { field: 'batchNumber', sortable: true, filter: true },
    { field: 'supplierBatchNumber', sortable: true, filter: true },
    { field: 'itemType', sortable: true, filter: true },
    { field: 'warehouse', sortable: true, filter: true },
  ];

  columnDefs = [];

  rowData: any;

  itemSellData: any;
  ShellData: any;
  WhareHouseData: any;
  rowData4: any;

  isItemShell: boolean = false;
  formDetails2Columns: any[] = [
    { field: '_id', sortable: true, filter: true },
    { field: 'formHeaderId', sortable: true, filter: true },
    { field: 'itemN', sortable: true, filter: true },
    { field: 'itemName', sortable: true, filter: true },
    { field: 'fillingDate', sortable: true, filter: true },
    { field: 'status', sortable: true, filter: true },
    { field: 'costumerName', sortable: true, filter: true },
    { field: 'batchN', sortable: true, filter: true },
    { field: 'cartonUnitNumber', sortable: true, filter: true },
    { field: 'scheduleId', sortable: true, filter: true },
    { field: 'cleanFillMachineSignature', sortable: true, filter: true },
    { field: 'directorFrontSignature', sortable: true, filter: true },
    { field: 'visualIndentCheck', sortable: true, filter: true },
    { field: 'containeMatchAndClean', sortable: true, filter: true },
    { field: 'presentOfTheLabels', sortable: true, filter: true },
    { field: 'confSetupeClean', sortable: true, filter: true },
    { field: 'confrimOfCleaning', sortable: true, filter: true },
    { field: 'drumsAmount', sortable: true, filter: true },
    { field: 'endTimeWork', sortable: true, filter: true },
    { field: 'expirationDate', sortable: true, filter: true },
    { field: 'fillStartTime', sortable: true, filter: true },
    { field: 'dateN', sortable: true, filter: true },
    { field: 'filledBy', sortable: true, filter: true },
    { field: 'leftBatchNumber', sortable: true, filter: true },
    { field: 'grossWeight', sortable: true, filter: true },
    { field: 'personalPackage', sortable: true, filter: true },
    { field: 'quantity_Produced', sortable: true, filter: true },
    { field: 'itemHasLicense', sortable: true, filter: true },
    { field: 'productionLine', sortable: true, filter: true },
  ];




  orderColums: any = [
    { field: '_id', sortable: true, filter: true },
    { field: 'costumer', sortable: true, filter: true },
    { field: 'orderDate', sortable: true, filter: true },
    { field: 'costumerInternalId', sortable: true, filter: true },
    { field: 'deliveryDate', sortable: true, filter: true },
    { field: 'orderRemarks', sortable: true, filter: true },
    { field: 'customerOrderNum', sortable: true, filter: true },
    { field: 'type', sortable: true, filter: true },
    { field: 'status', sortable: true, filter: true },
    { field: 'stage', sortable: true, filter: true },
    { field: 'onHoldDate', sortable: true, filter: true },
    { field: 'user', sortable: true, filter: true },
    { field: 'orderNumber', sortable: true, filter: true },

  ];


  orderItemColumne:any[]=[
    { field: '_id', sortable: true, filter: true },
    { field: 'orderId', sortable: true, filter: true },
    { field: 'orderNumber', sortable: true, filter: true },
    { field: 'itemNumber', sortable: true, filter: true }, 
    { field: 'discription', sortable: true, filter: true },
    { field: 'unitMeasure', sortable: true, filter: true },
    { field: 'quantity', sortable: true, filter: true },
    { field: 'qtyKg', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    { field: 'totalPrice', sortable: true, filter: true },
    { field: 'itemRemarks', sortable: true, filter: true },
    { field: 'batch', sortable: true, filter: true },
    { field: 'quantityProduced', sortable: true, filter: true },
    { field: 'fillingStatus', sortable: true, filter: true },
    { field: 'netWeightGr', sortable: true, filter: true },  
  ]

  supplierColumns:any[]=[
    { field: '_id', sortable: true, filter: true },
    { field: 'suplierNumber', sortable: true, filter: true },
    { field: 'suplierName', sortable: true, filter: true },
    { field: 'city', sortable: true, filter: true }, 
    { field: 'address', sortable: true, filter: true },
    { field: 'phoneNum', sortable: true, filter: true },
    { field: 'cellularNum', sortable: true, filter: true },
    { field: 'faxNum', sortable: true, filter: true }, 
  ]
  

  itemColums:any[]=[
    { field: '_id', sortable: true, filter: true },
    { field: 'name', sortable: true, filter: true },
    { field: 'subName', sortable: true, filter: true },
    { field: 'discriptionK', sortable: true, filter: true },
    { field: 'impRemarks', sortable: true, filter: true },
    { field: 'updateDate', sortable: true, filter: true },
    { field: 'nameOfupdating', sortable: true, filter: true },
    { field: 'versionNumber', sortable: true, filter: true },
    { field: 'stickerNumber', sortable: true, filter: true },
    { field: 'stickerTypeK', sortable: true, filter: true },
    { field: 'itemNumber', sortable: true, filter: true }, 
    { field: 'boxNumber', sortable: true, filter: true },
    { field: 'boxTypeK', sortable: true, filter: true },
    { field: 'barcodeK', sortable: true, filter: true },
    { field: 'StickerLanguageK', sortable: true, filter: true },
    { field: 'volumeKey', sortable: true, filter: true },
    { field: 'netWeightK', sortable: true, filter: true },
    { field: 'grossUnitWeightK', sortable: true, filter: true },
    { field: 'licsensNumber', sortable: true, filter: true },
    { field: 'licsensDate', sortable: true, filter: true }, 
  ]


  


  constructor(private http: HttpClient) {

  }

  ngOnInit() {
  
  }



  downloadItemShell() {
    this.isItemShell = true;
    this.http.get('/itemShell').subscribe(data => {
      this.itemSellData = data;
      this.http.get('/Shell').subscribe(data => {
        this.ShellData = data;
        this.http.get('/WhareHouse').subscribe(data => {
          this.WhareHouseData = data;

          //comibne shellData to contain wherhose
          this.ShellData.map(s => {
            let wh = this.WhareHouseData.find(x => x._id == s.whareHouseId);
            if (wh)
              s.whName = wh.name;
            return s;
          })

          //comibne ItemshellData to contain shellData
          this.itemSellData.map(z => {
            let shell = this.ShellData.find(x => x._id == z.shell_id_in_whareHouse);
            z.warehouse = shell.whName;
            return z;
          });
          this.columnDefs = this.itemShellColumns;
          this.rowData = this.itemSellData;
        })
      })
    });
  }


  downloadQAForms() {
    this.isItemShell = false;
    this.columnDefs = this.formDetails2Columns;
    this.rowData = this.http.get('/formDetails');
  }
  downloadOrders() {
    this.isItemShell = false;
    this.columnDefs = this.orderColums;
    this.rowData = this.http.get('/Order');
  }

  downloadOrderItems() {
    this.isItemShell = false;
    this.columnDefs = this.orderItemColumne;
    this.rowData = this.http.get('/OrderItem');
  }

  downloadSupplier() {
    this.isItemShell = false;
    this.columnDefs = this.supplierColumns;
    this.rowData = this.http.get('/Supplier');
  }

  downloadItems() {
    this.isItemShell = false;
    this.columnDefs = this.itemColums;
    this.rowData = this.http.get('/item');
  }
  
 


  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => {
      if (node.groupData) {
        return { make: node.key, model: 'Group' };
      }
      return node.data;
    });
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

}
