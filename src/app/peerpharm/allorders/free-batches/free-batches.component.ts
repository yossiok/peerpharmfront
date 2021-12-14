import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { FreeBatchesFile } from "./FreeBatch";

@Component({
    selector: "app-free-batches",
    templateUrl: "./free-batches.component.html",
    styleUrls: ["./free-batches.component.scss"],
})
export class FreeBatchesComponent implements OnInit {
    
    @Input() freeBatches: FreeBatchesFile
    @Input() orders: any[]
    @Output() closed: EventEmitter<any> = new EventEmitter<any>()
    orderItemsAndOrders: any[] = []
    loadingData: boolean = false

    constructor(
        private ordersService: OrdersService
    ) { }

    ngOnInit() {
        console.log(this.freeBatches)
    }

    getAllOpenOrderITems() {
        this.loadingData = true
        this.ordersService.getAllOpenOrderItems().subscribe(data => {
            let filtered = data.filter(i => i.orderItem.pakaStatus == 0 || !i.orderItem.pakaStatus)
            this.orderItemsAndOrders = filtered.map(oi => ({
                itemNumber: oi.orderItem.itemNumber,
                orderNumber: oi.orderNumber
            }))
            console.log('All Open order Iems: ', this.orderItemsAndOrders)
            for (let batch of this.freeBatches.batches) {
                for (let oiao of this.orderItemsAndOrders) {
                    if (oiao.itemNumber == batch.itemNumber && oiao.orderNumber == batch.orderNumber) {
                        batch.color = 'aquamarine'
                    }
                }
            }
            this.loadingData = false
        })
    }

    closeModal() {
        this.closed.emit()
    }


}