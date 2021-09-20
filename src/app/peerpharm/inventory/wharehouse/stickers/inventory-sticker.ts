import { Component, ElementRef, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-inventory-sticker',
    templateUrl: './inventory-sticker.html',
    styles: ['.wfc { width:300px; cursor: pointer } .bordered { border: 1px solid black }']
})
export class InventoryStickerComponent implements OnInit {

    // @ViewChild('printbtn') printbtn: ElementRef
    // @Output() barcodeGenerated: EventEmitter<any> = new EventEmitter<any>()
    @Input() certificateNum: number
    @Input() purchaseOrder: number
    @Input() supplier: number
    @Input() item: number
    @Input() itemName: number
    @Input() amount: number
    @Input() numPallets: number
    @Input() amountPerPallet: number
    @Input() certifNumber: number
    userName: string
    date: Date = new Date()
    iterableDiffer: any;

    constructor(private authService: AuthService, private iterableDiffers: IterableDiffers) {
        this.iterableDiffer = iterableDiffers.find([]).create(null);
    }

    ngOnInit() {
        this.userName = this.authService.loggedInUser.userName
        setTimeout(() => {

            // this.printbtn.nativeElement.click()
            // setTimeout(() => this.barcodeGenerated.emit(), 1000)
        }, 500)
    }

    ngDoCheck() {
        // let changes = this.iterableDiffer.diff(this.items);
    }




}