import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  EventEmitter,
} from "@angular/core";
import { FormulesService } from "src/app/services/formules.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { InventoryService } from "src/app/services/inventory.service";
import { ItemsService } from "src/app/services/items.service";
import { fromEventPattern } from "rxjs";

@Component({
  selector: "app-new-formule",
  templateUrl: "./new-formule.component.html",
  styleUrls: ["./new-formule.component.scss"],
})
export class NewFormuleComponent implements OnInit {
  allMaterials: any[];
  mixedMaterials: any[];
  baseFormules: any[];
  fatherFormules: any[];
  childrenToRemove: any[];
  allChildren: any[] = [];
  currentBaseFormule: any;
  phaseItems: any[] = [];
  formuleAdd: boolean = true;
  phaseAdd: boolean = false;
  CurrBaseFormulePhases: boolean = false;
  updateCurrBaseFormule: boolean = false;
  chooseChildren: boolean = false;
  chooseFromBuffer: boolean = false;
  hasMixedMaterial: boolean = false;
  currentFormule: any;
  childrenToAdd: any;

  user: any;
  EditRowId: any = "";
  allPercentage: number;

  @ViewChild("itemName") itemName: ElementRef;
  @ViewChild("itemNumber") itemNumber: ElementRef;
  @ViewChild("percentage") percentage: ElementRef;
  @ViewChild("remarks") remarks: ElementRef;
  @ViewChild("addChildren") addChildren: ElementRef;
  @ViewChild("fatherFormule") fatherFormule: ElementRef;
  @ViewChild("childToAdd") childToAdd: ElementRef;
  @ViewChild("fatherToRemove") fatherToRemove: ElementRef;
  @ViewChild("childToRemove") childToRemove: ElementRef;

