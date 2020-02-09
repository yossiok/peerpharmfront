import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormulesService } from 'src/app/services/formules.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-all-formules',
  templateUrl: './all-formules.component.html',
  styleUrls: ['./all-formules.component.css']
})
export class AllFormulesComponent implements OnInit {

  allFormules:any[];
  allFormulesCopy:any[];
  materials:any[];
  EditRowId: any = "";
  currentDoc:any;
  updateFormule:any;
  isCollapsed:boolean = false;
  closeResult: string;
  updateItems:any;

  addItem = {
    itemNumber:'',
    itemName:'',
    quantity:'',
    quantityUnits:'',
    percentage:'',
    temp:'',
    currentPhase:'',
    formuleId:'',
    phaseId:''

  }

  addPhase = {
    phaseNumber:'',
    phaseName:'',
    phaseInstructions:'',
    formuleNumber:''
  }

  phaseToUpdate = {
    phaseName:'',
    phaseIns:''
  }

  itemToUpdate = {
    itemNumber:'',
    itemName:'',
    quantity:'',
    quantityUnits:'',
    percentage:'',
    itemPH:'',
    temp:'',
    index:''

  }

  @ViewChild('formuleNumber') formuleNumber: ElementRef;
  @ViewChild('formuleName') formuleName: ElementRef;
  @ViewChild('formuleClient') formuleClient: ElementRef;
  @ViewChild('formuleLastUpdate') formuleLastUpdate: ElementRef;
  @ViewChild('formuleParent') formuleParent: ElementRef;
  @ViewChild('formulePhaseName') formulePhaseName: ElementRef;
  @ViewChild('formulePhaseIns') formulePhaseIns: ElementRef;

  constructor(private invtSer:InventoryService,private formuleService:FormulesService,private toastSrv: ToastrService,private modalService:NgbModal) { }

  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
    this.editPhases('')
    
  }

  ngOnInit() {
    this.getAllFormules();
    this.getAllMaterials();
  }

  getAllMaterials() { 
    this.invtSer.getAllMaterialsForFormules().subscribe(data=>{
    this.materials = data;
    })
  }


  addNewItem() {

   

    this.updateFormule;
    this.addItem.currentPhase = JSON.stringify(this.updateFormule.currentPhase)
    this.addItem.formuleId = this.updateFormule._id
    var phase = this.updateFormule.phases.filter(phase=>phase.phaseNumber == this.addItem.currentPhase)
    this.addItem.phaseId = phase[0]._id
    this.formuleService.addItem(this.addItem).subscribe(data=>{
     
      if(data) {
       var allPhases = data.phases;
       var phase = allPhases.filter(phase => phase._id == this.updateItems.phaseId)
       this.updateItems = phase[0].items
        this.toastSrv.success("Item added successfully")
      }
    })
  }

  addNewPhase() { 
   
    this.formuleService.addPhase(this.addPhase).subscribe(data=>{
     
     
      if(data) { 
        this.updateFormule.phases = data.phases;
        this.toastSrv.success("Phase added successfully")
   
    }
  })
}

  getAllFormules() { 
    this.formuleService.getAllFormules().subscribe(data=>{
     
      this.allFormules = data;
      this.allFormulesCopy = data;
    })
  }

  edit(id) {
   
    // if(this.alowUserEditBatches == true) {
    this.EditRowId = id;
   
    if (id != '') {
      this.currentDoc = this.allFormules.filter(i => {
        if (i._id == id) {
          return i;
        }
      })[0];
    }  else {
      this.EditRowId = '';
    }
  // }
}

editPhases(id) {
 
  
  this.EditRowId = id;
  

    this.updateFormule;
    this.EditRowId = id;
  
      var formule = this.allFormules.find(formule => formule._id == this.updateFormule._id)
      
    
      var results = formule.phases.filter(phase=> phase._id == id )
    
      this.currentDoc = results;
    
     var phase = this.updateFormule.phases.find(phase => phase._id == id)

      this.phaseToUpdate.phaseName = phase.phaseName
      this.phaseToUpdate.phaseIns = phase.phaseInstructions
      
  
   
}

editItems(itemNumber,index,phaseId) { 
 
  this.updateItems
  this.EditRowId = itemNumber

  // var formules = this.allFormules;
  // var results = [];

  // for (let i = 0; i < formules.length; i++) {
  //   for (const j = 0; j < formules[i].phases.length; i++) {
  //     if (formules[i].phases[j]._id === phaseId) {
  //       results.push(formules[i].phases[j]);
        
  //     }
  //   }
    
  // }

  var formule = this.allFormules.find(formule => formule._id == this.updateFormule._id)
  var results = formule.phases.filter(phase=> phase._id == phaseId )

  this.currentDoc = results[0].items
  this.currentDoc[0].index = index
 
  

  var phase = this.updateFormule.phases.find(phase => phase._id == phaseId)

  this.itemToUpdate.itemNumber = phase.items[index].itemNumber
  
  this.itemToUpdate.quantity = phase.items[index].quantity
  this.itemToUpdate.quantityUnits = phase.items[index].quantityUnits
  this.itemToUpdate.percentage = phase.items[index].percentage
  this.itemToUpdate.itemPH = phase.items[index].itemPH
  this.itemToUpdate.temp = phase.items[index].temp

}

