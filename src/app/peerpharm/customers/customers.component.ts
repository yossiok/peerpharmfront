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
      this.allCustomersList = data;
    });
  }

  newProposalMenu() {
    this.newProposalView = true;
    this.proposalsListView = false;
    this.customersListView = false;
    this.priceListsView = false;
  }

  proposalsListMenu() {
    this.newProposalView = false;
    this.proposalsListView = true;
    this.customersListView = false;
    this.priceListsView = false;
  }

  customersListMenu() {
    this.newProposalView = false;
    this.proposalsListView = false;
    this.customersListView = true;
    this.priceListsView = false;
  }
  priceListsMenu() {
    this.newProposalView = false;
    this.proposalsListView = false;
    this.customersListView = false;
    this.priceListsView = true;
  }

  emptyMenu() {}
}
