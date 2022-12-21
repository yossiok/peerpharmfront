import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SalesService } from "src/app/services/sales.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";
import { LanguageService } from "src/app/services/language.service";
@Component({
  selector: "app-proposals-list",
  templateUrl: "./proposals-list.component.html",
  styleUrls: ["./proposals-list.component.scss"],
})
export class ProposalsListComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;
  allUsers: any[] = [];
  ordersList: any[] = [];
  ordersListCopy: any[] = [];
  edit: number = -1;
  sortToggle: number = 1;

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UsersService,
    private language: LanguageService,
  ) {}
  @Input("allCustomersList") allCustomersList: any[];

  orderSearchForm: FormGroup = new FormGroup({
    customerName: new FormControl(""),
    customerId: new FormControl(""),
    orderNumber: new FormControl(""),
    orderDateFrom: new FormControl(null),
    orderDateTo: new FormControl(null),
    orderStatus: new FormControl(""),
    agent: new FormControl(""),
    approvalFilter: new FormControl(""),
  });
  ngOnInit(): void {
    this.getUser();
    this.getAllUsers();
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("agent") ||
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("adminPanel");
    console.log(this.user.authorization);
    console.log(this.user.userName);
    console.log(this.authorized);
  }

  get agent() {
    return this.orderSearchForm.controls["agent"];
  }
  get customerId() {
    return this.orderSearchForm.controls["customerId"];
  }
  get customerName() {
    return this.orderSearchForm.controls["customerName"];
  }
  get orderNumber() {
    return this.orderSearchForm.controls["orderNumber"];
  }
  get orderDate() {
    return this.orderSearchForm.controls["orderDate"];
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      console.log(data);

      if (this.user.authorization.includes("adminPanel")) {
        this.allUsers = data.filter((user) =>
          user.authorization.includes("agent")
        );
      } else {
        this.allUsers = data.filter(
          (user) =>
            user.authorization.includes("agent") &&
            user.userName == this.userName
        );
      }
      if (this.user.authorization.includes("newProposal")) {
        this.allUsers.push({
          firstName: "TAPI",
          lastName: "TAPI",
        });
      }
    });
  }

  getCustomerByNumber() {
    let cusNum = this.orderSearchForm.controls.customerId.value;
    let customer = this.allCustomersList.find(
      (cus) => cus.costumerId == cusNum
    );
    console.log(customer);
    if (!customer) {
      this.orderSearchForm.controls.customerName.reset();
      return;
    } else {
      this.orderSearchForm.controls.customerName.setValue(
        customer.costumerName
      );
    }
  }

  getCustomerByName() {
    let cusName = this.orderSearchForm.controls.customerName.value;
    console.log(cusName);
    let customer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });
    if (customer) {
      this.orderSearchForm.controls.customerId.setValue(customer.costumerId);
    }
  }

  searchOrders() {
    console.log(this.orderSearchForm.value);
    this.ordersList = [];
    this.ordersListCopy = [];
    this.salesService
      .getOrdersBySearch(this.orderSearchForm.value)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastr.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          this.ordersList = data;
          this.ordersListCopy = data;
          return;
        }
      });
  }
  clearSearchOrders() {
    this.orderSearchForm.reset();
    this.ordersList = [];
    this.ordersListCopy = [];
  }
  setEdit(i) {
    this.edit = i;
  }
  setStatus(idx, target) {
    this.ordersList[idx].proposalStatus = target.value;
    this.ordersList[idx].proposalStatus = target.value;
    this.edit = -1;
  }
  updateStatus(idx) {
    console.log(this.ordersList[idx]);

    let status = {
      proposalNumber: this.ordersList[idx].proposalNumber,
      proposalStatus: this.ordersList[idx].proposalStatus,
    };

    this.salesService.updateProposalStatus(status).subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.language.error(data.msg);
        return;
      }
      if (data.updatedProposal) {
        this.toastr.success("הזמנה מצד הלקוח עודכנה");
      }

      if (data.updatedOrder) {
        this.toastr.success(
          "הזמנת תפי מספר: " +
            data.updatedOrder.orderNumber +
            "  :עודכנה  " +
            data.updatedOrder.stage
        );
      }
    });
  }
  filterApproved() {
    let filter = this.orderSearchForm.value.approvalFilter;
    if (filter) {
      this.ordersList = this.ordersListCopy.filter(
        (order) => order.proposalStatus == filter
      );
    } else {
      this.ordersList = this.ordersListCopy;
    }
  }

  sortByOrder() {
    this.ordersList = this.ordersList.sort((a, b) =>
      a.orderNumber > b.orderNumber ? this.sortToggle : -this.sortToggle
    );

    this.sortToggle *= -1;
  }
}
