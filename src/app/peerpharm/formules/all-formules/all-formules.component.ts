import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormulesService } from 'src/app/services/formules.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-formules',
  templateUrl: './all-formules.component.html',
  styleUrls: ['./all-formules.component.css']
})
export class AllFormulesComponent implements OnInit {

  allFormules:any[];
  allFormulesCopy:any[];
  EditRowId: any = "";
  currentDoc:any;
  updateFormule:any[];
  isCollapsed:boolean = false;
  closeResult: string;

  @ViewChild('formuleNumber') formuleNumber: ElementRef;
  @ViewChild('formuleName') formuleName: ElementRef;
  @ViewChild('formuleClient') formuleClient: ElementRef;
  @ViewChild('formuleLastUpdate') formuleLastUpdate: ElementRef;
  @ViewChild('formuleParent') formuleParent: ElementRef;

  constructor(private formuleService:FormulesService,private toastSrv: ToastrService,private modalService:NgbModal) { }

  
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  ngOnInit() {
    this.getAllFormules();
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

saveEdit(currdoc) {
  debugger
  

  if (this.formuleNumber.nativeElement.value && this.formuleName.nativeElement.value != "") {

    this.currentDoc.number = this.formuleNumber.nativeElement.value.trim();
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
 formuleToUpdate = this.allFormules.filter(formule => formule.number == formuleNum);
 this.updateFormule = formuleToUpdate
}


private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

}
