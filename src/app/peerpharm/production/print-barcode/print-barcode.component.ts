import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BatchesService } from 'src/app/services/batches.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    template: `
        <div class="form-group">
        <label>Enter Item Number</label> <br>
        <input [(ngModel)]="itemNumber" type="number">
        </div>
        <div class="form-group"> 
        <label>Enter Batch</label> <br>
        <input [(ngModel)]="batch" type="text">
        </div>
        <div class="form-group">
            <label>Enter Customer Name</label> <br>
            <input [(ngModel)]="customerName" type="text">
            <button (click)="findMyCostumer()">Complete Me</button>
            <div *ngIf="customerNames.length > 0" class="list-group">
                <a *ngFor="let name of customerNames"  class="list-group-item list-group-item-action wfc" (click)="this.customerName=name; this.customerNames = []">
                    {{name}}
                </a>
            </div>
        </div>
        <button class="btn btn-default" (click)="printBarcodeForItem()">Print Barcode</button>
        <button [style.display]="'none'" printSectionId="print-section" #printbtn ngxPrint class="btn btn-default"></button>

        <!--printed:-->
        <div style="visibility: hidden;" id="print-section">
            <table style="text-align: center;" class="barcodeTbl" dir="ltr" [style.margin.px]="3" [style.width.px]="400"
            [style.max-height.px]="400" [style.font-size.px]="24" [style.border.px]="0">

                <tr>
                    <td>{{itemName}}</td>
                </tr>
                <tr>
                    <td>Item Number: {{itemNumber}}</td>
                </tr>
                <tr>
                    <td>{{volumeK}} {{pcsCarton}}</td>
                </tr>
                <tr>
                    <td>{{batch}} <label >Exp: {{expireDate}}</label></td>
                </tr>
                <tr>
                    <td><ngx-barcode [bc-value]="barcodeK" [bc-display-value]="true"></ngx-barcode></td>
                </tr>
                <tr>
                    <td>{{customerName}}</td>
                </tr>
            </table>
        </div>
        
    `,
    styles: ['.wfc { width:300px; cursor: pointer }']
})
export class PrintBarcodeComponent {

    @ViewChild('printbtn') printbtn: ElementRef
    itemNumber: number
    batch: string
    customerName: string
    itemName: string
    pcsCarton: string
    barcodeK: string
    volumeK: string
    netoW: number
    grossW: number
    expireDate: any
    customerNames: string[] = []

    constructor(
        private itemService: ItemsService,
        private batchService: BatchesService,
        private costumerService: CostumersService,
        private toastr: ToastrService) { }

    findMyCostumer() {
        this.costumerService.getCustomerNamesRegex(this.customerName).subscribe(customers => {
            for (let customer of customers) {
                this.customerNames.push(customer.costumerName)
            }
        })
    }

    printBarcodeForItem() {
        this.itemService.getItemData(this.itemNumber).subscribe(data => {
            if (data.length > 0) {
                this.itemName = data[0].itemName
                this.pcsCarton = data[0].PcsCarton.replace(/\D/g, "") + " Pcs"
                this.barcodeK = data[0].barcodeK;
                this.volumeK = data[0].volumeKey + ' ml';
                this.netoW = data[0].netWeightK;
                this.grossW = data[0].grossUnitWeightK;
                this.batchService.getBatchData(this.batch).subscribe(data => {
                    if(data.length > 0) {
                        this.expireDate = data[0].expration.slice(0, 11);
                        this.printbtn.nativeElement.click()
                    }
                    else this.toastr.error('Batch Not Found.')
                })
            }
            else this.toastr.error('Item Not Found.')
        })


    }

}