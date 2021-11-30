import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormulesService } from "src/app/services/formules.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";
import { RandomColor } from "angular-randomcolor";
import { Currencies } from "../../procurement/Currencies";
import { Procurementservice } from "src/app/services/procurement.service";

@Component({
  selector: "app-all-formules",
  templateUrl: "./all-formules.component.html",
  styleUrls: ["./all-formules.component.scss"],
})
export class AllFormulesComponent implements OnInit {
  currentFormuleNumber: any;
  allFormules: any[];
  allFormulesCopy: any[];
  materials: any[];
  materialsForFormules: any[];
  EditRowId: any = "";
  EditPhase: any = "";
  currentDoc: any;
  currentFormule: any;
  sumFormulePrice: Number;
  formuleMaterialPrices: any[];
  condition: boolean = false;
  updatePriceModal: boolean = false;
  draggable: boolean = false;
  formulePriceModal: boolean = false;
  updateFormule: any;
  quantityCheck: any;
  isCollapsed: boolean = false;
  showItemRemarks: boolean = false;
  closeResult: string;
  updateItems: any;
  currFormulePercentage: number = 0;
  chooseFromBuffer: boolean = false;
  showLoader: boolean = true;
  chooseFathersToUpdate: boolean = false;
  spinnerLoader: boolean = false;
  openFormuleModal: boolean = false;
  showMaterialsForFormules: boolean = false;
  updatePercentage: any;
  // euroRate: number = 3.99;
  // usdRate: number = 3.20;
  // gbpRate: number = 4.35;
  currencies: Currencies;
  newTempPrice: number;
  today: any;
  currMaterial: any;
  updatePhaseRemarks: any;
  updateItemRemarks: any;
  updateItemIndex: any;
  updateBaseToAll: any;
  allParentsFormules: any[];
  allFathersFromBase: any[];
  allChosenFathersToUpdate: any[] = [];
  allChosenChildsToUpdate: any[] = [];
  selectedArr: any[] = [];
  separatedArr: any[] = [];
  user: any;

  addItem = {
    itemNumber: "",
    itemName: "",
    quantity: "",
    quantityUnits: "",
    percentage: "",
    temp: "",
    currentPhase: "",
    formuleId: "",
    phaseId: "",
  };

  newItem = {
    itemName: "",
    itemNumber: "",
    percentage: "",
    remarks: "",
    phaseName: "",
    phaseRemarks: "",
    formuleNumber: "",
  };

  addPhase = {
    phaseNumber: "",
    phaseName: "",
    phaseInstructions: "",
    formuleNumber: "",
  };

  phaseToUpdate = {
    phaseName: "",
    phaseIns: "",
  };

  itemToUpdate = {
    itemNumber: "",
    itemName: "",
    quantity: "",
    quantityUnits: "",
    percentage: "",
    itemPH: "",
    temp: "",
    index: "",
  };

  @ViewChild("formuleNumber") formuleNumber: ElementRef;
  @ViewChild("formuleImpRemarks") formuleImpRemarks: ElementRef;
  @ViewChild("formuleName") formuleName: ElementRef;
  @ViewChild("formuleCategory") formuleCategory: ElementRef;
  @ViewChild("formulePhFrom") formulePhFrom: ElementRef;
  @ViewChild("formulePhTo") formulePhTo: ElementRef;
  @ViewChild("formuleViscoFrom") formuleViscoFrom: ElementRef;
  @ViewChild("formuleViscoTo") formuleViscoTo: ElementRef;
  @ViewChild("formuleClient") formuleClient: ElementRef;
  @ViewChild("formuleLastUpdate") formuleLastUpdate: ElementRef;
  @ViewChild("formuleParent") formuleParent: ElementRef;
  @ViewChild("formulePhaseName") formulePhaseName: ElementRef;
  @ViewChild("formulePhaseIns") formulePhaseIns: ElementRef;
  // @ViewChild('formuleCategory') formuleCategory: ElementRef;

  @ViewChild("phaseRemarksUpdate") phaseRemarksUpdate: ElementRef;
  @ViewChild("percentageUpdate") percentageUpdate: ElementRef;
  @ViewChild("itemRemarksUpdate") itemRemarksUpdate: ElementRef;
  loading: boolean;
  password: string = "martha@2021";
  dragging: boolean = false;
  updatingFormule: boolean = false;
  partialPrice: boolean;

