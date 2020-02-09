import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProcurementItemDialog } from '../add-procurement-item-dialog/add-procurement-item-dialog';


@Component({
  selector: 'app-new-procurement-order',
  templateUrl: './new-procurement-order.component.html',
  styleUrls: ['./new-procurement-order.component.css']
})
export class NewProcurementOrderComponent implements OnInit {


  getLastOrderNumber(): string {
    return "";
  }

  newProcurementForm: any;
  procurementSupplier: boolean = true;
  procurementItems: boolean = false;
  allSuppliers: any[];
  filteredValues: any[];
  allItems = [];
  hasAuthorization: boolean = false;
  public myControl: FormControl;



  newProcurement = {
    orderNumber: this.getLastOrderNumber(),
    date: this.utilsService.formatDate(new Date()),

  }


  constructor(private procurementService: Procurementservice, private dialog: MatDialog, private utilsService: UtilsService, private authService: AuthService,
    private inventoryService: InventoryService, private supplierService: SuppliersService, public formBuilder: FormBuilder
  ) {
    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(newValue => {
      this.filteredValues = this.filterValues(newValue);
    });


  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      'top': '0',
      left: '0'
    };
    dialogConfig.direction = "rtl";
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };

    const dialogRef = this.dialog.open(AddProcurementItemDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data =>
      { console.log("Dialog output:", data);

      //search for old item in table- if found- update if not found- new
      let item= this.allItems.find(x=>x.componentN == data.componentN);
      if(item)
      {
        item=data;
      }
      else{
        this.allItems.push(data);
      }
    }
 
    );

  }


  ngOnInit() {
    this.getAllSuppliers();

  }
  filterValues(search: string) {
    return this.allSuppliers.filter(value =>
      value.suplierName.includes(search))
  }


  moveToProcItems() {

    if (this.newProcurementForm.value.orderNumber != "") {
      this.procurementSupplier = false;
      this.procurementItems = true;
    }
  }

  findMaterialByNumber() {

    //  this.inventoryService.getMaterialStockItemByNum(this.newProcurement.itemNumber).subscribe(data=>{

    //data;
    //this.newProcurement.itemName = data[0].componentName; 
    // })
  }

  getAllSuppliers() {
    this.supplierService.getSuppliersDiffCollection().subscribe(data => {
      this.allSuppliers = data;
    })
  }

  findSupplierByNumber(ev) {

    let supplier = ev.target.value;
    let result = this.allSuppliers.filter(x => supplier == x.suplierName)

    //  this.newProcurement.supplierNumber = result[0].suplierNumber

  }

  sendNewProc() {

    this.procurementService.addNewProcurement(this.newProcurement).subscribe(data => {
      data;
    })
  }

  neworder(content) {
    this.openDialog();
  }

}