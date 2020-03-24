import { Component, OnInit } from '@angular/core';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-formule-production',
  templateUrl: './formule-production.component.html',
  styleUrls: ['./formule-production.component.css']
})
export class FormuleProductionComponent implements OnInit {

  allFormules:any[]
  approvalArray:any[]
  currFormule:any;
  currPhases:any;
  nextBtn:Boolean = false;
  showFinishBtn:Boolean = false;
  showFormuleModal:Boolean = false;



  constructor(private FormuleService:FormulesService,private InventorySrv:InventoryService,private toastSrv:ToastrService) { }

  ngOnInit() {
    this.getAllFormulesProduction();
  }
    

  getAllFormulesProduction(){
  this.FormuleService.getAllsentToProduction().subscribe(data=>{
    debugger;
  this.allFormules = data;
  })
  }

  beginFormule(formuleNumber){

    
    this.showFormuleModal = true;
    this.FormuleService.getFormuleByNumber(formuleNumber).subscribe(data=>{
    debugger;
    this.currFormule = data;
    this.currPhases = data.phases

    for (let i = 0; i < this.currPhases.length; i++) {
     for (let j = 0; j < this.currPhases[i].items.length; j++) {
      this.currPhases[i].items[j].approve = false;
     }
      
    }

    })
  }

  searchMaterial(event,itemName){
    debugger;
    this.InventorySrv.getMaterialStockItemById(event.target.value).subscribe(data=>{
      debugger;
   
      if(data){
          if(data.componentName == itemName){
            for (let i = 0; i < this.currPhases.length; i++) {

              for (let j = 0; j < this.currPhases[i].items.length; j++) {
               if(this.currPhases[i].items[j].itemName == itemName ){
                this.currPhases[i].items[j].approve = true;
               }

               var approve = this.currPhases[i].items.filter(i=>i.approve != true);
               if(approve.length == 0){
                 this.showFinishBtn = true;
               } else {
                 this.showFinishBtn = false;
               }

              }
               
             }
          } else { 
            this.toastSrv.error("Wrong Material")
          }
        }



    })
  }

  finishCooking(){
    this.showFinishBtn = false;
    this.showFormuleModal = false;

    this.toastSrv.success("Finished Successfuly")

  }

}
