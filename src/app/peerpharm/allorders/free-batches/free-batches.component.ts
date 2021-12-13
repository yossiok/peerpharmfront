import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { FreeBatches } from "./FreeBatch";

@Component({
    selector: "app-free-batches",
    templateUrl: "./free-batches.component.html",
    styleUrls: ["./free-batches.component.scss"],
})
export class FreeBatchesComponent implements OnInit {

    @Input() freeBatches: FreeBatches[]
    @Input() orders: any[]
    @Output() closed: EventEmitter<any> = new EventEmitter<any>()

    constructor(
        private ordersService: OrdersService
    ) { }

    ngOnInit() {

    }

    getAllOpenOrderITems() {
        this.ordersService.getAllOpenOrderItems().subscribe(data => {
            let filtered = data.filter(i => i.orderItem.batch == "")
            console.log('All Open order Iems: ', filtered)
        })
    }

    closeModal() {
        this.closed.emit()
    }


}