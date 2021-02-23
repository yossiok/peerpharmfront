import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';
import { BatchesService } from 'src/app/services/batches.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {

  allMaterialBoxes:any[]
  EditRowId:any;
  editRow:Boolean = false;

  material = {
    boxNumber:'',
    batchNumber:'',
    location:'',
    outDate:'',
    orderNumber:'',
    destinDate:'',
    availability:'',
    description:'',
    amount:'',
  }
  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  @ViewChild('updateBoxLocation') updateBoxLocation: ElementRef;



  constructor(private batchService:BatchesService,private toastSrv:ToastrService,private inventorySrv:InventoryService) { }

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

  getBatchDetails(ev){
    ;
    this.batchService.getBatchData(ev.target.value).subscribe(data=>{
    if(data.length > 0){
      this.material.orderNumber = data[0].order
      this.material.outDate = data[0].produced
      this.material.amount = data[0].barrels
      this.material.destinDate = data[0].expration
    }
    })
  }

  edit(id) {
    ;
    if (id != '') {
      this.editRow = true
      this.EditRowId = id;
    } else {
      this.EditRowId = '';
      this.editRow = false;
    }
  }

  getAllMatBoxes(){
    this.inventorySrv.getAllMatBoxes().subscribe(data=>{
      ;
    this.allMaterialBoxes= data;
    })
  }

  updateLocation(id){
  let location = this.updateBoxLocation.nativeElement.value;
  this.inventorySrv.updateBoxLocation(id,location).subscribe(data=>{
   if(data){
    var box = this.allMaterialBoxes.find(b=>b._id == data._id);
    box.location = data.location
     this.edit('');
     this.toastSrv.success('מיקום עודכן בהצלחה')

   }

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