  constructor(
    private invtSer: InventoryService,
    private formuleService: FormulesService,
    private toastSrv: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService,
    private procServ: Procurementservice
  ) {
    this.formuleService.newFormuleAdded.subscribe((data) => {
      if (data) {
        this.allFormules.push(data);
      }
    });
  }

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.edit("", "");
    this.editPhases("");
  }

  ngOnInit() {
    this.getAllFormules();
    this.getAllMaterials();
    this.getAllParentsFormules();
    this.getCurrencies();

    this.today = new Date();
    this.user = this.authService.loggedInUser.userName;
  }

  getAllMaterials() {
    this.invtSer.getAllMaterialsForFormules().subscribe((data) => {
      this.materials = data;
    });
  }

  getAllParentsFormules() {
    this.formuleService.getAllFathers().subscribe((data) => {
      this.allParentsFormules = data;
    });
  }

  getCurrencies() {
    this.procServ.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  addNewItem() {
    this.updateFormule;
    this.addItem.currentPhase = JSON.stringify(this.updateFormule.currentPhase);
    this.addItem.formuleId = this.updateFormule._id;
    var phase = this.updateFormule.phases.filter(
      (phase) => phase.phaseNumber == this.addItem.currentPhase
    );
    this.addItem.phaseId = phase[0]._id;
    this.formuleService.addItem(this.addItem).subscribe((data) => {
      if (data) {
        var allPhases = data.phases;
        var phase = allPhases.filter(
          (phase) => phase._id == this.updateItems.phaseId
        );
        this.updateItems = phase[0].items;
        this.toastSrv.success("Item added successfully");
      }
    });
  }

  addNewPhase() {
    this.formuleService.addPhase(this.addPhase).subscribe((data) => {
      if (data) {
        this.updateFormule.phases = data.phases;
        this.toastSrv.success("Phase added successfully");
      }
    });
  }

  getAllFormules() {
    this.formuleService.getAllFormules().subscribe((data) => {
      if (data) {
        this.allFormules = data;
        this.allFormulesCopy = data;
        this.showLoader = false;
      }
    });
  }

  edit(id, phaseName) {
    if (id != "") {
      this.EditRowId = id;
      this.EditPhase = phaseName;
    } else {
      this.EditRowId = "";
      this.EditPhase = "";
    }
  }

  approveFormule(formule) {
    this.user = this.authService.loggedInUser.userName;
    if (this.user == "martha" || this.user == "sima") {
      if (confirm("האם לאשר פורמולה מספר: " + formule.formuleNumber)) {
        if (prompt("הזיני סיסמא") == this.password) {
          this.formuleService.approveFormule(formule._id).subscribe((data) => {
            if (data) {
              this.toastSrv.success("פורמולה אושרה בהצלחה !");
              formule.approval = 1;
            }
          });
        } else this.toastSrv.error("סיסמא שגויה");
      }
    } else {
      this.toastSrv.error("רק משתמש מורשה רשאי לעדכן זאת");
    }
  }

  editPhases(id) {
    this.EditRowId = id;
    this.updateFormule;
    this.EditRowId = id;
    var formule = this.allFormules.find(
      (formule) => formule._id == this.updateFormule._id
    );
    var results = formule.phases.filter((phase) => phase._id == id);
    this.currentDoc = results;
    var phase = this.updateFormule.phases.find((phase) => phase._id == id);
    this.phaseToUpdate.phaseName = phase.phaseName;
    this.phaseToUpdate.phaseIns = phase.phaseInstructions;
  }

  editItems(itemNumber, index, phaseId) {
    this.updateItems;
    this.EditRowId = itemNumber;
    var formule = this.allFormules.find(
      (formule) => formule._id == this.updateFormule._id
    );
    var results = formule.phases.filter((phase) => phase._id == phaseId);
    this.currentDoc = results[0].items;
    this.currentDoc[0].index = index;
    var phase = this.updateFormule.phases.find((phase) => phase._id == phaseId);
    this.itemToUpdate.itemNumber = phase.items[index].itemNumber;
    this.itemToUpdate.quantity = phase.items[index].quantity;
    this.itemToUpdate.quantityUnits = phase.items[index].quantityUnits;
    this.itemToUpdate.percentage = phase.items[index].percentage;
    this.itemToUpdate.itemPH = phase.items[index].itemPH;
    this.itemToUpdate.temp = phase.items[index].temp;
  }

  copyFormule(formule) {
    if (confirm("האם ברצונך ליצור העתק של הפורמולה?")) {
      let formuleNumber = prompt("אנא הזן מספר פורמולה להעתק:");
      let formuleCopy = { ...formule };
      formuleCopy.formuleNumber = formuleNumber;
      this.formuleService.copyFormule(formuleCopy).subscribe((data) => {
        if (data.msg == "Formule Number Allready Exist")
          this.toastSrv.error("מספר פורמולה קיים במערכת.", "העתקה נכשלה");
        else {
          this.allFormules.push(data);
          this.toastSrv.success("העתק בתחתית הדף.", "פורמולה הועתקה בהצלחה !");
        }
      });
    }
  }

  checkIfFormuleInTest(formuleNumber) {
    return formuleNumber.includes("LPP");
  }

  isSelected(ev, item) {
    if (ev.target.checked == true) {
      var isSelected = this.selectedArr;
      isSelected.push({ ...item });
      this.selectedArr = isSelected;
    }
    if (ev.target.checked == false) {
      var isSelected = this.selectedArr;

      var tempArr = isSelected.filter((x) => x.itemNumber != item.itemNumber);
      this.selectedArr = tempArr;
    }
  }

  saveEdit(currdoc) {
    if (this.formuleName.nativeElement.value != "") {
      if (this.authService.loggedInUser.userName) {
        currdoc.lastUpdateUser = this.authService.loggedInUser.userName;
      }
      if (this.formuleName.nativeElement.value) {
        currdoc.formuleName = this.formuleName.nativeElement.value.trim();
      }
      if (this.formuleNumber.nativeElement.value) {
        currdoc.formuleNumber = this.formuleNumber.nativeElement.value.trim();
      }
      if (this.formulePhFrom.nativeElement.value) {
        currdoc.phFrom = this.formulePhFrom.nativeElement.value.trim();
      }
      if (this.formulePhTo.nativeElement.value) {
        currdoc.phTo = this.formulePhTo.nativeElement.value.trim();
      }
      currdoc.date = this.formatDate(new Date());
      if (this.formuleCategory.nativeElement.value) {
        currdoc.formuleCategory =
          this.formuleCategory.nativeElement.value.trim();
      }
      if (this.formuleImpRemarks.nativeElement.value != null) {
        currdoc.impRemarks = this.formuleImpRemarks.nativeElement.value.trim();
      }
      if (confirm("האם אתה בטוח רוצה לשנות פריטים אלו ?") == true) {
        this.updateDocument(currdoc);
      }
    } else {
      this.toastSrv.error("Can't save changes with missing fields.");
    }
  }

  addItemToFormule() {
    var newPhase = {
      phaseName: "",
      remarks: "",
      formuleId: "",
      items: [],
    };

    var newItem = {
      itemName: "",
      itemNumber: "",
      percentage: "",
      remarks: "",
    };
    let formule;
    this.newItem.formuleNumber = this.currentFormuleNumber;
    this.formuleService
      .getFormuleByNumber(this.currentFormuleNumber)
      .subscribe((data) => {
        formule = data;

        if (formule.formuleType == "father" && formule.children.length > 0) {
          formule.newItem = true;
          const newItem = {
            itemName: this.newItem.itemName,
            itemNumber: this.newItem.itemNumber,
            percentage: this.newItem.percentage,
            remarks: this.newItem.remarks,
          };

          let phase = formule.phases.find(
            (p) => p.phaseName == this.newItem.phaseName
          );
          if (phase) {
            phase.items.push(newItem);
          } else {
            formule.phases.push({
              phaseName: this.newItem.phaseName,
              remarks: this.newItem.phaseRemarks,
              formuleId: formule._id,
              items: [newItem],
            });
          }

          this.chooseFathersToUpdate = true;
          this.updatingFormule = false;
          this.allFathersFromBase = [];
          this.allFathersFromBase[0] = formule;
          this.allChosenChildsToUpdate = formule.children;
          this.updateBaseToAll = {
            formulNumber: formule.formuleNumber,
            newItem: formule.newItem,
            formuleType: formule.formuleType,
            phases: formule.phases,
            _id: formule._id,
          };
        } else {
          this.formuleService
            .addItemToFormule(this.newItem)
            .subscribe((data) => {
              data;
              if (data) {
                var formule = this.allFormules.find((f) => f._id == data._id);
                var phase = formule.phases.find(
                  (p) => p.phaseName == this.newItem.phaseName
                );
                if (phase) {
                  var objToPush = { ...this.newItem };
                  phase.items.push(objToPush);
                  this.toastSrv.success("פריט נוסף בהצלחה!");
                } else {
                  newPhase.formuleId = formule._id;
                  newPhase.phaseName = this.newItem.phaseName;
                  newPhase.remarks = this.newItem.phaseRemarks;
                  newItem.itemName = this.newItem.itemName;
                  newItem.itemNumber = this.newItem.itemNumber;
                  newItem.percentage = this.newItem.percentage;
                  newItem.remarks = this.newItem.remarks;
                  newPhase.items.push(newItem);
                  formule.phases.push(newPhase);
                }

                this.newItem.formuleNumber = "";
                this.newItem.phaseName = "";
                this.newItem.phaseRemarks = "";
                this.newItem.itemName = "";
                this.newItem.itemNumber = "";
                this.newItem.percentage = "";
                this.newItem.remarks = "";
              }
            });
        }
      });
  }

  getMaterialsForFormules() {
    this.selectedArr.forEach((item) => {
      item.quantity = this.quantityCheck;
      this.formuleImpRemarks = item.impRemarks;
    });
    this.invtSer
      .getMaterialsForFormules(this.selectedArr)
      .subscribe((materials) => {
        this.materialsForFormules = materials.newArray;
        this.showMaterialsForFormules = true;
      });
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

  formatNumber(number) {
    number = number.toFixed(4) + "";
    var x = number.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

  filterByMaterial(materialNumber) {
    this.loading = true;
    var tempArr = [];
    if (materialNumber != "") {
      for (let i = 0; i < this.allFormulesCopy.length; i++) {
        for (let j = 0; j < this.allFormulesCopy[i].phases.length; j++) {
          for (
            let k = 0;
            k < this.allFormulesCopy[i].phases[j].items.length;
            k++
          ) {
            if (
              this.allFormulesCopy[i].phases[j].items[k].itemNumber ==
              materialNumber
            ) {
              tempArr.push(this.allFormulesCopy[i]);
            }
          }
        }
      }
      this.allFormules = tempArr;
    } else {
      this.allFormules = this.allFormulesCopy;
    }
    this.loading = false;
  }

  filterByFormule($event) {
    if ($event.target.value.length > 1 || $event.target.value.length == 0) {
      let formuleN = $event.target.value;
      this.allFormules =
        formuleN == ""
          ? this.allFormulesCopy
          : this.allFormulesCopy
              .filter((formule) =>
                formule.formuleNumber.toLowerCase().includes(formuleN)
              )
              .sort((a, b) => a.formuleNumber.length - b.formuleNumber.length);
    }
  }

  filterByName($event) {
    let formuleName = $event.target.value;
    this.allFormules =
      formuleName == ""
        ? this.allFormulesCopy
        : this.allFormulesCopy.filter((formule) =>
            formule.formuleName.toLowerCase().includes(formuleName)
          );
  }

  filterApproved(e) {
    let filterV = e.target.value;
    switch (filterV) {
      case "all":
        this.allFormules = this.allFormulesCopy;
        break;
      case "approved":
        this.allFormules = this.allFormulesCopy.filter((f) => f.approval == 1);
        break;
      case "notApproved":
        this.allFormules = this.allFormulesCopy.filter(
          (f) => f.approval != 1 || !f.approval
        );
        break;
    }
  }

  //TODO: route to item index and present item 
  openIndex(itemNumber) {
    // this.router...
  }

  getFormulePrice(formule) {
    this.partialPrice = false
    this.spinnerLoader = true;
    setTimeout(() => {
      if (this.spinnerLoader) {
        this.spinnerLoader = false;
        this.toastSrv.error("Something went wrong.", "Error");
      }
    }, 1000 * 15);
    this.currentFormule = formule;
    var count = 0;
    this.formuleService.getFormulePrice(formule._id).subscribe((data) => {
      if (data) {
        this.spinnerLoader = false;
        data.forEach((material) => {
          if (material.price == null || material.price == undefined) {
            material.price = "צריך לעדכן מחיר ספק";
            this.partialPrice = true
          } else {
            if (
              material.price != "צריך לעדכן מחיר ספק" &&
              material.price != "מטבע לא עודכן ברכישה האחרונה" &&
              material.price != "Material Not Found!" &&
              material.price != "Something went wrong please check"
            ) {
              material.price = this.formatNumber(material.price);
            }
          }
          if (
            material.price != "צריך לעדכן מחיר ספק" &&
            material.price != "מטבע לא עודכן ברכישה האחרונה" &&
            material.price != "Material Not Found!"
          ) {
            count += Number(material.price);
          }
        });
        this.sumFormulePrice = Number(this.formatNumber(count));
        this.formuleMaterialPrices = data;
        this.formulePriceModal = true;
      }
    });
  }

  navigateToInventory(componentN) {
    window.open(
      "http://peerpharmsystem.com/#/peerpharm/inventory/stock?componentN=" +
        componentN
    );
  }

  savePhaseEdit(currDoc) {
    if (this.phaseToUpdate.phaseName != "") {
      this.currentDoc[0].phaseName = this.phaseToUpdate.phaseName;
      this.currentDoc[0].phaseInstructions = this.phaseToUpdate.phaseIns;
      if (confirm("האם אתה בטוח שאתה רוצה לשנות פריטים אלו ?") == true) {
        this.updatePhase();
      }
    } else {
      this.toastSrv.error("Can't save changes with missing fields.");
    }
  }

  openUpdateTempPriceModal(material) {
    this.updatePriceModal = true;
    this.currMaterial = material;
  }

  updateTempPrice() {
    this.currMaterial;
    let material = this.formuleMaterialPrices.find(
      (m) => m.itemNumber == this.currMaterial.itemNumber
    );
    material.price =
      (Number(this.newTempPrice) * Number(material.percentage)) / 100;
    this.sumFormulePrice = this.sumFormulePrice + material.price;
    this.updatePriceModal = false;
  }

  saveItemEdit(currDoc, index) {
    this.currentDoc;
    if (this.itemToUpdate.itemNumber != "") {
      this.currentDoc[index].index = index;
      this.currentDoc[index].itemName = this.itemToUpdate.itemName;
      this.currentDoc[index].itemNumber = this.itemToUpdate.itemNumber;
      this.currentDoc[index].percentage = this.itemToUpdate.percentage;
      this.currentDoc[index].quantity = this.itemToUpdate.quantity;
      this.currentDoc[index].quantityUnits = this.itemToUpdate.quantityUnits;
      this.currentDoc[index].temp = this.itemToUpdate.temp;
      if (confirm("האם אתה בטוח שאתה רוצה לשנות פריטים אלו ?") == true) {
        this.updatePhaseItems(index);
      }
    } else {
      this.toastSrv.error("Can't save changes with missing fields.");
    }
  }

  updatePhase() {
    this.formuleService
      .updateFormulePhaseId(this.currentDoc)
      .subscribe((data) => {
        this.EditRowId = "";
        this.toastSrv.success("Details were successfully saved");
        this.phaseToUpdate.phaseName = "";
        this.phaseToUpdate.phaseIns = "";
      });
  }

  updatePhaseItems(index) {
    this.formuleService
      .updateFormulePhaseItems(this.currentDoc[index])
      .subscribe((data) => {
        this.EditRowId = "";
        this.toastSrv.success("Details were successfully saved");
        this.getAllFormules();
      });
  }

  updateDocument(currdoc) {
    this.formuleService.updateFormulesForm(currdoc).subscribe((data) => {
      this.allFormules.map((doc) => {
        if (doc._id == currdoc._id) {
          doc = data;
        }
      });
      this.allFormulesCopy.map((doc) => {
        if (doc._id == currdoc._id) {
          doc = data;
        }
      });
      this.EditRowId = "";
      this.toastSrv.success("Details were successfully saved");
    });
  }

  openPrint(printFormule, formuleNum) {
    this.updateFormule = [];
    this.modalService
      .open(printFormule, { size: "lg", ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.loadDataPrint(formuleNum);
  }

  fillMaterialName(ev) {
    var itemNumber = ev.target.value;
    if (itemNumber != "buffer" || itemNumber != "") {
      this.chooseFromBuffer = false;
      this.invtSer.getMaterialStockItemByNum(itemNumber).subscribe((data) => {
        this.newItem.itemName = data[0].componentName;
      });
    }
    if (itemNumber == "buffer") {
      this.chooseFromBuffer = true;
    }
  }

  fillMaterialNumber(ev) {
    var materialName = ev.target.value;
    var material = this.materials.find((m) =>
      m.componentName.includes(materialName)
    );
    this.newItem.itemNumber = material.componentN;
  }

  loadDataPrint(formuleNum) {
    var formuleToUpdate = [];
    formuleToUpdate = this.allFormules.find(
      (formule) => formule.formuleNumber == formuleNum
    );
    this.updateFormule = formuleToUpdate;
    for (let i = 0; i < this.updateFormule.phases.length; i++) {
      for (let j = 0; j < this.updateFormule.phases[i].items.length; j++) {
        if (this.updateFormule.phases[i].items[j].itemNumber == "12550") {
          this.showItemRemarks = true;
        }
      }
    }
  }

  percentageCheck(percentage) {
    if (percentage != 100) {
      return "redPercentage";
    } else {
      return "greenPercentage";
    }
  }

  open(formuleNum) {
    this.updateFormule = [];
    this.openFormuleModal = true;
    this.currFormulePercentage = 0;
    this.loadData(formuleNum);
  }

  phaseColor(phase) {
    switch (phase) {
      case "A":
        return "#e2e889";
      case "B":
        return "#a4b9eb";
      case "C":
        return "#abedac";
      case "D":
        return "#f0b4d9";
      case "E":
        return "#d1c3eb";
    }
  }

  saveFormuleFormation() {
    this.draggable = false;
    console.log(this.currentFormuleNumber);
    this.formuleService
      .getFormuleByNumber(this.currentFormuleNumber)
      .subscribe((data) => {
        console.log(data);
        if (data.formuleType == "father" && data.children.length > 0) {
          this.chooseFathersToUpdate = true;
          this.allChosenChildsToUpdate = data.children;
          this.updatingFormule = false;
          this.allFathersFromBase = [];
          this.allFathersFromBase[0] = data;
          this.updateBaseToAll = this.updateFormule;
          this.updateBaseToAll.newPhases = true;
        } else {
          this.formuleService
            .updateFormuleFormation(this.updateFormule)
            .subscribe((data) => {
              if (data) {
                this.toastSrv.success("פורמולה עודכנה בהצלחה !");
              } else {
                this.toastSrv.error("משהו השתבש, בדוק את הפורמולות.");
              }
            });
        }
      });
  }

  saveFormuleUpdate(formuleId, itemNumber, phaseName, index) {
    this.updatingFormule = true;
    var formuleData = {
      formuleId: formuleId,
      formuleNumber: this.currentFormuleNumber,
      itemNumber: itemNumber,
      phaseName: phaseName,
      index: index,
      percentage: Number(this.percentageUpdate.nativeElement.value),
      itemRemarks: this.itemRemarksUpdate.nativeElement.value,
      phaseRemarks: this.phaseRemarksUpdate.nativeElement.value,
      updateFather: "",
      updateChildren: "",
    };
    this.updateBaseToAll = formuleData;
    if (this.currentFormuleNumber)
      // this.formuleService
      //   .getAllMadeFromBase(this.currentFormuleNumber)
      //   .subscribe((data) => {
      this.formuleService
        .getFormuleByNumber(this.currentFormuleNumber)
        .subscribe((data) => {
          if (data.formuleType == "father") {
            this.chooseFathersToUpdate = true;
            this.updatingFormule = false;
            this.allFathersFromBase = [];
            this.allFathersFromBase[0] = data;
            this.allChosenChildsToUpdate = data.children;
          } else {
            this.formuleService.updateFormule(formuleData).subscribe((data) => {
              if (data) {
                this.updatingFormule = false;
                var formule = this.allFormules.find(
                  (f) => f.formuleNumber == data.formuleNumber
                );
                var phase = formule.phases.find(
                  (p) => p.phaseName == phaseName
                );
                var item = phase.items.find((i) => i.itemNumber == itemNumber);
                item.itemRemarks = this.itemRemarksUpdate.nativeElement.value;
                item.phaseRemarks = this.phaseRemarksUpdate.nativeElement.value;
                item.remarks = this.itemRemarksUpdate.nativeElement.value;
                item.percentage = Number(
                  this.percentageUpdate.nativeElement.value
                );
                this.toastSrv.success("עודכן בהצלחה !");
                this.edit("", "");
              } else {
              }
            });
          }
        });
  }

  updateAllFromBase() {
    if (this.separatedArr.length > 0) {
      console.log(this.separatedArr);
      let objReq = {
        parentNumber: this.currentFormuleNumber,
        children: this.separatedArr,
      };
      let isConfirmed = confirm(
        "You are aboute to separte a child formule from its parent. As a result the child will turn to regular formule and will not have any connection to this parent. Do you want to proceed?"
      );
      if (isConfirmed) {
        this.formuleService
          .separateChildFromParent(objReq)
          .subscribe((data) => {
            console.log(data);
            if (data.msg) {
              this.toastSrv.warning("msg");
            } else {
              let index = this.allFormules.find((f) => {
                f.formuleNumber == data.formuleNumber;
              });
              if (index) {
                this.allFormules[index].children = data.children;
                this.toastSrv.success(
                  "The children separation from parent succeeded!"
                );
              } else {
                this.toastSrv.warning("Parent formule wasn't found");
              }

              this.allFormulesCopy = this.allFormulesCopy;
            }
          });
      }
    }

    this.updateBaseToAll.updateChildren = this.allChosenChildsToUpdate;
    this.updateBaseToAll.updateFather = this.allChosenFathersToUpdate;
    if (this.updateBaseToAll.newPhases) {
      this.formuleService
        .addItemToFormule(this.updateBaseToAll)
        .subscribe((data) => {
          if (data.ok == 1) {
            this.toastSrv.success("הפורמולות עודכנו בהצלחה !");
            this.chooseFathersToUpdate = false;
          } else {
            this.toastSrv.error("משהו השתבש, בדוק שינויים");
            this.chooseFathersToUpdate = false;
          }
        });
    } else if (this.updateBaseToAll.newItem) {
      let newPhase = {
        phaseName: "",
        remarks: "",
        formuleId: "",
        items: [],
      };

      let newItem = {
        itemName: "",
        itemNumber: "",
        percentage: "",
        remarks: "",
      };
      this.formuleService
        .addItemToFormule(this.updateBaseToAll)
        .subscribe((data) => {
          if (data.ok == 1) {
            this.chooseFathersToUpdate = false;
            var formule = this.allFormules.find(
              (f) => f._id == this.updateBaseToAll._id
            );
            var phase = formule.phases.find(
              (p) => p.phaseName == this.newItem.phaseName
            );
            if (phase) {
              var objToPush = { ...this.newItem };
              phase.items.push(objToPush);
              this.toastSrv.success("פריט נוסף בהצלחה!");
            } else {
              newPhase.formuleId = formule._id;
              newPhase.phaseName = this.newItem.phaseName;
              newPhase.remarks = this.newItem.phaseRemarks;
              newItem.itemName = this.newItem.itemName;
              newItem.itemNumber = this.newItem.itemNumber;
              newItem.percentage = this.newItem.percentage;
              newItem.remarks = this.newItem.remarks;
              newPhase.items.push(newItem);
              formule.phases.push(newPhase);
            }

            this.newItem.formuleNumber = "";
            this.newItem.phaseName = "";
            this.newItem.phaseRemarks = "";
            this.newItem.itemName = "";
            this.newItem.itemNumber = "";
            this.newItem.percentage = "";
            this.newItem.remarks = "";
          } else {
            console.log("Something went Wrong");
          }
        });
    } else {
      this.formuleService
        .updateFormuleData(this.updateBaseToAll)
        .subscribe((data) => {
          var formule = this.allFormules.find(
            (f) => f.formuleNumber == data.formuleNumber
          );
          var phase = formule.phases.find((p) => p.phaseName == data.phaseName);
          var item = phase.items.find((i) => i.itemNumber == data.itemNumber);
          item.itemRemarks = this.itemRemarksUpdate.nativeElement.value;
          item.phaseRemarks = this.phaseRemarksUpdate.nativeElement.value;
          item.remarks = this.itemRemarksUpdate.nativeElement.value;
          item.percentage = Number(this.percentageUpdate.nativeElement.value);

          this.chooseFathersToUpdate = false;
          this.updateBaseToAll.updateChildren = "";
          this.updateBaseToAll.updateFather = "";
          this.toastSrv.success("פריט עודכן בהצלחה!");
          this.EditRowId = "";
          this.updatePercentage = "";
          this.updateItemRemarks = "";
          this.updatePhaseRemarks = "";
        });
    }
  }

  loadData(formuleNum) {
    this.currentFormuleNumber = formuleNum;
    var formuleToUpdate;
    formuleToUpdate = this.allFormules.find(
      (formule) => formule.formuleNumber == formuleNum
    );
    // calculate the total percentage of the formule
    formuleToUpdate.phases.forEach((phase) => {
      phase.items.forEach((item) => {
        this.currFormulePercentage += Number(item.percentage);
      });
    });
    this.updateFormule = formuleToUpdate;
  }

  deleteItemFromFormule(itemNumber, ii, jj) {
    let formuleNumber = this.currentFormuleNumber;
    let formule = this.allFormules.find(
      (f) => f.formuleNumber == formuleNumber
    );
    let phases = formule.phases;
    for (let i = 0; i < phases.length; i++) {
      for (let j = 0; j < phases[i].items.length; j++) {
        if (phases[i].items[j].itemNumber == itemNumber && i == ii && j == jj) {
          phases[i].items.splice(j, 1);
        }
      }
    }
    this.toastSrv.warning("In order to save all changes", "Press 'Save'!");
  }

  deleteFormule(id) {
    if (confirm("האם אתה בטוח שאתה רוצה למחוק פורמולה זו ?")) {
      if (prompt("הזיני סיסמא") == this.password) {
        this.formuleService.deleteFormuleById({ id }).subscribe((data) => {
          console.log(data);
          if (data.msg) {
            console.log(data);
            this.toastSrv.error(data.msg);
          } else if (data) {
            this.allFormules = this.allFormules.filter(
              (f) => f._id != data._id
            );
            this.toastSrv.success("פורמולה נמחקה בהצלחה !");
          } else {
            this.toastSrv.error("Operation failed");
          }
        });
      }
    }
  }

  deletePhase(phaseId) {
    if (confirm("למחוק פאזה?")) {
      var formuleId = this.updateFormule._id;
      var phaseToDelete = {
        phaseId: phaseId,
        formuleId: formuleId,
      };
      this.formuleService.deletePhaseById(phaseToDelete).subscribe((data) => {
        this.updateFormule.phases = data.phases;
      });
    }
  }

  deleteItem(itemNumber, index, phaseId) {
    if (confirm("למחוק חומר " + itemNumber + "?")) {
      var formuleId = this.updateFormule._id;
      var itemToDelete = {
        index: index,
        itemNumber: itemNumber,
        phaseId: phaseId,
        formuleId: formuleId,
      };
      this.formuleService.deleteItemById(itemToDelete).subscribe((data) => {
        var phase = data.phases.filter((phase) => phase._id == phaseId);
        this.updateItems = phase[0].items;
      });
    }
  }

  openItem(itemData, phaseNumber) {
    this.modalService
      .open(itemData, { size: "lg", ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.loadItemData(phaseNumber);
  }

  loadItemData(phaseNumber) {
    let details = this.updateFormule.phases.find(
      (phase) => phase.phaseNumber == phaseNumber
    );
    this.updateItems = details.items;
    this.updateItems.phaseId = details._id;
    this.updateFormule.currentPhase = phaseNumber;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  fillTheMaterialNumber(ev) {
    let componentName = ev.target.value;
    let details = this.materials.filter(
      (x) => x.componentName == componentName
    );
    this.addItem.itemNumber = details[0].componentN;
  }

  updateFormuleWhenPrint() {
    let user = this.authService.loggedInUser.userName;
    let updatedFormule = {
      _id: this.updateFormule._id,
      client: user,
    };
    this.formuleService
      .updateFormuleWhenPrint(updatedFormule)
      .subscribe((data) => {
        console.log(data);
      });
  }

  searchMaterialNumber(ev) {
    let materialNumber = ev.target.value;

    let details = this.materials.filter(
      (material) => material.componentN == materialNumber
    );
    this.addItem.itemName = details[0].componentName;
  }

  choseToUpdate(ev, father) {
    if (ev.target.checked == true) {
      var isSelected = this.allChosenFathersToUpdate;
      isSelected.push(father);
      this.allChosenFathersToUpdate = isSelected;
    }

    if (ev.target.checked == false) {
      var isSelected = this.allChosenFathersToUpdate;
      var tempArr = isSelected.filter(
        (x) => x.formuleNumber != father.formuleNumber
      );
      this.allChosenFathersToUpdate = tempArr;
    }
  }

  choseChildToUpdate(ev, child) {
    console.log("entering chose function");
    console.log(ev);
    console.log(child);
    console.log(this.allChosenChildsToUpdate);
    console.log(this.separatedArr);
    if (ev.target.checked == true) {
      var isSelected = this.allChosenChildsToUpdate;
      isSelected.push(child);
      this.allChosenChildsToUpdate = isSelected;
      let index = this.separatedArr.findIndex(
        (i) => i.childNumber == child.childNumber
      );
      this.separatedArr.splice(index, 1);
    }

    if (ev.target.checked == false) {
      var isSelected = this.allChosenChildsToUpdate;
      var tempArr = isSelected.filter(
        (x) => x.childNumber != child.childNumber
      );
      this.allChosenChildsToUpdate = tempArr;
      this.separatedArr.push({ child });
    }
    console.log(this.separatedArr);
    console.log(this.allChosenChildsToUpdate);
  }

  /****************DRAG DROP FUNCS************/

  draggingStatus() {
    if (this.draggable) {
      if (this.dragging) return "wait";
      else return "move";
    } else return "";
  }

  startItemDrag(ev) {
    this.dragging = true;
    ev.dataTransfer.setData(
      "Text/html",
      ev.target.dataset.phase + ";" + ev.target.dataset.itemnumber
    );
  }

  startShakeDragOver(ev) {
    ev.preventDefault();
  }
  stopItemDrag(ev) {
    this.dragging = false;
    // this.stopAllShakes();
  }
  stopAllShakes() {
    // let allShakes = document.getElementsByClassName("shakeme");
    // let allShakeslength = allShakes.length
    // for (let i = 0; i < allShakeslength; i++) {
    //   if (allShakes[i])
    //     allShakes[i].classList.remove("shakeme");
    // }
  }

  getDroppedElemnt(ev) {
    // this.stopAllShakes();

    this.dragging = false;
    var data = ev.dataTransfer.getData("text/html");
    let dataArr = data.split(";");
    let droppedPhase = dataArr[0];
    let droppedItemNum = dataArr[1];

    let droppedIntoPhase = ev.target.parentElement.dataset.phase;
    let droppedIntoItemNum = ev.target.parentElement.dataset.itemnumber;
    //remove from old phase
    let itemToaddToNewPhase = this.updateFormule.phases
      .find((x) => x.phaseName == droppedPhase)
      .items.find((a) => a.itemNumber == droppedItemNum);
    this.updateFormule.phases.find((x) => x.phaseName == droppedPhase).items =
      this.updateFormule.phases
        .find((x) => x.phaseName == droppedPhase)
        .items.filter((a) => a.itemNumber != droppedItemNum);

    //find update to phase:
    let droppedIndex = this.updateFormule.phases
      .find((x) => x.phaseName == droppedIntoPhase)
      .items.findIndex((a) => a.itemNumber == droppedIntoItemNum);
    this.updateFormule.phases
      .find((x) => x.phaseName == droppedIntoPhase)
      .items.splice(droppedIndex, 0, itemToaddToNewPhase);

    this.toastSrv.warning("In order to save all changes", "Press 'Save'!");
    setTimeout(() => {
      this.stopAllShakes();
    }, 500);
  }
}
