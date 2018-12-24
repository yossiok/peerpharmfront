import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../../../services/orders.service';
import { CostumersService } from '../../../services/costumers.service';
import { Costumer } from '../../classes/costumer.class';
import { Observable } from 'rxjs';
import { String } from 'aws-sdk/clients/lexmodelbuildingservice';
import { map, startWith} from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})
export class NeworderComponent implements OnInit {
  orderItemForm: FormGroup;
  orderForm: FormGroup;
  orderNumber: string;
  orderId: string;
  closeResult: string;
  choosedCostumer:any;
  itemName: String;
  volume: Number = 0;
  lastOrderNumber: Number;
  items: any[] = [];
  costumers: any[] = [];
  costumersCopy: any[] = [];
  filterCostumers: Observable<any[]>;
  submited: boolean = false;
  openModal:boolean = false;
  titleAlert: string = 'This field is required';

  constructor(private modalService: NgbModal,private fb: FormBuilder, private orderSer: OrdersService, private costumerService: CostumersService) {

    this.orderForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      delivery: [null, Validators.required],
      costumer: [null, Validators.required],
      costumerInternalId: [null, Validators.required],
      orderdate: [null, Validators.required],
      remarks: [null, Validators.required],
      type: [null, Validators.required],
    });

    this.orderItemForm = fb.group({
      itemN: [null, Validators.required],
      discription: [null, Validators.required],
      unitmeasure: [null, Validators.required],
      quantity: [null, Validators.required],
      qtyKg: [null, Validators.nullValidator],
      remarks: [null, Validators.nullValidator],
    })
  }


  addNewOrder(post) {
debugger
    let newOrderObj = {
      costumer: post.costumer,
      orderDate: post.orderdate,
      costumerInternalId:post.costumerInternalId,
      deliveryDate: post.delivery,
      orderRemarks: post.remarks,
      type: post.type,
      status: 'open',
    }
    this.orderSer.addNewOrder(newOrderObj).subscribe(res => {
      this.orderId = res._id;
      this.orderNumber = res.orderNumber;
      this.submited = true;
      console.log(res)
    });
    console.log(newOrderObj);
  }

  addNewItemOrder(post) {
    console.log(post);
    debugger
    // cause this 2 firleds has [value] also, it won't read them if it's not data what was insert
    //if(this.itemName!="" && this.itemName!=null) post.discription = this.itemName;
    // if(this.volume!=0 && this.volume!=null) post.unitmeasure = this.volume;
    let newOrderItemObj = {
      itemNumber: post.itemN,
      discription: post.discription,
      unitMeasure: post.unitmeasure,
      quantity: post.quantity,
      qtyKg: post.qtyKg,
      batch: '',
      price: '',
      discount: '',
      totalPrice: '',
      itemRemarks:post.remarks,
      orderId: this.orderId,
      orderNumber: this.orderNumber
    }
    console.log(newOrderItemObj);
    this.orderItemForm.reset(); 1
    this.orderSer.addNewOrderItem(newOrderItemObj).subscribe(res => {
      this.items.push(res)
      this.itemName = "";
      this.volume = 0;
    })
    //  orderId:this.orderId
  }


  searchItem(itemNumber) {
    this.itemName = "";
    //console.log(itemNumber);
    this.orderSer.getItemByNumber(itemNumber).subscribe(res => {
      // console.log(res[0]);
      this.orderItemForm.controls.discription.setValue(res[0].name + " " + res[0].subName + " " + res[0].discriptionK);
      this.orderItemForm.controls.unitmeasure.setValue(res[0].volumeKey);
      //   this.itemName = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
      //   this.volume = res[0].volumeKey;
      console.log(this.itemName + ",  " + this.volume);
    })

  }

  getLastOrderNumber() {
    this.orderSer.getLastOrderNumber().subscribe();
  }
  ngOnInit() {
    //this.getLastOrderNumber();

    /* this.rForm.get('validate').valueChanges.subscribe(
 
       (validate) => {
 
           if (validate == '1') {
               this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
               this.titleAlert = 'You need to specify at least 3 characters';
           } else {
               this.rForm.get('name').setValidators(Validators.required);
           }
           this.rForm.get('name').updateValueAndValidity();
 
       });
  */
  this.getCostumers();
  }


  addNewSavedOrder(post) {
    let newOrderObj = {
      costumer: post.costumer,
      orderDate: post.orderdate,
      deliveryDate: post.delivery,
      orderRemarks: post.remarks,
      status: 'open',
    }
    this.orderSer.addNewOrder(newOrderObj).subscribe(res => {
      this.orderId = res._id;
      this.orderNumber = res.orderNumber;
      this.submited = true;
      console.log(res)
    });
    console.log(newOrderObj);
  }

  addNewSavedOrderItem(post) {
    console.log(post);
    // cause this 2 firleds has [value] also, it won't read them if it's not data what was insert
    if (post.discription == null || post.discription != this.itemName) post.discription = this.itemName;
    if (post.unitmeasure == null || post.unitmeasure != this.volume) post.unitmeasure = this.volume;
    let newOrderItemObj = {
      itemNumber: post.itemN,
      discription: post.discription,
      unitMeasure: post.unitmeasure,
      quantity: post.quantity,
      qtyKg: post.qtyKg,
      batch: '',
      price: '',
      discount: '',
      totalPrice: '',
      itemRemarks:post.remarks,
      orderId: this.orderId,
      orderNumber: this.orderNumber
    }
    console.log(newOrderItemObj);
    this.orderItemForm.reset(); 1
    this.orderSer.addNewOrderItem(newOrderItemObj).subscribe(res => this.items.push(res));
  }



  getCostumers() {
    this.costumerService.getAllCostumers().subscribe(res => {
      this.filterCostumers = res
      this.costumers = res;
      this.costumersCopy = res;
      this.filterCostumers = this.orderForm.get('costumer').valueChanges
      .pipe(startWith<string | any>(''),
        map(name => name ? this._filter(name) : this.costumers.slice())    
      );

    });
    
   
  
  }



  private _filter(name: string): any[] {
    console.log(this.filterCostumers);
    this.filterCostumers.subscribe(res=>console.log(res));
    const filterValue = name.toLowerCase();
    console.log("filterValue "   + filterValue);
    
    return this.costumers.filter(costumer => costumer.costumerName.includes(filterValue));

   // return this.costumers.filter(costumer => costumer.costumerName.toLowerCase()==filterValue);
  }




  openSearch(content, costumer){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log(result);

      if (result == 'Saved') {
        this.chooseCostumer();
      }
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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


  searchCostumer(costumerValue){
    if(costumerValue!=""){
      this.costumers = this.costumers.filter(costumer => costumer.costumerName.toLowerCase().includes(costumerValue));
    }else{
      this.costumers = this.costumersCopy.slice();
    }
      
  }

  chooseCostumer(){
    this.orderForm.controls.costumer.setValue(this.choosedCostumer.costumerName);
    this.orderForm.controls.costumerInternalId.setValue(this.choosedCostumer.costumerId);
  }
  
  
}
