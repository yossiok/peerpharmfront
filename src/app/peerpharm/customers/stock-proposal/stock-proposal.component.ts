import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormControlDirective,
  FormGroup,
  FormGroupName,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SalesService } from "src/app/services/sales.service";
import { ItemsService } from "src/app/services/items.service";
import { ItemIndexComponent } from "../../item-index/item-index.component";

@Component({
  selector: "app-stock-proposal",
  templateUrl: "./stock-proposal.component.html",
  styleUrls: ["./stock-proposal.component.scss"],
})
export class StockProposalComponent implements OnInit {
  @Input("allCustomersList") allCustomersList: any[];
  @ViewChild("printBtn2") printBtn2: ElementRef;

  user: any;
  authorized: boolean = false;
  userName: string;
  currentDate: string = "";
  currentCustomer: any;
  allUsers: any[] = [];
  editContact: number = null;
  editItem: number = null;
  currentProposal: any = null;
  today: Date = new Date();
  loading: boolean = false;
  isUpdated: boolean = false;
  editMode: boolean = false;
  searchMode: boolean = true;
  proposalsList: any = [];
  printView: boolean = false;
  proposalAdded: boolean = false;

  newProposalForm: FormGroup = new FormGroup({
    customerName: new FormControl("Stock", Validators.required),
    customerId: new FormControl("99999", Validators.required),
    customerOrder: new FormControl(""),
    agent: new FormControl("TAPI TAPI"),
    proposalStatus: new FormControl(""),
    proposalDate: new FormControl(new Date(), Validators.required),
    proposalNumber: new FormControl(null),
    user: new FormControl(""),
    remark: new FormControl("הזמנה למלאי בלבד"),
    items: new FormArray([]),
    additions: new FormControl(""),
    requestedDate: new FormControl(new Date()),
    orderType: new FormControl("", Validators.required),
    orderNumber: new FormControl(null),
  });