  @ViewChild("updatePhaseName") updatePhaseName: ElementRef;
  @ViewChild("updateItemsIndex") updateItemsIndex: ElementRef;
  @ViewChild("updatePercentage") updatePercentage: ElementRef;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);
    this.edit("");
  }

  allFormuleCategory: Array<any> = [
    "Oil Based Lotion",
    "Water Baised Lotion",
    "Hyperallergic",
    "Powder",
  ];
  allFormuleBuffers: Array<any> = [
    "Citric Acid",
    "Lactic Acid",
    "Soda Caustic 15%",
    "Triethanolamine TEA",
  ];

  newFormule = {
    formuleType: "",
    formuleNumber: "",
    formuleName: "",
    formuleCategory: "",
    date: this.formatDate(new Date()),
    phFrom: "",
    phTo: "",
    viscoFrom: "",
    viscoTo: "",
    impRemarks: "",
    user: "",
    phases: [],
    children: [],
    baseFormule: "",
  };

  newPhase = {
    formuleId: "",
    phaseName: "",
    remarks: "",
    amountOfItems: "",
    items: [],
  };
  basePhase = {
    formuleId: "",
    phaseNumber: "",
    remarks: "",
    amountOfItems: "",
    items: [],
  };

  newItem = {
    itemName: "",
    itemNumber: "",
    percentage: "",
    itemRemarks: "",
  };
  baseItem = {
    itemName: "",
    itemNumber: "",
    percentage: "",
    remarks: "",
  };

  constructor(
    private itemService: ItemsService,
    private formuleService: FormulesService,
    private Toastr: ToastrService,
    private authService: AuthService,
    private inventoryService: InventoryService
  ) {}

  async ngOnInit() {
    await this.authService.userEventEmitter.subscribe((user) => {
      this.user = user.userName;
      this.newFormule.user = user.userName;
    });
    this.getUserDetails();
    this.getAllMaterials();
    this.getAllFatherFormules();
    this.getAllBaseFormules();
  }

  async getUserDetails() {
    this.user = this.authService.loggedInUser.userName;
    this.newFormule.user = this.user;
  }

  getAllMaterials() {
    this.inventoryService.getAllMaterials().subscribe((data) => {
      this.allMaterials = data;
    });
  }
  fillTheNameByNumber(ev) {
    var formuleNumber = ev.target.value;

    if (formuleNumber != "") {
      this.itemService.getItemData(formuleNumber).subscribe((data) => {
        this.newFormule.formuleName =
          data[0].name + " " + data[0].subName + " " + data[0].discriptionK;
      });
    }
  }

  createFormuleFromBase(ev) {
    var formuleName = ev.target.value;
    this.formuleService.getFormuleByName(formuleName).subscribe((data) => {
      data;
      this.currentBaseFormule = data;
      this.updateCurrBaseFormule = true;
      this.phaseAdd = false;
      this.formuleAdd = false;
    });
  }

  newFormuleFromBase() {
    this.newFormule.children = this.allChildren;
    this.newFormule.baseFormule = this.currentBaseFormule.formuleNumber;

    this.formuleService.newFormule(this.newFormule).subscribe((data) => {
      if (data == "formule number exist") {
        this.Toastr.error("מספר פורמולה קיים");
      } else {
        this.Toastr.success("פורמולה הוקמה בהצלחה , אנא המשך עם הפאזות");
        this.updateCurrBaseFormule = false;
        this.CurrBaseFormulePhases = true;

        this.newPhase.formuleId = data._id;
      }
    });
  }

  updatePhasesInNewFormule() {
    this.currentBaseFormule.children = this.allChildren;
    this.formuleService
      .updateFormuleFromBase(this.currentBaseFormule)
      .subscribe((data) => {
        if (data) {
          this.Toastr.success("פורמולה הוקמה בהצלחה !");
          this.CurrBaseFormulePhases = false;
          this.formuleAdd = true;
          this.allPercentage = null;
          this.resetFormuleForm();
          this.resetChildrenForm();
        }
      });
  }

  fillTheNumberByType(ev) {
    var formuleType = ev.target.value;
    if (formuleType == "father") {
      this.formuleService.getLastFatherFormule().subscribe((data) => {
        this.newFormule.formuleNumber =
          "F" + (Number(data.formuleNumber.slice(1, 5)) + 1);
        this.chooseChildren = true;
      });
    } else {
      this.chooseChildren = false;
    }
    if (formuleType == "base") {
      this.formuleService.getLastBaseFormule().subscribe((data) => {
        this.newFormule.formuleNumber =
          "B" + (Number(data.formuleNumber.slice(1, 5)) + 1);
        this.chooseChildren = false;
      });
    }
  }

  addChildToExistFather() {
    var obj = {
      fatherFormule: this.fatherFormule.nativeElement.value,
      childNumber: this.childrenToAdd,
    };

    let father = this.fatherFormules.findIndex(
      (f) => f.formuleNumber == obj.fatherFormule
    );
    console.log(father);
    console.log(obj.fatherFormule);
    console.log(obj.childNumber);
    if (father < 0) {
      this.Toastr.error("פורמולת אב לא תקינה, בדוק שוב");
      this.fatherFormule.nativeElement.focus();
      return;
    }
    this.formuleService
      .getFormuleByNumber(this.childrenToAdd)
      .subscribe((data) => {
        console.log(data);
        if (!data) {
          console.log("פרומולת בן לא קיימת");
          this.Toastr.error("פורמולת בן לא קיימת");
          this.childrenToAdd = "";
        } else if (data.msg) {
          this.Toastr.error(data.msg);
          console.log(data);
          return;
        } else if (
          (data && data.parentNumber != "" && data.parentNumber != null) ||
          data.formuleType == "child"
        ) {
          this.Toastr.error("פורמולת בן קיימת אצל אב אחר");
          this.childToAdd.nativeElement.focus();
          return;
        } else if (data) {
          console.log("Entered else");

          this.formuleService.addChildToFather(obj).subscribe((data) => {
            if (data.msg) {
              this.Toastr.error(data.msg);
              this.childrenToAdd = "";
              return;
            } else {
              this.formuleService.newFormuleAdded.emit(data);
              this.Toastr.success(
                "פורמולה מספר" + data.formuleNumber + "נוספה בהצלחה"
              );
              this.childrenToAdd = "";
              return;
            }
          });
        }
      });
  }

  removeChildFromExistFather() {
    console.log(this.fatherToRemove.nativeElement.value);
    console.log(this.childToRemove.nativeElement.value);
    let objectToSend = {
      children: [
        { child: { childNumber: this.childToRemove.nativeElement.value } },
      ],
      parentNumber: this.fatherToRemove.nativeElement.value,
    };
    this.formuleService
      .separateChildFromParent(objectToSend)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.Toastr.warning(data.msg);
        } else {
          this.Toastr.success(
            "The child has been separated from his parent successfully"
          );
          let index = this.fatherFormules.findIndex(
            (f) => f.formuleNumber == data.formuleNumber
          );
          this.fatherFormules.splice(index, 1, data);
          this.childToRemove.nativeElement.value = "";
          this.fatherToRemove.nativeElement.value = "";
        }
      });
  }

  fillMaterialNumber(ev) {
    var materialName = ev.target.value;

    var material = this.allMaterials.find(
      (m) => m.componentName == materialName
    );
    let idx = this.newPhase.items.findIndex(
      (item) => item.itemNumber == material.componentN
    );
    if (idx > -1) {
      alert("הפריט קיים כבר בפאזה זו, יש לבחור פריט אחר");
      this.itemName.nativeElement.value = "";
      return;
    }
    this.newItem.itemNumber = material.componentN;
    if (material.mixedMaterial.length > 0) {
      this.hasMixedMaterial = true;
      this.mixedMaterials = material.mixedMaterial;
    } else {
      this.hasMixedMaterial = false;
    }
  }

  addChildrenToFather() {
    var childrenNumber = this.addChildren.nativeElement.value;
    if (childrenNumber != "") {
      this.formuleService
        .getFormuleByNumber(childrenNumber)
        .subscribe((data) => {
          console.log(data._doc);
          console.log(data.parentNumber);
          console.log(data.formuleType);
          if (
            (data.parentNumber != "" && data.parentNumber != null) ||
            data.formuleType == "child"
          ) {
            this.Toastr.error("פורמולת בן קיימת אצל אב אחר");
          } else {
            var tempArr = [];
            tempArr = this.allChildren;

            var obj = {
              childNumber: childrenNumber,
            };

            for (let i = 0; i < tempArr.length; i++) {
              if (tempArr[i].childNumber == childrenNumber) {
                this.Toastr.error("פורמולת בן כבר קיימת ברשימה");
                this.addChildren.nativeElement.value = "";
                var exist = true;
                return exist;
              }
            }

            if (!exist) {
              tempArr.push(obj);
              this.addChildren.nativeElement.value = "";
              this.Toastr.success("פורמולת בן נוספה בהצלחה !");
            }
          }
        });
    }
  }

  moveToPhases() {
    this.newFormule.children = this.allChildren;
    if (
      this.newFormule.user == "" ||
      this.newFormule.date == "" ||
      this.newFormule.formuleCategory == "" ||
      this.newFormule.formuleNumber == ""
    ) {
      this.Toastr.error("אנא מלא את כל הפרטים");
    } else {
      console.log(this.newFormule);
      this.formuleService.addNewFormule(this.newFormule).subscribe((data) => {
        if (data.msg) {
          this.Toastr.error(data.msg);
          console.log(data);
          // this.newFormule.date = "";
          // this.newFormule.formuleCategory = "";
          this.newFormule.formuleNumber = "";
          // this.newFormule.formuleName = "";
          // this.newFormule.phFrom = null;
          // this.newFormule.phTo = null;
          // this.newFormule.viscoFrom = null;
          // this.newFormule.viscoTo = null;

          return;
        } else {
          this.Toastr.success("פורמולה הוקמה בהצלחה , אנא המשיך עם הקמת פאזות");
          this.formuleAdd = false;
          this.phaseAdd = true;
          this.newPhase.formuleId = data._id;
        }
      });
    }
  }

  addItemsToPhase() {
    let idx = this.newPhase.items.findIndex(
      (item) => item.itemNumber == this.itemNumber.nativeElement.value
    );
    if (idx > -1) {
      alert("הפריט כבר קיים בפאזה זו, יש לבחור פריט אחר.");
      this.resetItemForm();
      return;
    } else if (this.currentFormule) {
      let itemExists = false;
      console.log(this.currentFormule);
      for (let phase of this.currentFormule.phases) {
        let itemNum = phase.items.find(
          (item) => item.itemNumber == this.itemNumber.nativeElement.value
        );
        if (itemNum) itemExists = true;
      }
      if (itemExists) {
        console.log("item exists in the formule");
        let contFormule = confirm(
          "הפריט קיים כבר בפורמולה הנוכחית, האם להמשיך?"
        );
        if (!contFormule) {
          this.resetItemForm();
          return;
        }
      }
    }
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,
    };

    if (
      this.itemName.nativeElement.value == "" ||
      this.itemNumber.nativeElement.value == ""
    ) {
      this.Toastr.error("לא כל הפרטים מלאים");
    } else {
      if (this.newPhase.items.length >= Number(this.newPhase.amountOfItems)) {
        this.Toastr.error(
          "-כמות הפריטים בפאזה מוגבלת ל" + this.newPhase.amountOfItems
        );
      } else {
        this.newPhase.items.push(newItem);
        this.Toastr.success("פריט חדש נוסף לפאזה");
      }
      this.resetItemForm();
    }
  }

  addItemToBasePhase() {
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,
    };

    var phases = this.currentBaseFormule.phases;

    for (let i = 0; i < phases.length; i++) {
      phases[i].formuleId = this.newPhase.formuleId;
      if (phases[i].phaseName.toUpperCase() == this.newPhase.phaseName) {
        if (phases[i].items.length < this.newPhase.amountOfItems) {
          phases[i].items.push(newItem);
          phases[i].remarks = this.newPhase.remarks;
          this.Toastr.success("פריט נוסף בהצלחה");
          this.chooseFromBuffer = false;
        } else {
          this.Toastr.error(
            "-כמות הפריטים בפאזה מוגבלת ל" + this.newPhase.amountOfItems
          );
        }
      }
    }

    var num = 0;
    for (let i = 0; i < phases.length; i++) {
      for (let j = 0; j < phases[i].items.length; j++) {
        num += Number(phases[i].items[j].percentage);
      }
    }

    this.allPercentage = num;
    this.currentBaseFormule.phases = phases;
    this.resetItemForm();
  }

  addItemToNewPhase() {
    var newItem = {
      itemName: this.itemName.nativeElement.value,
      itemNumber: this.itemNumber.nativeElement.value,
      percentage: this.percentage.nativeElement.value,
      remarks: this.remarks.nativeElement.value,
    };

    var phases = this.currentBaseFormule.phases;
    this.newPhase.items.push(newItem);
    phases.push(this.newPhase);

    for (let i = 0; i < phases.length; i++) {
      phases[i].formuleId = this.newPhase.formuleId;
    }

    var num = 0;
    for (let i = 0; i < phases.length; i++) {
      for (let j = 0; j < phases[i].items.length; j++) {
        num += Number(phases[i].items[j].percentage);
      }
    }
    this.allPercentage = num;
    this.resetItemForm();
  }

  addNewPhase() {
    if (this.newPhase.items.length < Number(this.newPhase.amountOfItems)) {
      this.Toastr.error("מספר הפריטים שהוספת קטן יותר מאשר מצוין בפאזה");
    } else {
      // console.log(this.newPhase);
      this.formuleService.addNewPhase(this.newPhase).subscribe((data) => {
        // console.log(data);
        if (data.msg) {
          this.Toastr.error(data.msg);
          console.log(data);
          return;
        } else if (data) {
          this.Toastr.success("פאזה הוקמה בהצלחה");
          this.resetPhaseForm();
          this.currentFormule = data;
          var num = 0;
          for (let i = 0; i < data.phases.length; i++) {
            for (let j = 0; j < data.phases[i].items.length; j++) {
              num += Number(data.phases[i].items[j].percentage);
            }
          }
          this.allPercentage = num;
        } else {
          this.Toastr.error("Operation failed ");
        }
      });
    }
  }

  fillMaterialName(ev) {
    var itemNumber = ev.target.value;
    let idx = this.newPhase.items.findIndex(
      (item) => item.itemNumber == itemNumber
    );
    if (idx > -1) {
      alert("הפריט קיים כבר בפאזה, יש לבחור פריט שונה.");
      this.itemNumber.nativeElement.value = "";
      return;
    }
    if (itemNumber != "buffer" || itemNumber != "") {
      this.chooseFromBuffer = false;
      this.inventoryService
        .getMaterialStockItemByNum(itemNumber)
        .subscribe((data) => {
          this.newItem.itemName = data[0].componentName;
        });
    }
    if (itemNumber == "buffer") {
      this.chooseFromBuffer = true;
    }
  }

  getAllBaseFormules() {
    this.formuleService.getAllBaseFormules().subscribe((data) => {
      this.baseFormules = data;
    });
  }

  getAllFatherFormules() {
    this.formuleService.getAllFathers().subscribe((data) => {
      this.fatherFormules = data;
    });
  }

  edit(itemNumber) {
    if (itemNumber != "") {
      this.EditRowId = itemNumber;
    } else {
      this.EditRowId = "";
    }
  }

  FinishFormule() {
    if (this.allPercentage != 100) {
      if (confirm("כמות האחוזים לא שווה 100 , האם תרצה להמשיך ?")) {
        this.Toastr.success("פורמולה הוקמה בהצלחה !");
        this.formuleAdd = true;
        this.phaseAdd = false;
        this.currentFormule = false;
        this.resetFormuleForm();
        this.allPercentage = null;
        this.allChildren = [];
        this.newPhase.phaseName = "";
      }
    } else {
      this.Toastr.success("פורמולה הוקמה בהצלחה !");
      this.formuleAdd = true;
      this.phaseAdd = false;
      this.currentFormule = false;
      this.resetFormuleForm();
      this.allPercentage = null;
      this.allChildren = [];
      this.newPhase.phaseName = "";
    }
  }
  chosenFather() {
    let fatherNum = this.fatherToRemove.nativeElement.value;
    console.log(fatherNum);
    let father = this.fatherFormules.filter(
      (f) => f.formuleNumber == fatherNum
    );
    console.log(father);
    console.log(father[0].children);
    this.childrenToRemove = [...father[0].children];
  }

  saveEdit(itemNumber, phaseName, index) {
    var phase = this.currentFormule.phases.find(
      (p) => p.phaseName == phaseName
    );
    var item = phase.items.find((i) => i.itemNumber == itemNumber);
    item.percentage = this.updatePercentage.nativeElement.value;

    this.formuleService
      .updatePercentage(this.currentFormule)
      .subscribe((data) => {
        if (data) {
          this.Toastr.success("מספר אחוזים עודכן בהצלחה !");
          this.edit("");
        }
      });
    var phases = this.currentFormule.phases;
    var num = 0;
    for (let i = 0; i < phases.length; i++) {
      for (let j = 0; j < phases[i].items.length; j++) {
        num += Number(phases[i].items[j].percentage);
      }
    }
    this.allPercentage = num;
    // var changeIndex = (Number(this.updateItemsIndex.nativeElement.value)-1)
    // itemNumber
    // var phases = this.currentBaseFormule.phases
    // var phase = phases.find(p=>p.phaseName == phaseName)
    // var items = phase.items

    // var oldItem = items[index]
    // var newItem = items[changeIndex]

    // items[index] = newItem
    // items[changeIndex] = oldItem

    // this.currentBaseFormule;
  }

  resetFormuleForm() {
    this.newFormule.formuleType = "";
    this.newFormule.formuleNumber = "";
    this.newFormule.formuleName = "";
    this.newFormule.formuleCategory = "";
    this.newFormule.phFrom = "";
    this.newFormule.phTo = "";
    this.newFormule.viscoFrom = "";
    this.newFormule.viscoTo = "";
    this.newFormule.impRemarks = "";
  }

  resetItemForm() {
    this.newItem.itemName = "";
    this.newItem.itemNumber = "";
    this.newItem.itemRemarks = "";
    this.newItem.percentage = "";
  }

  resetPhaseForm() {
    this.newPhase.items = [];
    this.newPhase.remarks = "";
    this.newPhase.amountOfItems = "";
  }

  resetChildrenForm() {
    this.allChildren = [];
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}
