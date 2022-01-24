import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ExcelService } from "src/app/services/excel.service";
import { OrdersService } from "src/app/services/orders.service";

@Component({
    selector: "app-problematic-order-items",
    templateUrl: "./problematic-order-items.component.html",
    styleUrls: ["./problematic-order-items.component.scss"],
})
export class ProblematicOrderItemsComponent implements OnInit {

    @Input() problematicorderItems: any[]
    @Output() closed: EventEmitter<any> = new EventEmitter<any>()
    loadingData: boolean = false

    constructor(
        private ordersService: OrdersService,
        private excelService: ExcelService,
    ) { }

    ngOnInit() {
        debugger
        console.log(this.problematicorderItems)
        let excel = []
        for (let oi of this.problematicorderItems) {
            if (oi.orderItem.problematicMaterials) {
                for (let material of oi.orderItem.problematicMaterials) {
                    excel.push({
                        "הזמנה": oi.orderNumber,
                        "פריט": oi.orderItem.itemNumber,
                        'חו"ג': material.componentN,
                        'שם חו"ג': material.componentName
                    })
                }
            }
            if (oi.orderItem.problematicComponents) {
                for (let component of oi.orderItem.problematicComponents) {
                    excel.push({
                        "הזמנה": oi.orderNumber,
                        "פריט": oi.orderItem.itemNumber,
                        'קומפוננט': component.componentN,
                        'שם קומפוננט': component.componentName
                    })
                }
            }
        }
        this.excelService.exportAsExcelFile(excel, `דו"ח הזמנות עם פריטים בעייתיים ${new Date().toString().slice(0,10)}`)
    }


    closeModal() {
        this.closed.emit()
    }


}