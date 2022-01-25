import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ExcelService } from "src/app/services/excel.service";
import { OrdersService } from "src/app/services/orders.service";

@Component({
    selector: "app-problematic-items",
    templateUrl: "./problematic-items.component.html",
})
export class ProblematicItemsComponent implements OnInit {

    @Input() problematicItems: any[]
    @Input() type: string
    @Output() closed: EventEmitter<any> = new EventEmitter<any>()

    showProblematicOrdersIndex: number = -1
    loadingData: boolean = false

    constructor(
        private ordersService: OrdersService,
        private excelService: ExcelService,
    ) { }

    ngOnInit() {
        debugger
        console.log(this.problematicItems)
        let excel = []
        for (let c of this.problematicItems) {
            for(let o of c.orders) {
                excel.push({
                    "פריט": c.componentN,
                    "שם": c.componentName,
                    "סוג": c.itemType,
                    "הזמנה": o.order,
                    "מוצר": o.item
                })

            }
            // if (oi.orderItem.problematicMaterials) {
            //     for (let material of oi.orderItem.problematicMaterials) {
            //         excel.push({
            //             "הזמנה": oi.orderNumber,
            //             "פריט": oi.orderItem.itemNumber,
            //             'חו"ג': material.componentN,
            //             'שם חו"ג': material.componentName
            //         })
            //     }
            // }
            // if (oi.orderItem.problematicComponents) {
            //     for (let component of oi.orderItem.problematicComponents) {
            //         excel.push({
            //             "הזמנה": oi.orderNumber,
            //             "פריט": oi.orderItem.itemNumber,
            //             'קומפוננט': component.componentN,
            //             'שם קומפוננט': component.componentName
            //         })
            //     }
            // }
        }
        this.excelService.exportAsExcelFile(excel, `דו"ח פריטים בעייתיים בהזמנות לקוח ${new Date().toString().slice(0,10)}`)
    }

    showProblematicOrders(i) {
        if (this.showProblematicOrdersIndex == -1) this.showProblematicOrdersIndex = i
        else this.showProblematicOrdersIndex = -1
    }


    closeModal() {
        this.closed.emit()
    }


}