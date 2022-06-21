import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from "@angular/forms";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { getDate } from "date-fns";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";
import { Procurementservice } from "src/app/services/procurement.service";
import { SalesService } from "src/app/services/sales.service";
@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  @Input("allCustomersList") allCustomersList: any[];

  faCoffee = faCoffee;
  user: any;
  authorized: boolean = false;
  userName: String;
  filteredCustomersList: any[] = [];
  currentDate: string = "";
  allUsers: any[] = [];
  allCurrencies: any[] = [];
  currentCustomer: any;
  editContact: number = null;
  comaxCustomer: any = {};

  newProposalForm: FormGroup = new FormGroup({
    customerName: new FormControl("", Validators.required),
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
  });

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UsersService,
    private procuremetnService: Procurementservice,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    console.log(this.allCustomersList);
    this.getUser();
    this.getDate();
    this.getAllUsers();
    this.getCurrencies();
  }
  getDate() {
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

  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized = this.user.authorization.includes("newProposal");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      console.log(data);
      this.allUsers = data;
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

  getCustomerByName() {
    this.currentCustomer = {};
    this.comaxCustomer = {};

    let cusName = this.newProposalForm.controls.customerName.value;
    console.log(cusName);
    this.currentCustomer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });
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

  setFormData() {
    let proposal = this.newProposalForm.controls;
    let cmx = this.comaxCustomer;
    proposal.customerId.setValue(cmx.ID);
    proposal.customerName.setValue(
      cmx.ForeignName ? cmx.ForeignName : cmx.Name
    );
    proposal.priceList.setValue(this.comaxCustomer.PriceListID);
    proposal.shippingAddress.setValue(this.currentCustomer.delivery);
    proposal.invoiceAddress.setValue(
      cmx.Street + " " + cmx.Street_No + ", " + cmx.City + ", " + cmx.Zip
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
    console.log(this.newProposalForm.value);
    console.log(this.newProposalForm.controls);
    console.log(this.currentCustomer.contact);
    if (this.newProposalForm.valid) {
      this.salesService
        .addNewProposal(this.newProposalForm.value)
        .subscribe((data) => {
          console.log(data);
          if (data.msg) {
            console.log(data.msg);
            this.toastr.error(data.msg);
            return;
          } else if (data) {
            this.toastr.success(
              "טיוטת הצעת מחיר נשמרה יש להוסיף מוצרים ושרותים להצעה."
            );
          }
        });
    }
  }

  resetForm() {
    this.newProposalForm.reset();
  }
  saveContact(i) {
    // console.log(this.newProposalForm.value);
    // console.log(this.contacts.at(i).value);
    this.currentCustomer.contact[i] = this.contacts.at(i).value;
    this.editContact = -1;
  }
  clearContact(i) {
    let contact = this.currentCustomer.contact[i];
    let formContact = new FormGroup({
      name: new FormControl(contact.name),
      mail: new FormControl(contact.mail),
      phone: new FormControl(contact.phone),
    });
    this.editContact = -1;
    console.log(contact);
    this.contacts.setControl(i, formContact);
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
}
