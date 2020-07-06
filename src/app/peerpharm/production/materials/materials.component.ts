import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  allMaterialBoxes:any[]

  material = {
    boxNumber:'',
    batchNumber:'',
    location:'',
    outDate:'',
    orderNumber:'',
    destinDate:'',
    availability:'',
    description:'',
  }

  constructor(private toastSrv:ToastrService,private inventorySrv:InventoryService) { }

  ngOnInit() {
    this.getAllMatBoxes();
  }

  addNewBox(){
  this.inventorySrv.addNewBox(this.material).subscribe(data=>{
  if(data){
    this.allMaterialBoxes = data;
    this.toastSrv.success('פריט נוסף בהצלחה !')
    this.clearFields()
  }
  })
  }



  getAllMatBoxes(){
    this.inventorySrv.getAllMatBoxes().subscribe(data=>{
      debugger;
    this.allMaterialBoxes= data;
    })
  }



  clearFields(){
    this.material.batchNumber = ''
    this.material.location = ''
    this.material.outDate = ''
    this.material.orderNumber = ''
    this.material.destinDate = ''
    this.material.availability = ''
    this.material.description = ''
  }
}
