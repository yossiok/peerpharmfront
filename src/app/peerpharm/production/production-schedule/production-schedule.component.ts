import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../../../services/production.service';
import { ProductionOrders } from './../models/production-orders';
import { ProductionSchedule } from './../models/production-schedule';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { FormulesService } from '../../../services/formules.service';

@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css']
})
export class ProductionScheduleComponent implements OnInit {
  requests: ProductionSchedule[];
  orders: ProductionOrders[];
  scheduleItems:Array<any>;
  public scheduleOrdersForm: FormGroup;
  // scheduleOrders: ProductionOrders[] = [{
  //   orderNumber : 2,
  //   orderDeliveryDate: '01-01-19',
  //   orderQuantity: 3,
  //   producedQuantity: 2,
  //   produceStatus: 'finish'
  // }]; // No Use
  closeResult: string;
  openModal = false;
  constructor(private productionService: ProductionService, private modalService: NgbModal,
    private toastSrv: ToastrService,
    private formuleService: FormulesService,) {}

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
      debugger
      this.scheduleItems= content;
      console.log(result);

      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.scheduleItems= [];
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  startFormuleForm(request){
    this.formuleService.startFormuleForm(request).subscribe(data=>{

    });
  }

  onSubmit() {
    console.log(this.scheduleOrdersForm.value);
  }

}
