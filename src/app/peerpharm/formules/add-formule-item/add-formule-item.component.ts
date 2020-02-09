import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormulesService } from 'src/app/services/formules.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-add-formule-item',
  templateUrl: './add-formule-item.component.html',
  styleUrls: ['./add-formule-item.component.css']
})
export class AddFormuleItemComponent implements OnInit {
  itemsForm: FormGroup;
  phValue: any;
  materials: any[];
  percentageCalculated:Number = 0;
  @Output() itemAdded = new EventEmitter();
  @Input() itemInfo :any;
  @Input() phaseInfo :any;

  constructor(private toastSrv: ToastrService, 
    private formuleService: FormulesService, 
    private fb: FormBuilder,
    private invtSer:InventoryService,) {
    this.itemsForm = this.fb.group({
      //set by the user
      itemNumber: [null, Validators.required],
      itemName: ['', Validators.required],
      itemInstructions: ['', ],
      quantity: [0,],
      quantityUnits: ['gr'],
      percentage: [null, Validators.required],
      temp: [null, ],
      formuleId: ['', Validators.required],
      phaseId: ['', Validators.required],
    });
  }

  ngOnChange(){
    this.adjustFormData();
  }
  ngOnInit() {
    
    this.getAllMaterials();
    this.adjustFormData();
    
  }
  adjustFormData(){ 
    this.itemsForm.controls.formuleId.setValue(this.phaseInfo.formuleId);
    this.itemsForm.controls.phaseId.setValue(this.phaseInfo._id);
    this.itemsForm.controls.itemNumber.setValue(this.itemInfo.itemNumber);
    this.itemsForm.controls.itemName.setValue(this.itemInfo.itemName);
    this.itemsForm.controls.itemInstructions.setValue(this.itemInfo.itemInstructions);
  }

  onSubmit() { 
    if(this.itemsForm.valid){
      const newItemAdded = this.itemsForm.value;

      this.itemAdded.emit(newItemAdded);  
    }else{
      // toaster
      this.toastSrv.error('Fill required item fields')
    }
  }

  getAllMaterials() { 
    this.invtSer.getAllMaterialsForFormules().subscribe(data=>{
      this.materials = data;
    })
  }

  resetItemFormButNotPhase(){
    this.itemsForm.controls.itemNumber.reset();
    this.itemsForm.controls.itemName.reset();
    this.itemsForm.controls.itemInstructions.reset();
    this.itemsForm.controls.quantity.reset();
    this.itemsForm.controls.quantityUnits.reset();
    this.itemsForm.controls.percentage.reset()
    this.itemsForm.controls.temp.reset();
  }

  fillTheMaterialNumber(ev) { 
    let componentName = ev.target.value;
    let details = this.materials.filter(x =>x.componentName == componentName)
    this.itemsForm.controls.itemNumber.setValue(details[0].componentN)
  }
  searchMaterialNumber(ev){ 
    let materialNumber = ev.target.value;

    let details = this.materials.filter(material=> material.componentN == materialNumber)
    this.itemsForm.controls.itemName.setValue(details[0].componentName);
    
      
    
  }


}
