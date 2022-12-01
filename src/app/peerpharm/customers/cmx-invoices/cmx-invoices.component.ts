import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SalesService } from "src/app/services/sales.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-cmx-invoices",
  templateUrl: "./cmx-invoices.component.html",
  styleUrls: ["./cmx-invoices.component.scss"],
})
export class CmxInvoicesComponent implements OnInit {
  user: any = null;
  userName: string = "";
  authorized: boolean = false;
  allUsers: any[] = [];
  invoicesList: any[] = [];
  invoicesListCopy: any[] = [];
  toggleSort: number = 1;
  invoiceView: boolean = false;
  chosenInvoice: any = null;
  summationObj: any = {};
  agentsList: any[] = [];
  loading: boolean = false;

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UsersService
  ) {}

  @Input("allCustomersList") allCustomersList: any[];

  invoicesSearchForm: FormGroup = new FormGroup({
    customerName: new FormControl(""),
    customerId: new FormControl(""),
    invoiceNumber: new FormControl(""),
    invoiceDateFrom: new FormControl(null),
    invoiceDateTo: new FormControl(null),
    agentId: new FormControl(""),
    packingListId: new FormControl(null),
    orderNumber: new FormControl(""),
    itemNumber: new FormControl(""),
  });

  ngOnInit(): void {
    this.getUser();
    this.getAllUsers();
    this.getAllAgents();
    // console.log(this.allCustomersList);
  }
  getUser() {
    this.user = this.authService.loggedInUser;
    this.userName = this.user.userName;
    this.authorized =
      this.user.authorization.includes("agent") ||
      this.user.authorization.includes("newProposal") ||
      this.user.authorization.includes("adminPanel");
    // console.log(this.user.authorization);
    // console.log(this.user.userName);
    // console.log(this.authorized);
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

  getAllAgents() {
    this.salesService.getAllCmxAgents().subscribe((data) => {
      if (data && data.msg) {
        this.toastr.error(data.msg);
        return;
      }
      if (data && data.length > 0) {
        this.agentsList = data;
      }
    });
  }

  getCustomerByNumber() {
    let cusNum = this.invoicesSearchForm.controls.customerId.value;
    let customer = this.allCustomersList.find(
      (cus) => cus.costumerId == cusNum
    );
    console.log(customer);
    if (!customer) {
      this.invoicesSearchForm.controls.customerName.reset();
      return;
    } else {
      this.invoicesSearchForm.controls.customerName.setValue(
        customer.costumerName
      );
    }
  }

  getCustomerByName() {
    let cusName = this.invoicesSearchForm.controls.customerName.value;
    console.log(cusName);
    let customer = this.allCustomersList.find((cus) => {
      return cus.costumerName == cusName;
    });
    if (customer) {
      this.invoicesSearchForm.controls.customerId.setValue(customer.costumerId);
    }
  }
  searchInvoices() {
    console.log(this.invoicesSearchForm.value);
    this.invoicesList = [];
    this.invoicesListCopy = [];
    this.loading = true;
    this.salesService
      .getInvoicesBySearch(this.invoicesSearchForm.value)
      .subscribe((data) => {
        this.loading = false;
        console.log(data);
        if (data.msg) {
          console.log(data.msg);
          this.toastr.error(data.msg);
          return;
        } else if (data && data.length > 0) {
          this.invoicesList = data;
          this.invoicesListCopy = data;
          return;
        } else if (data && data.length == 0) {
          this.toastr.warning("There are no invoices for this search");
          this.toastr.warning("לא נמצאו חשבוניות המתאימות לחיפוש");
        }
      });
  }
  clearSearchInvoices() {
    this.invoicesSearchForm.reset();
    this.invoicesList = [];
    this.invoicesListCopy = [];
  }
  sortByInvoice() {
    this.invoicesList = this.invoicesList.sort((a: any, b: any) => {
      return a.invoiceNumber > b.invoiceNumber
        ? this.toggleSort
        : a.invoiceNumber < b.invoiceNumber
        ? -this.toggleSort
        : 0;
    });

    this.toggleSort *= -1;
  }

  openInvoice(i) {
    console.log("Line number: " + i);
    this.chosenInvoice = this.invoicesList[i];
    this.summationObj.grandTotal = 0;
    this.summationObj.totalSum = 0;
    this.summationObj.totalSumBeforeVat = 0;
    this.summationObj.vat = 0;
    this.summationObj.totalSumWithVat = 0;
    for (let item of this.chosenInvoice.items) {
      this.summationObj.grandTotal += item.itemQty;
      this.summationObj.totalSum += item.itemPrice * item.itemQty;
      this.summationObj.totalSumBeforeVat += item.totalPrice;
      this.summationObj.totalSumWithVat += item.totalPriceVat;
    }

    this.invoiceView = true;
  }

  syncComaxLastDay() {
    if (!confirm(" פעולה זו נמשכת דקה או יותר, האם להמשיך? ")) {
      return;
    }
    this.salesService.syncLastDayInvoices().subscribe((data) => {
      console.log(data);
      if (data && data.msg) {
        this.toastr.error(data.msg);
        return;
      }
      if (
        data &&
        data.updatedCmxInvoices &&
        data.updatedCmxInvoices.length > 0
      ) {
        this.toastr.success(
          `${data.updatedCmxInvoices.length} invoices updated`
        );
      }
      if (data && data.newCmxInvoices && data.newCmxInvoices.length > 0) {
        this.toastr.success(
          `${data.newCmxInvoices.length} new invoices created`
        );
      }
    });
  }
}