saveEdit(currdoc) {
 


  if (this.formuleName.nativeElement.value != "") {

   
    this.currentDoc.name = this.formuleName.nativeElement.value.trim();
    this.currentDoc.number = this.formuleNumber.nativeElement.value.trim();
    this.currentDoc.client = this.formuleClient.nativeElement.value.trim();
    this.currentDoc.lastUpdate = this.formuleLastUpdate.nativeElement.value.trim();
    this.currentDoc.parent = this.formuleParent.nativeElement.value.trim();
    
    if(confirm("האם אתה בטוח רוצה לשנות פריטים אלו ?") == true) {
      this.updateDocument()
    }

  } else {

    this.toastSrv.error("Can't save changes with missing fields.")

  }

}

savePhaseEdit(currDoc) { 
 


  if(this.phaseToUpdate.phaseName != "") {
    this.currentDoc[0].phaseName = this.phaseToUpdate.phaseName;
    this.currentDoc[0].phaseInstructions =  this.phaseToUpdate.phaseIns;
    if(confirm("האם אתה בטוח שאתה רוצה לשנות פריטים אלו ?") == true) {
      this.updatePhase() 

    }
    
  } else {

    this.toastSrv.error("Can't save changes with missing fields.")

  }

  

}

saveItemEdit(currDoc,index) { 
 
  this.currentDoc;

  if(this.itemToUpdate.itemNumber != "") {
    this.currentDoc[index].index = index
    this.currentDoc[index].itemName = this.itemToUpdate.itemName
    this.currentDoc[index].itemNumber = this.itemToUpdate.itemNumber
    this.currentDoc[index].percentage = this.itemToUpdate.percentage
    this.currentDoc[index].quantity = this.itemToUpdate.quantity
    this.currentDoc[index].quantityUnits = this.itemToUpdate.quantityUnits
    this.currentDoc[index].temp = this.itemToUpdate.temp
    if(confirm("האם אתה בטוח שאתה רוצה לשנות פריטים אלו ?") == true) {
      this.updatePhaseItems(index) 
    }

  } else {

    this.toastSrv.error("Can't save changes with missing fields.")

  }
}

updatePhase() { 
 
  this.formuleService.updateFormulePhaseId(this.currentDoc).subscribe(data=>{
   
    data;
    this.EditRowId = '';
    this.toastSrv.success("Details were successfully saved");
    this.phaseToUpdate.phaseName = ""
    this.phaseToUpdate.phaseIns = ""
   
    
  })
}

updatePhaseItems(index) { 
  this.formuleService.updateFormulePhaseItems(this.currentDoc[index]).subscribe(data=>{
   
    data;
    this.EditRowId = '';
    this.toastSrv.success("Details were successfully saved");
    this.getAllFormules();
  })
}


updateDocument(){

  this.formuleService.updateFormulesForm(this.currentDoc).subscribe(data =>{
   
    this.allFormules.map(doc=>{
      if(doc._id == this.currentDoc._id){
        doc=data;
      }
    });
    this.allFormulesCopy.map(doc=>{
      if(doc._id == this.currentDoc._id){
        doc=data;
      }
    });
    
    this.EditRowId=""
    this.toastSrv.success("Details were successfully saved");
  });
}


open(formuleData,formuleNum) {
 
  this.updateFormule = [];
 
  this.modalService.open(formuleData, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  this.loadData(formuleNum)
}

loadData(formuleNum) { 
 
  var formuleToUpdate = [];
 formuleToUpdate = this.allFormules.find(formule => formule.number == formuleNum);
 this.updateFormule = formuleToUpdate
}

deleteFormule(id) {
 
  this.formuleService.deleteFormuleById({id}).subscribe(data =>{
   
    data;
    this.getAllFormules();
  })
}
deletePhase(phaseId) {
 
  var formuleId = this.updateFormule._id

  var phaseToDelete = {
    phaseId:phaseId,
    formuleId:formuleId
  }
  this.formuleService.deletePhaseById(phaseToDelete).subscribe(data =>{
   
    this.updateFormule.phases = data.phases;
 
  })
}

deleteItem(itemNumber,index,phaseId) {
 
  var formuleId = this.updateFormule._id
  var itemToDelete = {
    index:index,
    itemNumber:itemNumber,
    phaseId:phaseId,
    formuleId:formuleId
  }
  this.formuleService.deleteItemById(itemToDelete).subscribe(data =>{
   

   var phase = data.phases.filter(phase=> phase._id == phaseId)
   
    this.updateItems = phase[0].items
   

 
  })

}


openItem(itemData,phaseNumber) {
 
  
  this.modalService.open(itemData, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  this.loadItemData(phaseNumber)
}

loadItemData(phaseNumber) {  

let details = this.updateFormule.phases.find(phase=>phase.phaseNumber == phaseNumber)
this.updateItems = details.items;
this.updateItems.phaseId = details._id
this.updateFormule.currentPhase = phaseNumber

}


private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

copyFormule(currDoc,index) { 
 
  var formuleToCopy = this.allFormules[index]

  this.formuleService.copyFormule(formuleToCopy).subscribe(data=>{
   
    data;
  this.allFormules.push(data);
  })
  

}


fillTheMaterialNumber(ev) {
 
  let componentName = ev.target.value;
  let details = this.materials.filter(x =>x.componentName == componentName)
  this.addItem.itemNumber = details[0].componentN
}
searchMaterialNumber(ev){
 
  let materialNumber = ev.target.value;

  let details = this.materials.filter(material=> material.componentN == materialNumber)
  this.addItem.itemName = details[0].componentName;
  
    
  
}

}
