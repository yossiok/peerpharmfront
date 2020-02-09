import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormulesService } from '../../../services/formules.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  constructor(private formuleService: FormulesService,
    private route: ActivatedRoute, 
    private inventorytServ:InventoryService,
    private toastSrv: ToastrService,) { }
  // the true values
  scheduleId: String;
  formuleFrom: any=null;
  step: Number=1;
  currPhase: any;
  currItem: any;
  // the input values
  inputValue: String;
  //the response values
  sugestedItem: String=null;
  wrongItem: Boolean=null;
  wrongQnt: Boolean=false;
  checkedItem: any=null;
  correctQnt: Boolean=false;

  @ViewChild('qntInput') qntInput: ElementRef;
  @ViewChild('materialId') materialId: ElementRef;
  
  ngOnInit() {
    
    this.scheduleId = this.route.snapshot.queryParamMap.get('schedule');
    this.formuleService.getFormBySchedleId(this.scheduleId).subscribe(form=>{
      if(form!=null){
        this.formuleFrom= form;
        if(this.formuleFrom.phases[0].status=="new"){
          this.currPhase= this.formuleFrom.phases[0]
          this.currItem= this.formuleFrom.phases[0].items[0]
          this.formuleFrom.phases[0].items.map(i=>{
            if(i.app){}
          })
        }
      }  
    })
  }

  searchMaterial(ev){
    
    this.inputValue= ev.target.value;
    if(this.inputValue.length==24){
      this.checkMaterial().then(data=>{
        this.correctQnt=false;
        this.step=2;
      }).catch(data=>{
        this.currPhase
      });
    }
  }

  checkMaterial(){
    
    this.wrongItem= null;
    const that= this;
    return new Promise(async function (resolve, reject) {
      // this.inputValue = materialStockItem._id (27/06/2019) needs to be stockItem._id for itemType='mateiral'
      that.inventorytServ.getMaterialStockItemById(that.inputValue).subscribe(doc=>{
        if(doc){
          that.currPhase.items.map(item=>{
            // if(doc.componentN == item.itemNumber && item.approval==false){
            if(doc.componentN == item.itemNumber && item.approval==false){
              that.checkedItem=item;
              that.step=2;
              that.wrongItem= false;
              resolve(item);
            }else{
              that.wrongItem= true;
              that.step=1; 
              reject('wrong item')
            }
          })
        }else{
          that.wrongItem= true;
          that.step=1;
          reject('wrong item')
        }
      })
    });
  }
  checkItemQnt(ev){
    debugger
      // this.inputValue = materialStockItem._id (27/06/2019) needs to be stockItem._id for itemType='mateiral'
      var userQnt=  this.qntInput.nativeElement.value;
      // var userQnt=  ev.target.value;
      if(userQnt == this.checkedItem.calculatedQnt){
        this.formuleFrom.phases.map(p=>{
          if(p._id == this.currPhase._id){
            p.items.map(item=>{
              if(this.checkedItem.itemNumber == item.itemNumber && item.approval==false){
                item.approval=true;
                item.materialArrivalFormId= this.inputValue;
              }
              
            });
          }

        });
        // let formToUpdate;
        this.formuleService.updateFormuleForm(this.formuleFrom).subscribe(form=>{
          this.currPhase.items.map(item=>{
            if(this.checkedItem.itemNumber == item.itemNumber && item.approval==false){
  
              item.approval=true;
            }
          });
          this.correctQnt=true;
          this.step=3;
          this.toastSrv.success('Scan item updated in assembly form')
        });

      }else{
        this.step=2;
        this.correctQnt=false;
        this.wrongQnt=true
      }
  }

  nextMaterial(){
    // this.materialId.nativeElement.value=null;
    
    var nextItemIndex= 0;
    var nextPhaseIndex= 0;
    var continuePhase= false;
    this.currPhase.items.map((item,key)=>{
      if(item.approval==false) {
        continuePhase=true;
        nextItemIndex=key;
      } 
    })
    if(continuePhase){
      this.currItem= this.currPhase.items[nextItemIndex];
      this.step=1;
      this.correctQnt=null;
      
    }else{
      this.currPhase
      var loop=true;
      for (let i = 0; i < this.formuleFrom.phases.length; i++) {
        let phase = this.formuleFrom.phases[i];
        if(this.currPhase._id == phase._id && loop && phase.status=='new' ){
          loop= false;
          phase.status='done';
          // set to next phase
          alert('Phase '+ this.currPhase.phaseNumber+' is done!');
          
          this.currPhase=this.formuleFrom.phases[i+1];
          if(this.currPhase!= undefined && this.currPhase!= null){
            if(this.formuleFrom.phases[i+1].items.length >0){
              this.currItem=this.formuleFrom.phases[i+1].items[0];
              this.step=1;
              this.correctQnt=null;
            }
          } else{
            this.formuleFrom.status='done';
            this.formuleService.updateFormuleForm(this.formuleFrom).subscribe(form=>{
              this.step=4
            });
            
          }
          // to be continue 
        }
        let formuleDone=true;
        this.formuleFrom.phases.map((phs,key)=>{
          if(phs.status!='done'){
            formuleDone=false;
          }
          if(key+1 == this.formuleFrom.phases && formuleDone) this.step=4;
        })
        
      }
    }

  }

}