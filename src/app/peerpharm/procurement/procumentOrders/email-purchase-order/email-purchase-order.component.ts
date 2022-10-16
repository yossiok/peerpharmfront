import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormControlName,
  Validators,
} from "@angular/forms";

import { Procurementservice } from "../../../../services/procurement.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-email-purchase-order",
  templateUrl: "./email-purchase-order.component.html",
  styleUrls: ["./email-purchase-order.component.scss"],
})
export class EmailPurchaseOrderComponent implements OnInit {
  @Input() currentOrder: any;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();

  user: any = null;
  userEmail: string = "";

  emailDetailsForm: FormGroup = new FormGroup({
    sender: new FormControl("", Validators.required),
    recipient: new FormControl("", Validators.required),
    subject: new FormControl(""),
    content: new FormControl(""),
    orderNumber: new FormControl(null, Validators.required),
  });

  constructor(
    private procurementService: Procurementservice,
    private toastser: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
    console.log(this.currentOrder);
  }
  getUser() {
    this.user = this.auth.loggedInUser;
    console.log(this.user);
    this.userEmail = this.user.userEmail;
    this.emailDetailsForm.controls.orderNumber.setValue(
      this.currentOrder.orderNumber
    );
    this.emailDetailsForm.controls.sender.setValue("donotreply@peerpharm.com");
    this.emailDetailsForm.controls.subject.setValue(
      "Order Number: " + this.currentOrder.orderNumber
    );
    this.emailDetailsForm.controls.recipient.setValue(
      this.currentOrder.supplierEmail + ";" + this.userEmail + ";"
    );
    this.emailDetailsForm.controls.content.setValue(
      "Dear Supplier,\n\nfind attached your purchase order.\n\nregards,\nPeerpharm"
    );
  }
  closeModal() {
    this.closed.emit();
  }

  sendMail(rem) {
    console.log(this.emailDetailsForm.value);
    if (!this.emailDetailsForm.valid) {
      alert("יש למלא כתובת אחת לפחות.");
      return;
    }
    let addresses = this.emailDetailsForm.value.recipient;
    addresses = addresses.split(";");
    addresses = addresses.filter(
      (add) => add.length > 0 && add.trim().length > 0
    );
    console.log(addresses);
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    for (let address of addresses) {
      if (!pattern.test(address)) {
        alert(`${address} היא כתובת לא תקינה.`);
        return;
      }
      console.log(address + ": " + pattern.test(address));
    }
    let withRemarks = rem == "remarks" ? true : false;

    let lines = this.emailDetailsForm.value.content.split("\n");
    console.log(lines);
    let htmlContent = "";
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] == "") {
        htmlContent += "<br>";
      } else if (i == 0) {
        htmlContent += "<h4>" + lines[i] + "<h4>";
      } else if (i == lines.length - 1) {
        htmlContent += "<p><strong>" + lines[i] + "<strong><p>";
      } else {
        htmlContent += "<p>" + lines[i] + "<p>";
      }
    }

    console.log(htmlContent);

    let mailToSend = {
      withRemarks,
      sender: this.emailDetailsForm.value.sender,
      recipients: addresses,
      subject: this.emailDetailsForm.value.subject,
      content: htmlContent,
      orderNumber: this.emailDetailsForm.value.orderNumber,
    };

    this.procurementService
      .sendPurchaseOrderByMail(mailToSend)
      .subscribe((data) => {
        console.log(data);
        if (data.msg) {
          this.toastser.error(data.msg);
          this.closeModal();
        } else if (data.counter && data.counter > 0) {
          this.toastser.success("המייל נשלח לכתובתו");
          this.closeModal();
        }
      });
  }
}
