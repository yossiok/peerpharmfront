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
                <td><strong>כמות סה"כ:</strong> {{item.amount}}</td>
            </tr>
            <tr>
                <td><strong>מספר משטחים:</strong> {{numPallets}}</td>
            </tr>
            <tr>
                <td>{{userName}} <strong>:מקבל</strong></td>
            </tr>
            <tr>
                <td><h1>פאר פארם בע"מ</h1></td>
            </tr>
            <tr>
                <td>{{date | date: 'medium'}} <strong>:תאריך</strong></td>
            </tr>
            <tr>
                <td>{{item.purchaseOrder}} <strong>:מס' הזמנת רכש</strong></td>
            </tr>
            <tr>
                <td><strong>:ספק</strong><br>{{item.supplier}}</td>
            </tr>
            <tr>
                <td><strong>מס' תעודת קליטה:</strong> {{certificateNum}}</td>
            </tr>
            <tr>
                <td><strong>מק"ט:</strong> {{item.item}}</td>
            </tr>
            <tr>
                <td><strong>:תיאור</strong> <br> {{item.itemName}}</td>
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
            debugger
            this.printbtn.nativeElement.click()
        }, 500)
    }

}