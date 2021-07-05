import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  cmptCategoryList: Array<any>
  potentialSuppliers: Array<any>

  mainForm: FormGroup = new FormGroup({
    componentType: new FormControl(null),
    mlCapacityMin: new FormControl(null),
    mlCapacityMax: new FormControl(null),
    componentCategory: new FormControl(null),
    componentType2: new FormControl(null),
    componentType3: new FormControl(null),
    material: new FormControl(null),
    material2: new FormControl(null),
    packageType: new FormControl(null)
  })

  constructor(
    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllTypes()
    this.getAllCmptMaterials()
    this.getAllallCategories()
    this.getAllallPackageTypes()
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

  getAllallCategories(){
    this.inventoryService.getAllallCategories().subscribe(categories=>{
      this.cmptCategoryList = categories
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

  findSuppliersByCategories(){
    
    this.suppliersService.getSuppliersByCategories(this.mainForm.value).subscribe(data=> {
      if(data.length > 0) this.potentialSuppliers = data
      else this.toastr.info('לא נמצא ספק התואם את המאפיינים')
    })
  }

}
