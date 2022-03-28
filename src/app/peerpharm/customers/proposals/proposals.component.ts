import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { getDate } from "date-fns";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";
import { Procurementservice } from "src/app/services/procurement.service";

@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  @Input("allCustomersList") allCustomersList: any[];

  user: any;
  authorized: boolean = false;
  filteredCustomersList: any[] = [];
  currentDate: string = "";
  allUsers: any[] = [];
  allCurrencies: any[] = [];
  currentCustomer: any;

  newProposalForm: FormGroup = new FormGroup({
    customerName: new FormControl("", Validators.required),
    customerNum: new FormControl("", Validators.required),
    agent: new FormControl("", Validators.required),
    customerDetails: new FormControl(""),
    priceList: new FormControl("", Validators.required),
    proposalStatus: new FormControl(""),
    proposalDate: new FormControl(new Date(), Validators.required),
    currency: new FormControl("", Validators.required),
    proposalNumber: new FormControl(null),
    destination: new FormControl("", Validators.required),
  });

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UsersService,
    private procuremetnService: Procurementservice
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
  getUser() {
    this.user = this.authService.loggedInUser;
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
    let cusName = this.newProposalForm.controls.customerName.value;
    console.log(cusName);
    let customer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });
    console.log(customer);
    this.newProposalForm.controls.customerNum.setValue(customer.costumerId);
    console.log(this.newProposalForm.value);
    this.currentCustomer = customer;
    console.log(this.currentCustomer.contact);
  }

  getCustomerByNumber() {
    let cusNum = this.newProposalForm.controls.customerNum.value;
    let customer = this.allCustomersList.filter(
      (cus) => cus.costumerId == cusNum
    );
    console.log(customer);
    this.currentCustomer = customer[0];
    this.newProposalForm.controls.customerName.setValue(
      customer[0].costumerName
    );
    console.log(this.currentCustomer.contact);
    console.log(this.currentCustomer.costumerName);
    console.log(this.currentCustomer.delivery);
    console.log(this.currentCustomer.invoice);
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
  }

  resetForm() {}
}