  searchForm: FormGroup = new FormGroup({
    proposalNumber: new FormControl(""),
    user: new FormControl(""),
    proposalDate: new FormControl(""),
  });

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UsersService,
    private procuremetnService: Procurementservice,
    private salesService: SalesService,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    console.log(this.allCustomersList);
    this.getUser();
    this.getAllUsers();
    this.getAllProposals();
    this.searchMode = true;
    this.setCustomer();
    this.today = new Date();
  }

  get agent() {
    return this.newProposalForm.controls["agent"];
  }
  get customerId() {
    return this.newProposalForm.controls["customerId"];
  }
  get customerName() {
    return this.newProposalForm.controls["customerName"];
  }
  get items() {
    return this.newProposalForm.controls["items"] as FormArray;
  }
  get proposalNumber() {
    return this.newProposalForm.controls["proposalNumber"];
  }
  get proposalDate() {
    return this.newProposalForm.controls["proposalDate"];
  }
  get orderType() {
    return this.newProposalForm.controls["orderType"];
  }

  setCustomer() {
    let stock = {
      customerId: "99999",
      customerNmae: "Stock",
      impRemark: "הזמנה למלאי בלבד",
      priceList: "99999",
    };
    this.newProposalForm.controls.customerId.setValue(stock.customerId);
    this.newProposalForm.controls.customerName.setValue(stock.customerNmae);
    this.currentCustomer = stock;
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("adminPanel");
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.allUsers = data.filter(
        (user) =>
          user.authorization.includes("agent") ||
          user.authorization.includes("newProposal")
      );
      console.log(this.allUsers);
    });
  }
  getAllProposals() {
    this.salesService.getAllStockProposals().subscribe((data) => {
      if (data.msg) {
        console.log(data.msg);
        this.toastr.error(data.msg);
        return;
      } else if (data) {
        this.proposalsList = data;
        console.log(data);
        return;
      }
    });
  }

  editView() {
    if (this.editMode) {
      let conf = confirm(
        "במידה ולא עדכנת את הטופס, הנתונים יימחקו. האם להמשיך?"
      );
      if (!conf) return;
    }
    this.editMode = true;
    this.searchMode = false;
    this.currentProposal = null;
    this.searchForm.reset();
    this.newProposalForm.reset();
    let stock = this.currentCustomer;
    this.newProposalForm.controls.customerId.setValue(stock.customerId);
    this.newProposalForm.controls.customerName.setValue(stock.customerNmae);
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }

    console.log(this.newProposalForm);
    console.log(this.proposalNumber);
  }

  searchView() {
    if (this.editMode) {
      let conf = confirm(
        "במידה ולא עדכנת את הטופס, הנתונים יימחקו. האם להמשיך?"
      );
      if (!conf) return;
    }
    this.editMode = false;
    this.printView = false;
    this.searchMode = true;
    this.currentProposal = null;
    this.searchForm.reset();
  }

  showProposal() {
    console.log(this.searchForm);
    this.newProposalForm.reset();
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }

    this.editMode = true;
    this.searchMode = false;
    let proposal = this.proposalsList.find(
      (pro) => pro.proposalNumber == this.searchForm.value.proposalNumber
    );
    this.currentProposal = proposal;

    proposal.proposalDate = proposal.proposalDate
      ? proposal.proposalDate.substr(0, 10)
      : null;
    proposal.estimatedArrivalDate = proposal.estimatedArrivalDate
      ? proposal.estimatedArrivalDate.substr(0, 10)
      : null;

    proposal.requestedDate = proposal.requestedDate
      ? proposal.requestedDate.substr(0, 10)
      : null;

    for (let key in this.newProposalForm.controls) {
      if (key != "contacts" && key != "items") {
        this.newProposalForm.controls[key].setValue(proposal[key]);
      }
    }
    if (proposal.items && proposal.items.length > 0) {
      for (let item of proposal.items) {
        let itemForm = new FormGroup({
          itemNumber: new FormControl(item.itemNumber),
          barcode: new FormControl(item.barcode),
          itemName: new FormControl(item.itemName),
          netWeightGr: new FormControl(item.netWeightGr),
          quantity: new FormControl(item.quantity),
          totalWeight: new FormControl(item.quantity * item.netWeightGr),
          deliveryDate: new FormControl(item.deliveryDate),
          itemStatus: new FormControl(item.itemStatus),
        });
        this.items.push(itemForm);
      }
    }

    console.log(this.newProposalForm);
    console.log(this.items);
    try {
      // console.log(this.items.value[0].itemNumber);
    } catch (err) {
      console.log(err);
    }
    setTimeout(() => {
      this.currentProposal = proposal;
    }, 500);
    console.log(this.currentProposal);
  }

  createProposal() {
    if (!this.newProposalForm.value.proposalDate) {
      this.newProposalForm.controls.proposalDate.setValue(this.today);
    }

    Object.keys(this.newProposalForm.controls).forEach((key) => {
      const controlErrors = this.newProposalForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          this.toastr.error(key + "  is " + keyError);
          // alert(key + " is " + keyError);
          console.log(
            "Key control: " + key + ", keyError: " + keyError + ", err value: ",
            controlErrors[keyError]
          );
        });
      }
    });

    let leadTime = this.newProposalForm.value.orderType == "Make Up" ? 45 : 60;
    let proposal = this.newProposalForm.controls;
    let proposalDate = proposal.proposalDate.value
      ? proposal.proposalDate.value
      : new Date().toISOString().substring(0, 10);
    proposal.proposalDate.setValue(proposalDate);
    let requestedDate = proposal.requestedDate.value
      ? proposal.requestedDate.value
      : new Date(new Date().setDate(new Date().getDate() + leadTime))
          .toISOString()
          .substring(0, 10);
    proposal.requestedDate.setValue(requestedDate);
    proposal.proposalStatus.setValue("new");

    if (this.newProposalForm.valid) {
      this.loading = true;
      this.salesService
        .addNewProposal(this.newProposalForm.value)
        .subscribe((data) => {
          console.log(data);
          this.loading = false;
          if (data.msg) {
            console.log(data.msg);
            this.toastr.error(data.msg);
            return;
          } else if (data.newProposal && data.newOrder) {
            let proposal = data.newProposal
              ? data.newProposal
              : data.newProposal;

            this.toastr.success(
              "טיוטת הצעת מחיר נשמרה יש להוסיף מוצרים ושרותים להצעה."
            );
            this.currentProposal = proposal;
            if (data.newOrder) {
              this.toastr.success(
                "הזמנה נוצרה/עודכנה: " + data.newOrder.orderNumber
              );
            }

            this.newProposalForm.controls.proposalNumber.setValue(
              proposal.proposalNumber
            );
            this.newProposalForm.controls.orderNumber.setValue(
              proposal.orderNumber
            );

            for (let key in this.newProposalForm.controls) {
              if (key != "contacts" && key != "items") {
                this.newProposalForm.controls[key].setValue(proposal[key]);
              }
            }
            while (this.items.length > 0) {
              this.items.removeAt(0);
            }

            if (proposal.items && proposal.items.length > 0) {
              for (let item of proposal.items) {
                let itemForm = new FormGroup({
                  itemNumber: new FormControl(item.itemNumber),
                  barcode: new FormControl(item.barcode),
                  itemName: new FormControl(item.itemName),
                  netWeightGr: new FormControl(item.netWeightGr),
                  quantity: new FormControl(item.quantity),
                  totalWeight: new FormControl(
                    item.quantity * item.netWeightGr
                  ),
                  deliveryDate: new FormControl(item.deliveryDate),
                  itemStatus: new FormControl(item.itemStatus),
                });
                this.items.push(itemForm);
              }
            }

            let idx = this.proposalsList.findIndex(
              (proposal) =>
                proposal.proposalNumber ==
                this.newProposalForm.value.proposalNumber
            );
            if (idx > -1) {
              this.proposalsList.splice(idx, 1, this.newProposalForm.value);
            } else {
              this.proposalsList.push(this.newProposalForm.value);
            }

            this.proposalAdded = true;
            console.log(this.newProposalForm.controls);
            console.log(this.newProposalForm.value);
          }
        });
    }
  }

  addItem() {
    let deliveryDate = new Date(this.newProposalForm.value.requestedDate)
      .toISOString()
      .substring(0, 10);
    // let leadTime = this.newProposalForm.value.orderType == "Make Up" ? 45 : 60;

    // deliveryDate.setDate(this.today.getDate() + leadTime);
    let itemForm = new FormGroup({
      itemNumber: new FormControl(""),
      barcode: new FormControl(""),
      itemName: new FormControl(""),
      netWeightGr: new FormControl(0),
      quantity: new FormControl(0),
      totalWeight: new FormControl(0),
      deliveryDate: new FormControl(deliveryDate),
      itemStatus: new FormControl("new"),
    });
    this.items.push(itemForm);
    this.editItem = this.items.length - 1;
  }

  getItemName(i) {
    console.log(this.items);
    let ittem = this.items.controls[i];
    console.log(ittem);
    let itemExists = this.items.value.findIndex(
      (oi) => oi.itemNumber == ittem.value.itemNumber
    );
    if (itemExists > -1 && itemExists != i) {
      alert(
        "פריט זה קיים כבר בהזמנה זו, יש לפתוח הזמנה חדשה או לשנות את הכמות בפריט הקיים (לפני שנשלח לבישול!). "
      );
      return;
    }
    this.itemsService.getItemData(ittem.value.itemNumber).subscribe((items) => {
      if (items.length == 0) {
        this.toastr.error("מקט זה לא קיים  במערכת, יש להגדיר עץ מוצר עבורו");
        return;
      }
      console.log(this.items.value[i].itemNumber);
      let formItem = this.items.value[i];
      let item = items[0];
      console.log(item);
      formItem.itemName =
        item.name + " " + item.discriptionK + " " + item.subName;
      formItem.barcode = item.barcodeK ? item.barcodeK : "";
      formItem.netWeightGr = item.netWeightK ? item.netWeightK : item.volumeKey;
      ittem.setValue(formItem);
      this.items.setControl(i, ittem);
      console.log(this.items);
    });
  }

  saveItem(i) {
    // console.log(this.items);

    let itemControls = this.items.controls[i];
    let itemValue = this.items.value[i];
    itemValue.totalWeight = itemValue.quantity * itemValue.netWeightGr;
    itemControls.setValue(itemValue);
    this.editItem = -1;
  }
  removeItem(i) {
    this.items.removeAt(i);
  }

  jump() {
    this.proposalAdded = true;
  }

  updateProposal() {
    console.log(this.currentProposal);
    console.log(this.newProposalForm.value);
    if (this.newProposalForm.value.proposalNumber) {
      this.salesService
        .updateProposal(this.newProposalForm.value)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            console.log(data.msg);
            this.toastr.error(data.msg);
          } else if (data.updatedProposal._id) {
            this.toastr.success("ההזמנה עודכנה בהצלחה");

            let proposal = data.updatedProposal;
            proposal.proposalDate = proposal.proposalDate
              ? proposal.proposalDate.substr(0, 10)
              : null;
            let leadTime = proposal.orderType == "Make Up" ? 45 : 60;
            proposal.requestedDate = proposal.requestedDate
              ? proposal.requestedDate.substr(0, 10)
              : new Date(new Date().setDate(new Date().getDate() + leadTime))
                  .toISOString()
                  .substring(0, 10);

            for (let key in this.newProposalForm.controls) {
              if (key != "contacts" && key != "items") {
                this.newProposalForm.controls[key].setValue(proposal[key]);
              }
            }

            while (this.items.length > 0) {
              this.items.removeAt(0);
            }

            if (proposal.items && proposal.items.length > 0) {
              for (let item of proposal.items) {
                let itemForm = new FormGroup({
                  itemNumber: new FormControl(item.itemNumber),
                  barcode: new FormControl(item.barcode),
                  itemName: new FormControl(item.itemName),
                  netWeightGr: new FormControl(item.netWeightGr),
                  quantity: new FormControl(item.quantity),
                  totalWeight: new FormControl(
                    item.quantity * item.netWeightGr
                  ),
                  deliveryDate: new FormControl(item.deliveryDate),
                  itemStatus: new FormControl(item.itemStatus),
                });
                this.items.push(itemForm);
              }
            }

            let idx = this.proposalsList.findIndex(
              (proposal) =>
                proposal.proposalNumber ==
                this.newProposalForm.value.proposalNumber
            );
            if (idx > -1) {
              this.proposalsList.splice(idx, 1, this.newProposalForm.value);
            } else {
              this.proposalsList.push(this.newProposalForm.value);
            }
            this.currentProposal = this.newProposalForm.value;
            this.isUpdated = true;
            this.printView = true;
            setTimeout(() => this.printBtn2.nativeElement.click(), 500);
          }
        });
    }
  }

  printDisplay() {
    this.printView = true;
    this.editMode = false;
    this.searchMode = true;
  }
  draftView() {
    this.printView = false;
    this.editMode = true;
    this.searchMode = false;
  }
}
