import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/services/excel.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { Procurementservice } from 'src/app/services/procurement.service';

@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss']
})
export class InventoryReportsComponent implements OnInit {

  loader: boolean = false
  cmptTypes: Array<any>
  purchaseOrders: Array<any>

  reportForm = new FormGroup({
    cmptType: new FormControl(''),
    itemType: new FormControl('all', Validators.required)
  })

  constructor(
    private inventorySer: InventoryService,
    private excelService: ExcelService,
    private purchaseService: Procurementservice
  ) {
  }

  ngOnInit(): void {
    this.getTypes()
  }

  getTypes() {
    this.inventorySer.getAllComponentTypes().subscribe(allTypes => {
      this.cmptTypes = allTypes
    })
  }

  getInvRep() {
    this.loader = true
    this.inventorySer.getInvRep(this.reportForm.value).subscribe(data => {
      this.loader = false
      if (this.reportForm.value.itemType == 'product') {
        data.map(item => {
          item.name ? item.name = `${item.name[0]} ${item.subName[0]} ${item.description[0]}` : null
          delete item.subName
          delete item.description
        })
      }
      else {
        data.map(item => {
          delete item.shell_id_in_whareHouse
          delete item.deliveryNoteNum
          delete item._id
          delete item.whareHouseID
          if (this.reportForm.value.itemType != 'material') {
            delete item.expirationDate
            delete item.productionDate
          }

          // get purchase details for components and materials
          if (this.reportForm.value.itemType != 'product') {
            item.name = item.stockitem[0].componentName
            item.openOrders = ''
            item.orderedAmount = 0
            for (let order of item.purchases) {
              if (order.status != 'closed' && order.status != 'canceled') {
                item.openOrders += ',' + order.orderNumber // purchase order numbers
                let i = order.stockitems.findIndex(i => i.name == item.name)
                item.orderedAmount += Number(order.stockitems[i].quantity) // purchase amounts
              }
            }
          }
          delete item.batchNumber
          delete item.supplierBatchNumber
          if (this.reportForm.value.itemType != 'all') delete item.itemType
          delete item.__v
          delete item.barcode
          delete item.userName
          delete item.shell_id_in_whareHouse
          return item
        })
      }
      // item.subName ? item.subName = item.subName[0] : null
      // item.description ? item.description = item.description[0] : null
      let sortOrder = ['item', 'name', 'position', 'whareHouse', 'amount', 'orderedAmount', 'openOrders']
      this.excelService.exportAsExcelFile(data, 'Inventory Report', sortOrder)
    })
  }

}
