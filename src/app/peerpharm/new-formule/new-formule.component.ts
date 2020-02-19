import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormulesService } from 'src/app/services/formules.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ItemsService } from 'src/app/services/items.service';



@Component({
  selector: 'app-new-formule',
  templateUrl: './new-formule.component.html',
  styleUrls: ['./new-formule.component.css']
})
export class NewFormuleComponent implements OnInit {
  
  allMaterials:any[];
  baseFormules:any[];
  allChildren:any[] = [];
  currentBaseFormule:any;
  phaseItems:any[] = [];
  formuleAdd: boolean = true;
  phaseAdd: boolean = false;
  CurrBaseFormulePhases: boolean = false;
  updateCurrBaseFormule: boolean = false;
  chooseChildren: boolean = false;
  chooseFromBuffer: boolean = false;
  currentFormule: any;
  EditRowId: any = "";
  allPercentage:number;


  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('percentage') percentage: ElementRef;
  @ViewChild('remarks') remarks: ElementRef;
  @ViewChild('addChildren') addChildren: ElementRef;



  @ViewChild('updatePhaseNumber') updatePhaseNumber: ElementRef;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    // this.edit('');
  }


  allFormuleCategory: Array<any> = ['Oil Based Lotion', 'Water Baised Lotion', 'Hyperallergic', 'Powder']
  allFormuleBuffers: Array<any> = ['Citric Acid', 'Lactic Acid', 'Soda Caustic 15%', 'Triethanolamine TEA']

  newFormule = {
    formuleType: '',
    formuleNumber: '',
    formuleName: '',
    formuleCategory: '',
    date: this.formatDate(new Date()),
    phFrom: '',
    phTo: '',
    impRemarks: '',
    user: '',
    phases: [],
    children:[],
  }

  newPhase = {
    formuleId: '',
    phaseName: '',
    remarks: '',
    amountOfItems: '',
    items: []

  }
  basePhase = {
    formuleId: '',
    phaseNumber: '',
    remarks: '',
    amountOfItems: '',
    items: []

  }

  newItem = {

    itemName: '',
    itemNumber: '',
    percentage: '',
    remarks: '',

  }
  baseItem = {

    itemName: '',
    itemNumber: '',
    percentage: '',
    remarks: '',

  }

  constructor(private itemService:ItemsService,private formuleService: FormulesService, private Toastr: ToastrService, private authService: AuthService, private inventoryService: InventoryService) { }

  async ngOnInit() {
    await this.authService.userEventEmitter.subscribe(user => {
      debugger;
      this.newFormule.user = user.userName
    });
    this.getAllMaterials()
    this.getAllBaseFormules()
  }


  getAllMaterials(){
    this.inventoryService.getAllMaterials().subscribe(data=>{
      this.allMaterials = data;
    })
  }
  fillTheNameByNumber(ev){
    debugger;
    var formuleNumber = ev.target.value;

    if(formuleNumber != "") {
      this.itemService.getItemData(formuleNumber).subscribe(data=>{
        debugger;
        this.newFormule.formuleName = data[0].name+" "+data[0].subName+" "+data[0].discriptionK     
       })
    }
  }

  createFormuleFromBase(ev){
  var formuleName = ev.target.value;
  debugger;
  this.formuleService.getFormuleByName(formuleName).subscribe(data=>{
    debugger;
    data;
    this.currentBaseFormule = data;
    this.updateCurrBaseFormule = true;
    this.phaseAdd = false;
    this.formuleAdd = false;
    
  })
  }

  newFormuleFromBase(){
    debugger;
    this.newFormule.children = this.allChildren
    
    this.formuleService.newFormule(this.newFormule).subscribe(data=>{
    if(data == "formule number exist"){
      this.Toastr.error("מספר פורמולה קיים")
    } else {
      this.Toastr.success("פורמולה הוקמה בהצלחה , אנא המשך עם הפאזות")
      this.updateCurrBaseFormule = false;
      this.CurrBaseFormulePhases = true;
      
      this.newPhase.formuleId = data._id
    }
    })
  }

  updatePhasesInNewFormule(){

   

    this.formuleService.updateFormuleFromBase(this.currentBaseFormule).subscribe(data=>{
      if(data){

        this.Toastr.success("פורמולה הוקמה בהצלחה !")
        this.CurrBaseFormulePhases = false;
        this.formuleAdd = true;
        this.allPercentage = null
        this.resetFormuleForm();
        
      }

    })

  }


  fillTheNumberByType(ev){
  debugger;
    var formuleType = ev.target.value;

    if(formuleType == "father"){
     this.formuleService.getLastFatherFormule().subscribe(data=>{
       debugger;
       this.newFormule.formuleNumber = "F"+(Number(data.formuleNumber.slice(1,5))+1)
       this.chooseChildren = true;

     })
    } else { 
      this.chooseChildren = false;
    }
    if(formuleType == "base"){
      this.formuleService.getLastBaseFormule().subscribe(data=>{
        debugger;
        this.newFormule.formuleNumber = "B"+(Number(data.formuleNumber.slice(1,5))+1)
        this.chooseChildren = false;
 
      })

    }

  }

  fillMaterialNumber(ev){
  var materialName = ev.target.value;

  var material = this.allMaterials.find(m=>m.componentName == materialName)
  this.newItem.itemNumber = material.componentN
  debugger;
  

  }

  addChildrenToFather(){
    debugger;
    var childrenNumber = this.addChildren.nativeElement.value;
    var tempArr = [];
    tempArr = this.allChildren

    var obj = {
      childNumber:childrenNumber
    }
  

    for (let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].childNumber==childrenNumber){
        this.Toastr.error("פורמולת בן כבר קיימת")
        this.addChildren.nativeElement.value = "";
        var exist = true;
        return exist;
      } 
     }
      
    if(!exist){
      tempArr.push(obj)
      this.addChildren.nativeElement.value = "";
      this.Toastr.success("פורמולת בן נוספה בהצלחה !")
    
    }

  }


  moveToPhases() {
    debugger
    if (this.newFormule.user == "" || this.newFormule.date == "" || this.newFormule.formuleCategory == "" || 
      this.newFormule.formuleNumber == "") {

      this.Toastr.error("אנא תמלא את כל הפרטים")
    } else {

      this.formuleService.newFormule(this.newFormule).subscribe(data => {
        debugger;
        if (data == "formule number exist") {
          this.Toastr.error("מספר פורמולה קיים")
        } else {
          this.Toastr.success("פורמולה הוקמה בהצלחה , אנא המשיך עם הקמת פאזות")
          this.formuleAdd = false;
          this.phaseAdd = true;
          this.newPhase.formuleId = data._id


        }
      })
    }

  }

  addItemsToPhase() {
  debugger;
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,

    }

    if (this.itemName.nativeElement.value == "" || this.itemNumber.nativeElement.value == "" || this.percentage.nativeElement.value == "") {
      this.Toastr.error("לא כל הפרטים מלאים")
    } else {

      if (this.newPhase.items.length >= Number(this.newPhase.amountOfItems)) {
        this.Toastr.error("-כמות הפריטים בפאזה מוגבלת ל" + this.newPhase.amountOfItems)
      } else {
        this.newPhase.items.push(newItem)
        this.Toastr.success("פריט חדש נוסף לפאזה")
        
      }
      this.resetItemForm();
    }
  }
  
  addItemToBasePhase(){
    debugger;
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,
    }
      
   var phases = this.currentBaseFormule.phases

   for (let i = 0; i < phases.length; i++) {
     phases[i].formuleId = this.newPhase.formuleId
    if(phases[i].phaseName == this.newPhase.phaseName) {
      if(phases[i].items.length < this.newPhase.amountOfItems) {
        phases[i].items.push(newItem)
        phases[i].remarks = this.newPhase.remarks
        this.Toastr.success("פריט נוסף בהצלחה")
        this.chooseFromBuffer = false;
 
      } else {
        this.Toastr.error("-כמות הפריטים בפאזה מוגבלת ל" + this.newPhase.amountOfItems)
      }
      
      } 
     
   }

   var num = 0
   for (let i = 0; i < phases.length; i++) {
    for (let j = 0; j < phases[i].items.length; j++) {
     num += Number(phases[i].items[j].percentage)
      
    }
     
   }

   this.allPercentage = num
   this.currentBaseFormule.phases = phases
  this.resetItemForm();
  }

  addItemToNewPhase(){
    debugger;
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,
    }

    var phases = this.currentBaseFormule.phases
    this.newPhase.items.push(newItem)
    phases.push(this.newPhase)

    for (let i = 0; i < phases.length; i++) {
      phases[i].formuleId = this.newPhase.formuleId
      
    }

    var num = 0
    for (let i = 0; i < phases.length; i++) {
     for (let j = 0; j < phases[i].items.length; j++) {
      num += Number(phases[i].items[j].percentage)
       
     }
      
    }
    this.allPercentage = num
    this.resetItemForm();
  }

  addNewPhase() {
    debugger
    if(this.newPhase.items.length < Number(this.newPhase.amountOfItems)){
      this.Toastr.error("מספר הפריטים שהוספת קטן יותר מאשר מצוין בפאזה")
    } else {
      this.formuleService.addNewPhase(this.newPhase).subscribe(data => {
        debugger
        if (data) {
          this.Toastr.success("פאזה הוקמה בהצלחה")
          this.resetPhaseForm();
          this.currentFormule = data;
          var num = 0
          for (let i = 0; i < data.phases.length; i++) {
           for (let j = 0; j < data.phases[i].items.length; j++) {
            num += Number(data.phases[i].items[j].percentage)
             
           }
            
          }
          this.allPercentage = num
        }
  
      })
    }

  }

  fillMaterialName(ev) {
    debugger;
    var itemNumber = ev.target.value
    if(itemNumber != "buffer" || itemNumber != "") {
      this.chooseFromBuffer = false;
      this.inventoryService.getMaterialStockItemByNum(itemNumber).subscribe(data => {
        this.newItem.itemName = data[0].componentName
      });
    } 
    if(itemNumber == "buffer"){
      this.chooseFromBuffer = true;
    }
  }

  getAllBaseFormules(){
    this.formuleService.getAllBaseFormules().subscribe(data=>{
      this.baseFormules = data;
    })
  }

  // edit(id) {
  //   debugger;
  //   if (id != '') {
  //     this.EditRowId = id;
  //   } else {
  //     this.EditRowId = '';
  //   }
  // }

  FinishFormule(){
    if(this.allPercentage != 100){
      if(confirm("כמות האחוזים לא שווה 100 , האם תרצה להמשיך ?")) {
        this.Toastr.success("פורמולה הוקמה בהצלחה !")
        this.formuleAdd = true;
        this.phaseAdd = false;
        this.currentFormule = false;
        this.resetFormuleForm();
        this.allPercentage = null
      }
    } else {
      this.Toastr.success("פורמולה הוקמה בהצלחה !")
      this.formuleAdd = true;
      this.phaseAdd = false;
      this.currentFormule = false;
      this.resetFormuleForm();
      this.allPercentage = null
    }
  }

  saveEdit() {
    debugger;
    this.updatePhaseNumber.nativeElement.value;
  }

  resetFormuleForm(){
    this.newFormule.formuleType = ''
    this.newFormule.formuleNumber= ''
    this.newFormule.formuleName= ''
    this.newFormule.formuleCategory= ''
    this.newFormule. phFrom= ''
    this.newFormule.phTo= ''
    this.newFormule.impRemarks= ''
  }

  resetItemForm(){
    this.newItem.itemName = ""
    this.newItem.itemNumber = ""
    this.newItem.remarks = ""
    this.newItem.percentage = ""
  }

  resetPhaseForm(){
    this.newPhase.formuleId = ""
    this.newPhase.items = []
    this.newPhase.remarks = ""
    this.newPhase.amountOfItems = ""
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
