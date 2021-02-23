import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormulesService } from 'src/app/services/formules.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-formule-production',
  templateUrl: './formule-production.component.html',
  styleUrls: ['./formule-production.component.scss']
})
export class FormuleProductionComponent implements OnInit {

  allFormules:any[]
  approvalArray:any[]
  materialArrivals:any[]
  materialsForFormules:any[]
  selectedArr:any[] = [];
  currFormule:any;
  currPhases:any;
  materialScanId:String;
  nextBtn:Boolean = false;
  showFinishBtn:Boolean = false;
  showFormuleModal:Boolean = false;
  showTable:Boolean = false;
  approveAmount:Boolean = false;
  showMaterialsForFormules:Boolean = false;
  chooseCookingFormule:Boolean = true;
  showInput:String = '';
  currItemNumber:String;
  kgProductionAmount:String;
  EditRowId:String = '';
  EditRowQ:String = '';
  
  @ViewChild('productionNetWeight') productionNetWeight: ElementRef;
  @ViewChild('productionQuantity') productionQuantity: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.insertId('','');
    this.edit('','')
  }

  constructor(private FormuleService:FormulesService,private InventorySrv:InventoryService,private toastSrv:ToastrService) { }

  ngOnInit() {
    this.getAllFormulesProduction();
  }
    

  getAllFormulesProduction(){
  this.FormuleService.getAllsentToProduction().subscribe(data=>{
    ;
  this.allFormules = data;
  })
  }

  beginFormule(formuleNumber,quantity,netWeightGr){

    this.chooseCookingFormule = false;
    this.showFormuleModal = true;
    this.FormuleService.getFormuleByNumber(formuleNumber).subscribe(data=>{
    ;
    this.currFormule = data;
    this.currPhases = data.phases

    for (let i = 0; i < this.currPhases.length; i++) {
     for (let j = 0; j < this.currPhases[i].items.length; j++) {
      this.currPhases[i].items[j].approve = false;
      this.currPhases[i].items[j].kgProduction = Math.ceil((Number(quantity)*(Number(netWeightGr)/1000))*(this.currPhases[i].items[j].percentage/100))
     }
      
    }

    })
  }

  edit(id,quantity){
    if(id != '' && quantity != ''){
      this.EditRowId = id;
      this.EditRowQ = quantity
    } else {
      this.EditRowId = '';
      this.EditRowQ = '';
    }
  }

  saveEdit(production){
      ;
      var updateProduction = {...production}
      updateProduction.netWeightGr = Number(this.productionNetWeight.nativeElement.value)
      updateProduction.quantity = Number(this.productionQuantity.nativeElement.value)   

    this.InventorySrv.updateProductionDetails(updateProduction).subscribe(data=>{
      ;
      data;
      var formule = this.allFormules.find(f=>f._id == data.formuleId);
      var production = formule.production.find(p=>p.orderNumber == data.orderNumber);
      production.quantity = data.quantity
      production.netWeightGr = data.netWeightGr
      this.edit('','')
      this.toastSrv.success('עודכן בהצלחה!')
      })
  }
  
  isSelected(ev, item) {
    
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr
      isSelected.push({ ...item });
      this.selectedArr = isSelected
    }

    if (ev.target.checked == false) {
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x => x.itemNumber != item.itemNumber)
      this.selectedArr = tempArr
    }
  }

  loadMaterialsForFormule(){
    
    this.selectedArr

    this.InventorySrv.getMaterialsForFormules(this.selectedArr).subscribe(data => {
      
      if (data.msg == "לא קיימת פורמולה") {
        this.toastSrv.error("לא קיימת פורמולה לאחד מהפריטים")
      } else {
        this.materialsForFormules = data;
        this.showMaterialsForFormules = true;
        
      }

    })
  }

  searchMaterialByNumber(materialNumber){
    ;
   

    this.InventorySrv.getMaterialArrivalByNumber(materialNumber).subscribe(data=>{
    ;
    if(data){
      this.materialArrivals = data.reverse();
      this.showTable = true;
      this.showFormuleModal = false;
     
    } else{
      
    }

    })

    
  }

  continueCook(){
    ;
    this.showTable = false;
    this.showFormuleModal = true;
    this.showInput = this.currItemNumber
 
  }

  insertId(itemNumber,itemName){
    ;
    this.kgProductionAmount
    if(itemNumber != "" && itemNumber != "buffer"){
      this.currItemNumber = itemNumber
      this.searchMaterialByNumber(itemNumber)
      
    }
    else if(itemNumber == "buffer" && itemName != ""){
    this.searchMaterialByName(itemName);
    this.currItemNumber = 'buffer'
    }
     else {
      this.showInput = ""
    }
  }

  searchMaterialByName(materialName){
    this.InventorySrv.getMaterialByName(materialName).subscribe(data=>{
    if(data){
      this.searchMaterialByNumber(data[0].componentN)
     
    }
    })
  }

  checkKgAmount(itemNumber){
    this.materialScanId = ''
    for (let i = 0; i < this.currPhases.length; i++) {
      for (let j = 0; j < this.currPhases[i].items.length; j++) {
        if(this.currPhases[i].items[j].itemNumber == itemNumber && this.currPhases[i].items[j].kgProduction == this.kgProductionAmount){
          this.approveAmount = true;
        }
      }
    }
  }

  searchMaterial(event,itemNumber){
    ;

    this.InventorySrv.getMaterialArrivalFormById(event.target.value).subscribe(data=>{
      
      if(data){
        
          if(data.internalNumber == itemNumber || itemNumber == 'buffer'){
            for (let i = 0; i < this.currPhases.length; i++) {                
              for (let j = 0; j < this.currPhases[i].items.length; j++) {
              


               if(this.currPhases[i].items[j].itemNumber == data.internalNumber){
                 if(this.approveAmount == true){
                  this.currPhases[i].items[j].approve = true;
                 } else{
                   this.toastSrv.error('Check KG Amount')
                 }
               
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
