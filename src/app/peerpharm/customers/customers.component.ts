import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CostumersService } from "src/app/services/costumers.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  user: any = {};
  allCustomersList: any[] = [];

  newProposalView: boolean = false;
  proposalsListView: boolean = false;
  customersListView: boolean = false;
  priceListsView: boolean = false;
  stockPropsalView: boolean = false;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private customersService: CostumersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllCustomers();
  }

  getUser() {
    this.user = this.authService.loggedInUser;

    console.log(this.user);
  }
  getAllCustomers() {
    this.customersService.getAllCostumers().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        console.log(data.msg);
        this.toastr.error(data.msg);
        return;
      } else if (data.length > 0) {
        this.allCustomersList = data;
      } else {
        this.toastr.error("לא נמצאו לקוחות המתאימים לחיפוש");
      }
    });
  }

  newProposalMenu() {
    this.newProposalView = true;
    this.proposalsListView = false;
    this.customersListView = false;
    this.priceListsView = false;
    this.stockPropsalView = false;
  }

  proposalsListMenu() {
    this.newProposalView = false;
    this.proposalsListView = true;
    this.customersListView = false;
    this.priceListsView = false;
    this.stockPropsalView = false;
  }

  customersListMenu() {
    this.newProposalView = false;
    this.proposalsListView = false;
    this.customersListView = true;
    this.priceListsView = false;
    this.stockPropsalView = false;
  }
  priceListsMenu() {
    this.newProposalView = false;
    this.proposalsListView = false;
    this.customersListView = false;
    this.priceListsView = true;
    this.stockPropsalView = false;
  }

  stockProposal() {
    this.newProposalView = false;
    this.proposalsListView = false;
    this.customersListView = false;
    this.priceListsView = false;
    this.stockPropsalView = true;
  }
}
