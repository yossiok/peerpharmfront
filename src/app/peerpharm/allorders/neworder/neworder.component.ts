import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})
export class NeworderComponent implements OnInit {
  orderItemForm: FormGroup;
  orderForm:FormGroup;
  orderNumber:string;
  orderId:string;
  itemName:string;
  volume:Number;
  lastOrderNumber:Number;
  items:any[]=[];
  submited:boolean=false;
  titleAlert:string = 'This field is required';

  constructor(private fb: FormBuilder, private orderSer:OrdersService) { 

    this.orderForm = fb.group({
      //   'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
      delivery: [null, Validators.required],
      costumer:[null, Validators.required],
      orderdate:[null, Validators.required],
      remarks:[null, Validators.required],
      type:[null, Validators.required],
    });

    this.orderItemForm = fb.group({
      itemN: [null, Validators.required],
      discription: [null, Validators.required],
      unitmeasure:[null, Validators.required],
      quantity: [null, Validators.required],
      qtyKg:[null, Validators.nullValidator], 
      remarks:[null, Validators.nullValidator],
    })
  }


  addNewOrder(post){
    let newOrderObj = {
      costumer:post.costumer,
      orderDate:post.orderdate,
      deliveryDate:post.delivery,
      orderRemarks:post.remarks,
      status:'open',
    }
    this.orderSer.addNewOrder(newOrderObj).subscribe(res=>{
        this.orderId=res._id;
        this.orderNumber = res.orderNumber;
        this.submited=true;
        console.log(res)
    });
    console.log(newOrderObj);
  }

  addNewItemOrder(post){
    console.log(post);
    let newOrderItemObj={
      itemNumber: post.itemN,
      discription:post.discription,
      unitMeasure:post.unitmeasure,
      quantity:post.quantity,
      qtyKg:post.qtyKg,
      batch:'',
      price:'',
      discount:'',
      totalPrice:'',
      orderId:this.orderId, 
      orderNumber:this.orderNumber
    }
    console.log(newOrderItemObj);
    this.orderSer.addNewOrderItem(newOrderItemObj).subscribe(res=>this.items.push(res));
  //  orderId:this.orderId
  }
  

  searchItem(itemNumber){
    this.itemName="";
    console.log(itemNumber);
    this.orderSer.getItemByNumber(itemNumber).subscribe(res=>
      {
        console.log(res[0]);
        this.itemName = res[0].name + " " + res[0].subName + " "  + res[0].discriptionK;
        this.volume = res[0].volumeKey;
      })
      
  }

  getLastOrderNumber(){
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
}

}
