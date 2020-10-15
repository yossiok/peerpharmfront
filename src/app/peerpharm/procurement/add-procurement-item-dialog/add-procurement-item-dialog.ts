import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { Procurementservice } from 'src/app/services/procurement.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";


@Component({
  selector: 'add-procurement-item-dialog',
  templateUrl: './add-procurement-item-dialog.html',
  styleUrls: ['./add-procurement-item-dialog.scss']
})
export class AddProcurementItemDialog implements OnInit {
  form: FormGroup;
  description:string;
  allMaterials: any[];
  filteredValues: any[];
  public myControl: FormControl;
    
  constructor(
        private fb: FormBuilder,
        private supplierService: SuppliersService,
        private inventoryService:InventoryService,
    private dialogRef: MatDialogRef<AddProcurementItemDialog>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.description = data.description;
    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(newValue => {
      this.filteredValues = this.filterValues(newValue);
    })
  }
  
  ngOnInit() {
  
    this.form = this.fb.group({
      amount: ['', Validators.required],
      price: ['', Validators.required],
      sum: ['', Validators.required],
      material: this.myControl,
      comment: ['',  ],
      compnentN:'',
      componentName:''
    });
   
   this.getAllItems();
  }
  filterValues(search: string) {
    return this.allMaterials.filter(value =>
      value.componentName.includes(search))
  }
  getAllItems() {
    this.inventoryService.getAllMaterials().subscribe(data => {
      data.forEach(e=>
        {
          e.componentNameFormat=e.componentN+" - "+ e.componentName;
        })
      this.allMaterials = data;
    })
  }


  save() {
 this.dialogRef.close(this.form.value);
}

close() {
  this.dialogRef.close();
}

changefiled(ev)
{
  this.form.get('compnentN').setValue(ev);
  let elm=this.allMaterials.find(x=>x.componentN==ev); 
  this.form.get('componentName').setValue(elm.componentName);
}
   
}
 