import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/services/excel.service';
import { OrdersService } from 'src/app/services/orders.service';


@Component({
  selector: 'app-costumers-list',
  templateUrl: './costumers-list.component.html',
  styleUrls: ['./costumers-list.component.scss']
})
export class CostumersListComponent implements OnInit {
  
  @ViewChild("container")  container: ElementRef=null;

  addContactModal:boolean = false;
  showCustomerModal:boolean = false;
  closeResult: string;
  costumers: any[];
  customerOrders: any[];
  customerItems: any[]
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
    area:'',
  }

  fetchingCustomerItems: boolean;
  counter: number = 0;

  constructor(private orderService:OrdersService,private excelService:ExcelService,private modalService: NgbModal, private costumersService: CostumersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

  

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
      brand:'',
      area:''

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

  openDetails(i) { 
    console.log(this.costumers[i]);
    this.costumer = this.costumers[i];
    this.getOrderDetailsForCustomer(this.costumer.costumerName)
    this.getAllCustomerOrderedItems(this.costumer.costumerName)
    this.showCustomerModal = true;
    // this.contact = this.costumers[i].contact[0];
 
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
    if(this.contact.mail != "" || this.contact.phone != "" || this.contact.name != "") {
      this.costumer.contact.push(this.contact);
    }
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

  getOrderDetailsForCustomer(customer){
    this.orderService.getOrderByCustomer(customer).subscribe(data=>{
    if(data){
      this.customerOrders = data;
    }
    })
  }

  getAllCustomerOrderedItems(costumer){
    this.fetchingCustomerItems = true
    this.orderService.getAllCustomerOrderedItems(costumer).subscribe(data => {
      this.fetchingCustomerItems = false
      this.customerItems = data
    })
  }

  sortBy(array, by){
    if(by.includes('Date')) {
      this[array].map(element => {
        element.formatedDate = new Date(element[by])
        return element;
      })
      by = 'formatedDate'
    }
    if (this.counter % 2 == 0) this[array].sort((a, b) => (a[by]) - (b[by]))
    else this[array].sort((a, b) => (b[by]) - (a[by]))
    this.counter++
  }

  exportAsXLSX(data, fileName) {
    debugger
    this.excelService.exportAsExcelFile(data, fileName);
  }

  checkIfExist(ev){
  var costumerId = ev.target.value;

  this.costumersService.getByCostumerId(costumerId).subscribe(data=>{
  if(data.length > 0){
    this.toastSrv.error('שים לב, לקוח כבר קיים במערכת!')
  }
  })
  }

  deleteContact(contact){
    ;
    if(confirm('האם למחוק איש קשר זה ? ')){
      for (let i = 0; i < this.costumer.contact.length; i++) {
        if(this.costumer.contact[i].phone == contact.phone){
          this.costumer.contact.splice(i,1);
        }  
        
      }
    }
  }

  addContact() {
      if(this.contact.phone != "") {
        let contactToPush = {...this.contact}
        this.costumer.contact.push(contactToPush)

        this.contact.phone = "";
        this.contact.name = "";
        this.contact.mail = "";
        this.addContactModal = false;
      } else { 
        this.toastSrv.error("Please fill all the fields")
      }
     
    // const childElements = this.container.nativeElement.children;
//     const rowDiv = this.renderer.createElement('div');
//     const inputName = this.renderer.createElement('input');
//     const inputPhone = this.renderer.createElement('input');
//     const inputMail = this.renderer.createElement('input');
//     this.renderer.appendChild(rowDiv, inputName);
//     this.renderer.appendChild(rowDiv, inputPhone);
//     this.renderer.appendChild(rowDiv, inputMail);

// let m = document.getElementById('cont');
//     this.renderer.appendChild(m, rowDiv);


  }

  ngOnInit() {
    this.getCostumers(); 
  }

}
