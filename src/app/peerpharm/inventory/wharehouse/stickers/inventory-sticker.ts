import { Component, ElementRef, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
    selector: 'app-inventory-sticker',
    templateUrl: './inventory-sticker.html',
    styles: ['.print-btn { visibility: hidden }']
})
export class InventoryStickerComponent implements OnInit {

    @ViewChild('printBtn3') printBtn3: ElementRef
    @Input() itemDetails
    amount
    itemNumber
    itemName
    purchaseOrder
    supplier
    supplierName: any;
    numPallets: number
    amountPerPallet: number
    certifNumber: number
    userName: string
    date: Date = new Date()
    // iterableDiffer: any;

    constructor(
        private authService: AuthService,
        // private iterableDiffers: IterableDiffers,
        private warehouseService: WarehouseService,
        private inventoryService: InventoryService,
        private supplierService: SuppliersService
    ) {
        // this.iterableDiffer = iterableDiffers.find([]).create(null);
    }

    ngOnInit() {
        this.amount = this.itemDetails.amount
        this.purchaseOrder = this.itemDetails.purchaseOrder
        this.supplier = this.itemDetails.supplier
        this.supplierService.getSuppliersByNumber(this.supplier).subscribe(data => {
            this.supplierName = data[0].suplierName
        })
        this.inventoryService.getCmptByNumber(this.itemDetails.item, 'component').subscribe(data => {
            this.itemName = data[0].componentName
        })
        this.inventoryService.getLastWHReception().subscribe(data => {
            this.certifNumber = data.warehouseReception
        })
        this.userName = this.authService.loggedInUser.userName
    }

    doStupidStuff() {
        this.itemNumber = this.itemDetails.item
        setTimeout(() => this.printBtn3.nativeElement.click(), 500)
    }

    ngDoCheck() {
        // let changes = this.iterableDiffer.diff(this.items);
    }




}