import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';
import { SuppliersService } from 'src/app/services/suppliers.service';

@Component({
  selector: 'app-item-suppliers',
  templateUrl: './item-suppliers.component.html',
  styleUrls: ['./item-suppliers.component.scss']
})
export class ItemSuppliersComponent implements OnInit {

  components: any[] = []
  cmptTypes: Array<any>
  cmptTypes2: Array<any>
  cmptTypes3: Array<any>
  packageTypes: Array<any>
  cmptMaterials: Array<any>
  cmptMaterials2: Array<any>
  potentialSuppliers: Array<any>

  mainForm: FormGroup = new FormGroup({
    type: new FormControl(''),
    mlCapacity: new FormControl(''),
    type2: new FormControl(''),
    type3: new FormControl(''),
    material: new FormControl(''),
    material2: new FormControl(''),
    packageType: new FormControl('')
  })

  constructor(
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService
  ) { }

  ngOnInit(): void {
    this.getAllTypes()
    this.getAllCmptMaterials()
  }

  getAllTypes() {
    this.inventoryService.getAllComponentTypes().subscribe(allTypes=>{
      this.cmptTypes = allTypes
    })
    this.inventoryService.getAllComponentTypes2().subscribe(allTypes=>{
      this.cmptTypes2 = allTypes
    })
    this.inventoryService.getAllComponentTypes3().subscribe(allTypes=>{
      this.cmptTypes3 = allTypes
    })
  }

  getAllCmptMaterials(){
    this.inventoryService.getAllComponentMaterials().subscribe(allMaterials=>{
      this.cmptMaterials = allMaterials
    })
    this.inventoryService.getAllComponentMaterials2().subscribe(allMaterials=>{
      this.cmptMaterials2 = allMaterials
    })
  }

  getAllallPackageTypes(){
    this.inventoryService.getAllallPackageTypes().subscribe(packageTypes=>{
      this.packageTypes = packageTypes
    })
  }

  addComponent() {
    this.components.push({ componentN: ''})
  }

  //Find Suppliers for component
  findSuppsForComp(component){
    this.suppliersService.getsuppliersForItem(component.componentN).subscribe(suppliers =>{
      component.suppliers = suppliers
    })
  }

  findSuppliers(){

  }

}
