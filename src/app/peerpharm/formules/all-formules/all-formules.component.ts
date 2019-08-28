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
    unitMeasure:'',
    percentage:'',
    temp:'',
    currentPhase:'',
    formuleId:''

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
    debugger;
    this.invtSer.getAllMaterialsForFormules().subscribe(data=>{
      debugger;
      this.materials = data;
      debugger;
    })
  }


  addNewItem() {

    debugger;

    this.updateFormule;
    this.addItem.currentPhase = this.updateFormule.currentPhase;
    this.addItem.formuleId = this.updateFormule._id
    this.formuleService.addItem(this.addItem).subscribe(data=>{
      debugger;
      data;
    })
  }

  addNewPhase() { 
    debugger;
    this.formuleService.addPhase(this.addPhase).subscribe(data=>{
     
      debugger;
      if(data) { 
        this.toastSrv.success("Phase added successfully")
   
    }
  })
}

  getAllFormules() { 
    this.formuleService.getAllFormules().subscribe(data=>{
      debugger;
      this.allFormules = data;
      this.allFormulesCopy = data;
    })
  }

  edit(id) {
    debugger
    // if(this.alowUserEditBatches == true) {
    this.EditRowId = id;
    debugger
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
  debugger
  
  this.EditRowId = id;

    var formules = this.allFormules;
    var results = [];
  
    for (let i = 0; i < formules.length; i++) {
      for (const j = 0; j < formules[i].phases.length; i++) {
        if (formules[i].phases[j]._id === id) {
          results.push(formules[i].phases[j]);
          
        }
      }
      
    }
  
    this.currentDoc = results;
  
   
}

editItems(phaseId,index) { 
  debugger;
  this.EditRowId = phaseId

  var formules = this.allFormules;
  var results = [];

  for (let i = 0; i < formules.length; i++) {
    for (const j = 0; j < formules[i].phases.length; i++) {
      if (formules[i].phases[j]._id === phaseId) {
        results.push(formules[i].phases[j]);
        
      }
    }
    
  }

  this.currentDoc = results[0].items
  this.itemToUpdate.itemNumber = this.currentDoc[0].itemNumber 
  this.itemToUpdate.itemName = this.currentDoc[0].itemName
  this.itemToUpdate.quantity = this.currentDoc[0].quantity
  this.itemToUpdate.quantityUnits = this.currentDoc[0].quantityUnits
  this.itemToUpdate.percentage = this.currentDoc[0].percentage
  this.itemToUpdate.itemPH = this.currentDoc[0].itemPH
  this.itemToUpdate.temp = this.currentDoc[0].temp
  this.currentDoc[0].index = index

  
}

saveEdit(currdoc) {
  debugger


  if (this.formuleName.nativeElement.value != "") {

   
    this.currentDoc.name = this.formuleName.nativeElement.value.trim();
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
  debugger;


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

saveItemEdit(currDoc) { 
  debugger;
  this.currentDoc;

  if(this.itemToUpdate.itemNumber != "") {

    this.currentDoc[0].itemName = this.itemToUpdate.itemName
    this.currentDoc[0].itemNumber = this.itemToUpdate.itemNumber
    this.currentDoc[0].percentage = this.itemToUpdate.percentage
    this.currentDoc[0].quantity = this.itemToUpdate.quantity
    this.currentDoc[0].quantityUnits = this.itemToUpdate.quantityUnits
    this.currentDoc[0].temp = this.itemToUpdate.temp
    if(confirm("האם אתה בטוח שאתה רוצה לשנות פריטים אלו ?") == true) {
      this.updatePhaseItems() 
    }

  } else {

    this.toastSrv.error("Can't save changes with missing fields.")

  }
}

updatePhase() { 
  this.formuleService.updateFormulePhaseId(this.currentDoc).subscribe(data=>{
    debugger;
    data;
    this.EditRowId = '';
    this.toastSrv.success("Details were successfully saved");
  })
}

updatePhaseItems() { 
  this.formuleService.updateFormulePhaseItems(this.currentDoc).subscribe(data=>{
    debugger;
    data;
    this.EditRowId = '';
    this.toastSrv.success("Details were successfully saved");
  })
}


updateDocument(){
 debugger
  this.formuleService.updateFormulesForm(this.currentDoc).subscribe(data =>{
    debugger;
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
  debugger;
  this.updateFormule = [];
  debugger;
  this.modalService.open(formuleData, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  this.loadData(formuleNum)
}

loadData(formuleNum) { 
  debugger;
  var formuleToUpdate = [];
 formuleToUpdate = this.allFormules.find(formule => formule.number == formuleNum);
 this.updateFormule = formuleToUpdate
}


openItem(itemData,phaseNumber) {
  debugger;
  
  this.modalService.open(itemData, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  this.loadItemData(phaseNumber)
}

loadItemData(phaseNumber) { 
debugger;

let details = this.updateFormule.phases.find(phase=>phase.phaseNumber == phaseNumber)
this.updateItems = details.items;
this.updateFormule.currentPhase = phaseNumber

}


private getDismissReason(reason: any): string {
 debugger;
    if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

}
