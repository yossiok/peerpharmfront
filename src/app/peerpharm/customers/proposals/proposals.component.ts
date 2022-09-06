import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormControlDirective,
  FormGroup,
  FormGroupName,
  Validators,
} from "@angular/forms";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SalesService } from "src/app/services/sales.service";
import { ItemsService } from "src/app/services/items.service";
@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  @Input("allCustomersList") allCustomersList: any[];
  @ViewChild("printBtn2") printBtn2: ElementRef;

  faCoffee = faCoffee;
  user: any;
  authorized: boolean = false;
  userName: string;
  filteredCustomersList: any[] = [];
  currentDate: string = "";
  allUsers: any[] = [];
  allCurrencies: any[] = [];
  currentCustomer: any;
  editContact: number = null;
  editItem: number = null;
  comaxCustomer: any = {};
  obligoDeviated: boolean = false;
  currentPriceList: any[] = [];
  currentProposal: any = null;
  today: Date = new Date();
  loading: boolean = false;
  isUpdated: boolean = false;
  editMode: boolean = false;
  searchMode: boolean = true;
  proposalsList: any = [];
  printView: boolean = false;

  newProposalForm: FormGroup = new FormGroup({
    customerName: new FormControl("", Validators.required),
    customerTaxId: new FormControl(""),
    customerId: new FormControl("", Validators.required),
    agent: new FormControl("", Validators.required),
    customerDetails: new FormControl(""),
    priceList: new FormControl("", Validators.required),
    proposalStatus: new FormControl(""),
    proposalDate: new FormControl(new Date(), Validators.required),
    currency: new FormControl("", Validators.required),
    proposalNumber: new FormControl(null),
    country: new FormControl("", Validators.required),
    shippingAddress: new FormControl(""),
    invoiceAddress: new FormControl(""),
    contacts: new FormArray([]),
    user: new FormControl(""),
    companyNumber: new FormControl(""),
    remark: new FormControl(""),
    items: new FormArray([]),
    customerOrder: new FormControl(""),
    customerTyper: new FormControl(""),
    customerOrderDate: new FormControl(new Date()),
    additions: new FormControl(""),
    paymentTerms: new FormControl(""),
    requestedDate: new FormControl(new Date()),
    orderType: new FormControl("", Validators.required),
    orderNumber: new FormControl(null),
  });

  searchForm: FormGroup = new FormGroup({
    proposalNumber: new FormControl(""),
    user: new FormControl(""),
    customerId: new FormControl(""),
    customerName: new FormControl(),
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
    this.getDate();
    this.getAllUsers();
    this.getCurrencies();
    this.getAllProposals();
    this.searchMode = true;
  }
  getDate() {
    this.today = new Date();
    let today = new Date();
    let currentYear = today.getUTCFullYear();
    let currentMonth = today.getUTCMonth();
    let currentDay = today.getUTCDate();
    currentMonth += currentMonth < 10 ? 1 : null;
    currentDay += currentDay < 10 ? 1 : null;
    this.currentDate = currentYear + "-" + currentMonth + "-" + currentDay;
  }

  get contacts() {
    return this.newProposalForm.controls["contacts"] as FormArray;
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
  get customerOrderDate() {
    return this.newProposalForm.controls["customerOrderDate"];
  }
  get proposalDate() {
    return this.newProposalForm.controls["proposalDate"];
  }
  get orderType() {
    return this.newProposalForm.controls["orderType"];
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("adminPanel");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.allUsers = data.filter((user) =>
        user.authorization.includes("agent")
      );
      console.log(this.allUsers);
    });
  }

  getCurrencies() {
    this.procuremetnService.getCurrencies().subscribe((data) => {
      console.log(data);
      for (let currency in data[0]) {
        if (currency != "_id") {
          // this.allCurrencies.push(`{ ${currency} : ${data[0][currency]} }`);
          this.allCurrencies.push({ name: currency, value: data[0][currency] });
        }
      }
    });
    console.log(this.allCurrencies);
  }

  getAllProposals() {
    this.salesService.getAllProposals().subscribe((data) => {
      if (data.msg) {
        console.log(data);
        this.toastr.error(data.msg);
        return;
      } else if (data) {
        this.proposalsList = data;
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
    this.currentPriceList = [];
    this.currentCustomer = null;
    this.newProposalForm.reset();
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }
    while (this.contacts.length > 0) {
      this.contacts.removeAt(0);
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
    this.currentCustomer = null;
    this.currentPriceList = [];
  }

  showProposal() {
    console.log(this.searchForm);
    this.newProposalForm.reset();
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }
    while (this.contacts.length > 0) {
      this.contacts.removeAt(0);
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
    proposal.customerOrderDate = proposal.customerOrderDate
      ? proposal.customerOrderDate.substr(0, 10)
      : null;
    proposal.requestedDate = proposal.requestedDate
      ? proposal.requestedDate.substr(0, 10)
      : null;

    for (let key in this.newProposalForm.controls) {
      if (key != "contacts" && key != "items") {
        this.newProposalForm.controls[key].setValue(proposal[key]);
      }
    }

    if (proposal.contacts && proposal.contacts.length > 0) {
      for (let contact of proposal.contacts) {
        let contactForm = new FormGroup({
          name: new FormControl(contact.name),
          phone: new FormControl(contact.phone),
          mail: new FormControl(contact.mail),
        });
        this.contacts.push(contactForm);
      }
    }
    if (proposal.items && proposal.items.length > 0) {
      for (let item of proposal.items) {
        let itemForm = new FormGroup({
          itemNumber: new FormControl(item.itemNumber),
          barcode: new FormControl(item.barcode),
          itemName: new FormControl(item.itemName),
          quantity: new FormControl(item.quantity),
          price: new FormControl(item.price),
          discount: new FormControl(item.discount),
          total: new FormControl(item.total),
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

  getCustomerByName() {
    this.currentCustomer = {};
    this.comaxCustomer = {};

    let cusName = this.newProposalForm.controls.customerName.value;
    console.log(cusName);
    this.currentCustomer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });

    if (this.currentCustomer.costumerId == "99999") {
      this.setStockForm();
      return;
    }

    this.salesService
      .getCustomerById(this.currentCustomer.costumerId)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data.ID == this.currentCustomer.costumerId) {
          this.comaxCustomer = data;
          this.setFormData();
          return;
        } else {
          this.toastr.error("Customer wasn't found");
          return;
        }
      });
  }

  setStockForm() {
    this.newProposalForm.reset();
    let proposal = this.newProposalForm.controls;
    let customer = this.currentCustomer;
    proposal.customerId.setValue(customer.costumerId);
    proposal.customerName.setValue(customer.costumerName);
    proposal.currency.setValue(customer.currency);
    proposal.country.setValue(customer.country);
    proposal.remark.setValue(customer.impRemark);
    proposal.priceList.setValue(customer.priceList);
    proposal.shippingAddress.setValue("למחסן חומרי גלם או מוצרים מוגמרים");
    proposal.user.setValue(this.userName);
    return;
  }

  setFormData() {
    let proposal = this.newProposalForm.controls;
    let cmx = this.comaxCustomer;
    this.obligoDeviated = false;
    proposal.customerTaxId.setValue(cmx.TaxID);
    proposal.customerId.setValue(cmx.ID);
    proposal.customerName.setValue(
      cmx.ForeignName ? cmx.ForeignName : cmx.Name
    );
    if (cmx.ForeignCurrency == "true") {
      proposal.country.setValue("abroad");
    } else {
      proposal.country.setValue("israel");
    }
    let currency = "";
    if (cmx.Currency == "ש''ח") {
      currency = "ILS";
    } else if (cmx.Currency == "אירו") {
      currency = "EUR";
    } else if (cmx.Currency == "דולר אמריקאי") {
      currency = "USD";
    } else if ((cmx.Currency = "לירה שטרלינג")) {
      currency = "GBP";
    } else if ((cmx.Currency = "ין יפני")) {
      currency = "JPY";
    } else {
      currency = "";
    }
    proposal.currency.setValue(currency);
    proposal.remark.setValue(cmx.Remark);
    if (+cmx.Obligo - cmx.Balance < 0) {
      this.obligoDeviated = true;
    }
    console.log(this.obligoDeviated);
    proposal.priceList.setValue(this.comaxCustomer.PriceListID);
    proposal.shippingAddress.setValue(this.currentCustomer.delivery);
    proposal.invoiceAddress.setValue(
      cmx.Street +
        " " +
        cmx.Street_No +
        ", " +
        cmx.City +
        cmx.ForeignCity +
        ", " +
        cmx.Zip
    );
    this.newProposalForm.controls.companyNumber.setValue(
      this.currentCustomer.companyNumber
    );

    this.newProposalForm.controls.user.setValue(this.userName);
    console.log(this.newProposalForm.value);
    while (this.contacts.length > 0) {
      this.contacts.removeAt(0);
    }
    for (let contact of this.currentCustomer.contact) {
      let contactForm = new FormGroup({
        name: new FormControl(contact.name),
        mail: new FormControl(contact.mail),
        phone: new FormControl(contact.phone),
      });
      this.contacts.push(contactForm);
    }
    let contactForm = new FormGroup({
      name: new FormControl(cmx.Name),
      mail: new FormControl(cmx.Email),
      phone: new FormControl(cmx.Phone),
    });
    this.contacts.push(contactForm);

    console.log(this.newProposalForm.value);
  }

  getCustomerByNumber() {
    let cusNum = this.newProposalForm.controls.customerId.value;
    let customer = this.allCustomersList.filter(
      (cus) => cus.costumerId == cusNum
    );
    console.log(customer);
    this.currentCustomer = customer[0];
    if (this.currentCustomer.costumerId == "99999") {
      this.setStockForm();
      return;
    }
    this.salesService
      .getCustomerById(this.currentCustomer.costumerId)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastr.error(data.msg);
          return;
        } else if (data.ID == this.currentCustomer.costumerId) {
          this.comaxCustomer = data;
          this.setFormData();
          return;
        } else {
          this.toastr.error("Customer wasn't found");
          return;
        }
      });
  }

  getCustomer() {
    let value = String(this.newProposalForm.controls.value)
      .toLowerCase()
      .trim();
    console.log(value);

    if (value == "") {
      //this.clearOrderItems();
    } else {
      let array = [...this.filteredCustomersList];
      let arrayCopy = [...this.filteredCustomersList];
      this.filteredCustomersList = array.filter((o) =>
        Object.entries(o).some((entry) =>
          String(entry[1]).toLowerCase().includes(value)
        )
      );
    }
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
    if (this.newProposalForm.value.priceList == "0") {
      alert("מחירון לא יכול להיות 0");
      return;
    }
    if (
      this.newProposalForm.value.priceList !=
      this.newProposalForm.value.customerId
    ) {
      let conf = confirm(
        "מספר המחירון שונה ממספר הלקוח, האם אתה בטוח שאתה רוצה להמשיך?"
      );
      if (!conf) {
        return;
      }
    }
    try {
      let leadTime =
        this.newProposalForm.value.orderType == "Make Up" ? 45 : 60;
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
      let customerOrderDate = proposal.customerOrderDate.value
        ? proposal.customerOrderDate.value.substr(0, 10)
        : new Date().toISOString().substring(0, 10);
      proposal.customerOrderDate.setValue(customerOrderDate);
      proposal.proposalStatus.setValue("waiting");

      if (this.newProposalForm.valid) {
        this.currentPriceList = [];
        this.loading = true;
        this.salesService
          .getItemsByPriceList(this.newProposalForm.value.priceList)
          .subscribe((items) => {
            if (items.msg) {
              console.log(items.msg);
              this.toastr.error(items.msg);
            } else if (items.length == 1 && !items[0].price) {
              this.loading = false;
              this.toastr.error(
                "לא נמצאו פריטים למחירון זה, בדוק את המחירון ונסה שוב"
              );
              return;
            } else if (items) {
              console.log(items);
              this.currentPriceList = items;
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
                        this.newProposalForm.controls[key].setValue(
                          proposal[key]
                        );
                      }
                    }
                    while (this.items.length > 0) {
                      this.items.removeAt(0);
                    }
                    while (this.contacts.length > 0) {
                      this.contacts.removeAt(0);
                    }

                    if (proposal.contacts && proposal.contacts.length > 0) {
                      for (let contact of proposal.contacts) {
                        let contactForm = new FormGroup({
                          name: new FormControl(contact.name),
                          phone: new FormControl(contact.phone),
                          mail: new FormControl(contact.mail),
                        });
                        this.contacts.push(contactForm);
                      }
                    }

                    if (proposal.items && proposal.items.length > 0) {
                      for (let item of proposal.items) {
                        let itemForm = new FormGroup({
                          itemNumber: new FormControl(item.itemNumber),
                          barcode: new FormControl(item.barcode),
                          itemName: new FormControl(item.itemName),
                          quantity: new FormControl(item.quantity),
                          price: new FormControl(item.price),
                          discount: new FormControl(item.discount),
                          total: new FormControl(item.total),
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
                      this.proposalsList.splice(
                        idx,
                        1,
                        this.newProposalForm.value
                      );
                    } else {
                      this.proposalsList.push(this.newProposalForm.value);
                    }
                    console.log(this.newProposalForm.controls);
                    console.log(this.newProposalForm.value);
                  }
                });
            } else {
              this.toastr.error("No items were found");
            }
          });
      }
    } catch (error) {
      console.log(error);
      this.toastr.error(error.message);
    }
  }

  resetForm() {
    this.newProposalForm.reset();
  }
  saveContact(i) {
    console.log(this.newProposalForm.value);
    console.log(this.contacts.at(i).value);
    // this.currentProposal.contacts[i] = this.contacts.at(i).value;
    this.editContact = -1;
  }

  clearContact(i) {
    let contactValue = this.contacts.value[i];
    let contactControls = this.contacts.controls[i];
    contactControls.setValue(contactValue);
    // let formContact = new FormGroup({
    //   name: new FormControl(contact.name),
    //   mail: new FormControl(contact.mail),
    //   phone: new FormControl(contact.phone),
    // });
    this.editContact = -1;
    // console.log(contact);
    // this.contacts.setControl(i, formContact);
    // this.contacts.removeAt(i);
    // this.contacts.insert(i, formContact);
    console.log(this.newProposalForm.value);
  }

  removeContact(i) {
    this.contacts.removeAt(i);
  }

  addContact() {
    let contactForm = new FormGroup({
      name: new FormControl(""),
      mail: new FormControl(""),
      phone: new FormControl(""),
    });
    this.contacts.push(contactForm);
    this.editContact = this.contacts.length - 1;
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
      quantity: new FormControl(0),
      price: new FormControl(0),
      discount: new FormControl(0),
      total: new FormControl(0),
      deliveryDate: new FormControl(deliveryDate),
      itemStatus: new FormControl("Waiting for Customer approval"),
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
      let item = this.currentPriceList.find(
        (pl) => pl.itemNumber == formItem.itemNumber
      );
      console.log(item);
      formItem.itemName = item.itemName;
      formItem.price = +item.price;
      formItem.barcode = item.barcode;
      formItem.total =
        +item.price * formItem.quantity -
        (formItem.discount * formItem.price * formItem.quantity) / 100;
      ittem.setValue(formItem);
      // let formI = new FormGroup({
      //   itemNumber: new FormControl(formItem.itemNumber),
      //   itemName: new FormControl(item.itemName),
      //   quantity: new FormControl(formItem.quantity),
      //   price: new FormControl(+item.price),
      //   discount: new FormControl(formItem.discount),
      //   total: new FormControl(formItem.total * +item.price),
      // });
      // // this.items.setControl(i, formI);
      this.items.setControl(i, ittem);
      console.log(this.items);
    });
  }
  getItemByName(i) {
    let itemControls = this.items[i];
    let itemValue = this.items.value[i];
    let item = this.currentPriceList.find(
      (pl) => pl.itemName == itemValue.itemName
    );
    itemValue.itemNumber = item.itemNumber;
    itemValue.price = item.price;
    itemValue.discount = item.discount ? item.discount : 0;
    itemControls.setValue(itemValue);
  }

  saveItem(i) {
    console.log(this.items);

    let itemControls = this.items.controls[i];
    let itemValue = this.items.value[i];
    itemValue.total =
      itemValue.price * itemValue.quantity * (1 - itemValue.discount / 100);
    itemControls.setValue(itemValue);
    this.editItem = -1;
  }
  removeItem(i) {
    this.items.removeAt(i);
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
            proposal.estimatedArrivalDate = proposal.estimatedArrivalDate
              ? proposal.estimatedArrivalDate.substr(0, 10)
              : null;
            proposal.customerOrderDate = proposal.customerOrderDate
              ? proposal.customerOrderDate.substr(0, 10)
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
            while (this.contacts.length > 0) {
              this.contacts.removeAt(0);
            }

            if (proposal.contacts && proposal.contacts.length > 0) {
              for (let contact of proposal.contacts) {
                let contactForm = new FormGroup({
                  name: new FormControl(contact.name),
                  phone: new FormControl(contact.phone),
                  mail: new FormControl(contact.mail),
                });
                this.contacts.push(contactForm);
              }
            }

            if (proposal.items && proposal.items.length > 0) {
              for (let item of proposal.items) {
                let itemForm = new FormGroup({
                  itemNumber: new FormControl(item.itemNumber),
                  barcode: new FormControl(item.barcode),
                  itemName: new FormControl(item.itemName),
                  quantity: new FormControl(item.quantity),
                  price: new FormControl(item.price),
                  discount: new FormControl(item.discount),
                  total: new FormControl(item.total),
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
  resetItems() {
    while (this.items.value.length > 0) {
      this.items.removeAt(0);
    }
  }
  jump() {
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
    if (this.newProposalForm.value.priceList == "0") {
      alert("מחירון לא יכול להיות 0");
      return;
    }
    if (
      this.newProposalForm.value.priceList !=
      this.newProposalForm.value.customerId
    ) {
      let conf = confirm(
        "מספר המחירון שונה ממספר הלקוח, האם אתה בטוח שאתה רוצה להמשיך?"
      );
      if (!conf) {
        return;
      }
    }
    if (!this.newProposalForm.valid) {
      console.log("השלם את הפרטים החסרים");
      return;
    }
    this.currentPriceList = [];
    this.loading = true;

    this.salesService
      .getItemsByPriceList(this.newProposalForm.value.priceList)
      .subscribe((items) => {
        if (items.msg) {
          console.log(items.msg);
          this.toastr.error(items.msg);
        } else if (items.length == 1 && !items[0].price) {
          this.loading = false;
          this.toastr.error(
            "לא נמצאו פריטים למחירון זה, בדוק את המחירון ונסה שוב"
          );
          return;
        } else if (items) {
          console.log(items);
          this.currentPriceList = items;
          this.loading = false;
        }
      });
  }

  findTotalQty() {
    let total = 0;
    for (let item of this.items.value) {
      total += item.quantity;
    }
    return total;
  }
  findSum() {
    let sum = 0;
    for (let item of this.items.value) {
      sum += item.total;
    }
    return sum;
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
