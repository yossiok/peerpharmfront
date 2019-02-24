import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../../../services/production.service';
import { ProductionOrders } from './../models/production-orders';
import { ProductionSchedule } from './../models/production-schedule';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css']
})
export class ProductionScheduleComponent implements OnInit {
  requests: ProductionSchedule[];
  orders: ProductionOrders[];
  public scheduleOrdersForm: FormGroup;
  scheduleOrders: ProductionOrders[] = [{
    orderNumber : 2,
    orderDeliveryDate: '01-01-19',
    orderQuantity: 3,
    producedQuantity: 2,
    produceStatus: 'finish'
  }];
  closeResult: string;
  openModal = false;
  constructor(private productionService: ProductionService, private modalService: NgbModal) {}

  ngOnInit() {
    this.productionService.getAllProductionSchedule().subscribe(res => {
      this.requests = res;
    });
    this.scheduleOrdersForm = new FormGroup({
      producedQuantity: new FormControl('', [Validators.required]),
      produceStatus: new FormControl('', [Validators.required])
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  OpenRelatedOrders(content){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);

      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    console.log(this.scheduleOrdersForm.value);
  }

}
