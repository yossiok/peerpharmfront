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
  phaseItems:any[] = [];
  formuleAdd: boolean = true;
  phaseAdd: boolean = false;
  currentFormule: any;
  EditRowId: any = "";
  allPercentage:number;


  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('itemNumber') itemNumber: ElementRef;
  @ViewChild('percentage') percentage: ElementRef;
  @ViewChild('remarks') remarks: ElementRef;



  @ViewChild('updatePhaseNumber') updatePhaseNumber: ElementRef;


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    // this.edit('');
  }


  allFormuleCategory: Array<any> = ['Oil Based Lotion', 'Water Baised Lotion', 'Hyperallergic', 'Powder']

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
  }

  newPhase = {
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
  }

  fillTheNumberByType(ev){
  debugger;
    var formuleType = ev.target.value;

    if(formuleType == "father"){
     this.formuleService.getLastFatherFormule().subscribe(data=>{
       debugger;
       this.newFormule.formuleNumber = "F"+(Number(data.formuleNumber.slice(1,5))+1)

     })
    }
    if(formuleType == "base"){
      this.formuleService.getLastBaseFormule().subscribe(data=>{
        debugger;
        this.newFormule.formuleNumber = "B"+(Number(data.formuleNumber.slice(1,5))+1)
 
      })

    }

  }

  fillMaterialNumber(ev){
  var materialName = ev.target.value;

  var material = this.allMaterials.find(m=>m.componentName == materialName)
  this.newItem.itemNumber = material.componentN
  debugger;
  

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
      this.newItem.itemName = ''
      this.newItem.itemNumber = ''
      this.newItem.percentage = ''
      this.newItem.remarks = ''

    }
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
          this.newPhase.amountOfItems = ''
          this.newPhase.items = []
          this.newPhase.phaseNumber = ''
          this.newPhase.remarks = ''
  
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
    var itemNumber = ev.target.value
    this.inventoryService.getMaterialStockItemByNum(itemNumber).subscribe(data => {
      debugger;
      this.newItem.itemName = data[0].componentName

    });
  }

  getAllBaseFormules(){
    this.formuleService.getAllBaseFormules().subscribe(data=>{
      debugger;
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

        this.newFormule.formuleName = ""
        this.newFormule.formuleNumber = ""
        this.newFormule.formuleCategory = ""
        this.newFormule.formuleType = ""
        this.newFormule.phFrom = ""
        this.newFormule.phTo = ""
        this.newFormule.impRemarks = ""
        this.allPercentage = null
      }
    } else {
      this.Toastr.success("פורמולה הוקמה בהצלחה !")
      this.formuleAdd = true;
      this.phaseAdd = false;
      this.currentFormule = false;
      this.newFormule.formuleName = ""
      this.newFormule.formuleNumber = ""
      this.newFormule.formuleCategory = ""
      this.newFormule.formuleType = ""
      this.newFormule.phFrom = ""
      this.newFormule.phTo = ""
      this.newFormule.impRemarks = ""
      this.allPercentage = null
    }
  }

  saveEdit() {
    debugger;
    this.updatePhaseNumber.nativeElement.value;
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
