import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-inventory-sticker',
    template: `
    <button [style.display]="'none'" printSectionId="print-section" #printbtn ngxPrint></button>
    <!--printed:-->
    <div dir="rtl" style="visibility: hidden;" id="print-section">
        <table *ngFor="let item of items" style="text-align: center;" class="barcodeTbl" dir="ltr" [style.margin.px]="3" [style.width.px]="400"
        [style.max-height.px]="400" [style.font-size.px]="24" [style.border.px]="0">
            <tr>
                <td>כמות סה"כ: {{item.amount}}</td>
            </tr>
            <tr>
                <td>מספר משטחים: {{numPallets}}</td>
            </tr>
            <tr>
                <td>מקבל: {{userName}}</td>
            </tr>
            <tr>
                <td><h1>פאר פארם בע"מ</h1></td>
            </tr>
            <tr>
                <td>תאריך: {{date}}</td>
            </tr>
            <tr>
                <td>מס' הזמנת רכש: {{item.purchaseOrder}}</td>
            </tr>
            <tr>
                <td>ספק: {{item.supplier}}</td>
            </tr>
            <tr>
                <td>מס' תעודת קליטה: {{item.certificateNum}}</td>
            </tr>
            <tr>
                <td>מק"ט: {{item.item}}</td>
            </tr>
            <tr>
                <td>תיאור: {{item.itemName}}</td>
            </tr>
            <tr>
                <td>
                    <ngx-barcode [bc-value]="item.item" [bc-display-value]="true"></ngx-barcode>
                </td>
            </tr>
        </table>
    </div>
        
    `,
    styles: ['.wfc { width:300px; cursor: pointer } .bordered { border: 1px solid black }']
})
export class InventoryStickerComponent implements OnInit {

    @ViewChild('printbtn') printbtn: ElementRef
    @Input() items: Array<any>
    @Input() numPallets: number
    @Input() certificateNum: number

    userName: string
    date: Date = new Date()

    constructor(private authService: AuthService) { }

    ngOnInit() {
        console.log('items: ', this.items)
        this.userName = this.authService.loggedInUser.userName
        setTimeout(() => {
            // debugger
            this.printbtn.nativeElement.click()
        }, 500)
    }

}