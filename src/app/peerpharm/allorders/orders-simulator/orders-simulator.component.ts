import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CostumersService } from "src/app/services/costumers.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-orders-simulator",
  templateUrl: "./orders-simulator.component.html",
  styleUrls: ["./orders-simulator.component.scss"],
})
export class OrdersSimulatorComponent implements OnInit {
  user: any = null;
  itemsSimulatorView: boolean = false;
  formulesSimulatorView: boolean = false;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.authService.loggedInUser;
    console.log(this.user);
  }

  itemsSimulator() {
    this.itemsSimulatorView = true;
    this.formulesSimulatorView = false;
  }
  formulesSimulator() {
    this.itemsSimulatorView = false;
    this.formulesSimulatorView = true;
  }
}
