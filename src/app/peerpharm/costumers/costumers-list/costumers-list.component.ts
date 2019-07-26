import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-costumers-list',
  templateUrl: './costumers-list.component.html',
  styleUrls: ['./costumers-list.component.css']
})
export class CostumersListComponent implements OnInit {
  closeResult: string;
  costumers: any[];
  contacts: any[];
  contact = {
    name: '',
    phone: '',
    mail: ''
  };

  costumer = {
    costumerId: '',
    costumerName: '',
    fax: '',
    invoice: '',
    delivery: '',
    country: '',
    marks: '',
    impRemark: '',
    contact: [],
    brand:'',
  }


  private container: ElementRef;

  @ViewChild('container') set content(content: ElementRef) {
    debugger
    this.container = content;
  }

  constructor(private modalService: NgbModal, private costumersService: CostumersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

  

  open(content) {
    this.costumer = {
      costumerId: '',
      costumerName: '',
      fax: '',
      invoice: '',
      delivery: '',
      country: '',
      marks: '',
      impRemark: '',
      contact: [],
      brand:''
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);

      if (result == 'Saved') {
        this.saveCostumer();
      }
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(content, i) {
    console.log(this.costumers[i]);
    this.costumer = this.costumers[i];
    this.contact = this.costumers[i].contact[0];
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        this.saveCostumer();
      }
    })
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

  getCostumers() {
    this.costumersService.getAllCostumers().subscribe(res => this.costumers = res);
  }

  saveCostumer() {
    debugger
    this.costumer.contact=[];
    this.costumer.contact.push(this.contact);
    this.costumersService.addorUpdateCostumer(this.costumer).subscribe(res => {
      console.log(res);
      if (res == "updated") this.toastSrv.info(this.costumer.costumerName, "Changes Saved");
      else if (res.includes("saved")) {
        this.toastSrv.success(this.costumer.costumerName, "New Costumer Saved");
        this.costumers.push(this.costumer);
      }
      else this.toastSrv.error("Failed" , res);
    })
  }

  addContact() {
    debugger
    // const childElements = this.container.nativeElement.children;
    const rowDiv = this.renderer.createElement('div');
    const inputName = this.renderer.createElement('input');
    const inputPhone = this.renderer.createElement('input');
    const inputMail = this.renderer.createElement('input');
    this.renderer.appendChild(rowDiv, inputName);
    this.renderer.appendChild(rowDiv, inputPhone);
    this.renderer.appendChild(rowDiv, inputMail);

    this.renderer.appendChild(this.container.nativeElement, rowDiv);


  }

  ngOnInit() {
    this.getCostumers();
  }

}
