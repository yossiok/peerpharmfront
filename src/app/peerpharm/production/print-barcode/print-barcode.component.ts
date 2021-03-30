import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BatchesService } from 'src/app/services/batches.service';
import { CostumersService } from 'src/app/services/costumers.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
    template: `
    <div class="form-group">
        <label>Enter Order Number (optional)</label> <br>
        <input [(ngModel)]="orderNumber" type="number">
    </div>
    <h4>Item</h4>
    <div class="d-flex flex-row">
        <div class="form-group">
            <label>Item Number</label> <br>
            <input [(ngModel)]="itemNumber" type="number">
            <p class="mt-2"><button class="btn btn-default" (click)="fetchItemData()">Get Item Data</button></p>
        </div>
        <div class="form-group ml-1">
            <label>Name</label> <br>
            <input [(ngModel)]="itemName" type="text">
        </div>
        <div class="form-group ml-1">
            <label>Description</label> <br>
            <input [(ngModel)]="itemDesc" type="text">
        </div>
        <div class="form-group ml-1">
            <label>Carton Pieces</label> <br>
            <input [(ngModel)]="pcsCarton" type="text">
        </div>
        <div class="form-group ml-1">
            <label>Barcode</label> <br>
            <input [(ngModel)]="barcodeK" type="text">
        </div>
        <div class="form-group ml-1">
            <label>volume</label> <br>
            <input [(ngModel)]="volumeK" type="text">
        </div>
        <div class="form-group ml-1">
            <label>Neto Weight</label> <br>
            <input [(ngModel)]="netoW" type="number">
        </div>
        <div class="form-group ml-1">
            <label>Gross Weight</label> <br>
            <input [(ngModel)]="grossW" type="number">
        </div>
    </div>
    <div class="d-flex flex-column">
        <div class="form-group"> 
            <label>Enter Batch</label> <br>
            <input [(ngModel)]="batch" type="text">
            <h5 class="mt-2"><input type="checkbox" (change)="printExpiration = !printExpiration">Print Expiration Date</h5>
        </div>
        <div class="form-group">
            <label>Enter Customer Name</label> <br>
            <input [(ngModel)]="customerName" type="text">
            <p>(Enter a few letters and than 'Complete Me' to find customer)</p>
            <p><button (click)="findMyCostumer()">Complete Me</button></p>
            <div *ngIf="customerNames.length > 0" class="list-group">
                <a *ngFor="let name of customerNames"  class="list-group-item list-group-item-action wfc" (click)="this.customerName=name; this.customerNames = []">
                    {{name}}
                </a>
            </div>
        </div>
    </div>
    <button class="btn btn-default" (click)="printBarCode()">Print Barcode</button>
    <button [style.display]="'none'" printSectionId="print-section" #printbtn ngxPrint class="btn btn-default"></button>

    <!--printed:-->
    <div style="visibility: hidden;" id="print-section">
        <table style="text-align: center;" class="barcodeTbl" dir="ltr" [style.margin.px]="3" [style.width.px]="400"
        [style.max-height.px]="400" [style.font-size.px]="24" [style.border.px]="0">
            <tr class="bordered" *ngIf="orderNumber">
                <td><strong>Order Number: {{orderNumber}}</strong></td>
            </tr>
            <tr>
                <td>{{itemName}}</td>
            </tr>
            <tr>
                <td>{{itemDesc}}</td>
            </tr>
            <tr>
                <td>Item Number: {{itemNumber}}</td>
            </tr>
            <tr>
                <td>{{volumeK}} {{pcsCarton}}</td>
            </tr>
            <tr>
                <td>{{batch}} <label *ngIf="printExpiration">Exp: {{expireDate}}</label></td>
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
    styles: ['.wfc { width:300px; cursor: pointer } .bordered { border: 1px solid black }']
})
export class PrintBarcodeComponent {

    @ViewChild('printbtn') printbtn: ElementRef
    orderNumber: string
    itemNumber: number
    batch: string = "---"
    customerName: string
    itemName: string
    itemDesc: string
    pcsCarton: string
    barcodeK: string
    volumeK: string
    netoW: number
    grossW: number
    expireDate: any
    customerNames: string[] = []
    printExpiration: boolean = false;

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

    fetchItemData() {
        this.itemService.getItemData(this.itemNumber).subscribe(data => {
            if (data.length > 0) {
                this.itemName = data[0].name
                this.itemDesc = data[0].discriptionK
                this.pcsCarton = data[0].PcsCarton.replace(/\D/g, "") + " Pcs"
                this.barcodeK = data[0].barcodeK;
                this.volumeK = data[0].volumeKey + ' ml';
                this.netoW = data[0].netWeightK;
                this.grossW = data[0].grossUnitWeightK;
            
            }
            else this.toastr.error('Item Not Found.')
        })


    }

    printBarCode() {
        if(this.batch != '---') {
            this.batchService.getBatchData(this.batch).subscribe(data => {
                if(data.length > 0) {
                    this.expireDate = data[0].expration.slice(0, 11);
                    setTimeout(()=>this.printbtn.nativeElement.click(),500)
                }
                else this.toastr.error('Batch Not Found.')
            })
        }
        else setTimeout(()=>this.printbtn.nativeElement.click(),500)
    }

}