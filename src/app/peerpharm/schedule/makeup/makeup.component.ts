import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.css']
})
export class MakeupComponent implements OnInit {
  scheduleData:any[];
  EditRowId:any="";
  buttonColor:string='silver';
  @ViewChild('position') positionN:ElementRef; 
  @ViewChild('orderN') orderN:ElementRef; 
  @ViewChild('itemN') item:ElementRef; 
  @ViewChild('costumer') costumer:ElementRef; 
  @ViewChild('productName') productName:ElementRef; 
  @ViewChild('qty') qty:ElementRef; 
  @ViewChild('volume') volume:ElementRef; 
  @ViewChild('aaaa') date:ElementRef; 
  @ViewChild('marks') marks:ElementRef;
  @ViewChild('id') id:ElementRef; 

  scheduleLine = {
    positionN: '',
    orderN: '',
    itemN: '',
    productName: '',
    volume: '',
    costumer:'' ,
    qty: '',
    qtyProduced:'' ,
    date: '',
    dateRdy: '',
    marks: '',
    status:'open',
  }
  constructor(private scheduleService:ScheduleService, private itemSer: ItemsService,private orderSer: OrdersService,private toastSrv:ToastrService ) { }

  ngOnInit() {
    this.getAllSchedule(); 
  }


  
  writeScheduleData(){
    console.log(this.scheduleLine);
    this.scheduleService.setNewMkpSchedule(this.scheduleLine).subscribe(res=>{

      console.log(res)
      this.scheduleData.push(res);
      this.toastSrv.success(this.scheduleLine.itemN ," Added");
    })
  }

  dateChanged(date){

    this.scheduleService.getMkpScheduleByDate(date).subscribe(
      res=>{
        res.map(sced => {
          if (sced.qtyProduced!=null && sced.qtyProduced!="" && sced.qtyProduced>0) sced.color = 'Aquamarine'; 
         });
        this.scheduleData=res;
      }
    )

  }

  edit(id, type) {
    this.EditRowId = id;
  }
  getAllSchedule(){
    this.scheduleService.getOpenMkpSchedule().subscribe(res=>{
      console.log(res);     
       
      this.scheduleData=res;
    
    });
  }


  
  updateSchedule(){
    console.log(this.date.nativeElement.value);
    console.log(this.orderN.nativeElement.value);
    console.log(this.item.nativeElement.value);
    
    let scheduleToUpdate={
      scheduleId:this.id.nativeElement.value,
      positionN:this.positionN.nativeElement.value,
      orderN:this.orderN.nativeElement.value,
      itemN:this.item.nativeElement.value,
      costumer:this.costumer.nativeElement.value,
      productName:this.productName.nativeElement.value,
      volume:this.volume.nativeElement.value,
      qty:this.qty.nativeElement.value,
      date:this.date.nativeElement.value,
      marks:this.marks.nativeElement.value,
    }
    console.log(scheduleToUpdate);
    this.scheduleService.updateMkpSchedule(scheduleToUpdate).subscribe(res=>{
        console.log(res);
        this.EditRowId='';
        this.scheduleData[this.scheduleData.findIndex(sced => sced._id == scheduleToUpdate.scheduleId)] = scheduleToUpdate;
        this.toastSrv.success("Item " + scheduleToUpdate.itemN, "Updated Successfully");
    });
  
  }
  
  setDone(id, orderN, itemN){
    let today = new Date();
    today.setHours(2,0,0,0);
    //var _dt2 = new Date(today);
    //today = [_dt2.getDate(), _dt2.getMonth() + 1, _dt2.getFullYear()].join('/');
    var amountPrinted = prompt("Enter Amount Printed", "");
    if (amountPrinted == null || amountPrinted == "" ) {
    }else {
      console.log( " , " + amountPrinted);
    }
    var tempItem, tempOrderN, itemRemarks = "";
    var a = confirm("Fill process is done ?");
    if (a == true) {
      let scheduleToUpdate={
        scheduleId:id,
        qtyProduced:amountPrinted,
        dateRdy:today,
        orderN:orderN,
        itemN:itemN,
        status:'done'
      }
      console.log(scheduleToUpdate);
      this.scheduleService.updateMkpDoneSchedule(scheduleToUpdate).subscribe(res=>{
        console.log(res)
        this.toastSrv.info("Item " + scheduleToUpdate.itemN, "Is ready");
        
      });
    }
  }

  
  setItemDetails(itemNumber) {
    console.log(itemNumber);
    this.itemSer.getItemData(itemNumber).subscribe(res => {
       console.log(res[0]);
       let itemName = res[0].name + " " + res[0].subName + " " + res[0].discriptionK;
       this.scheduleLine.productName= itemName;
       this.scheduleLine.volume= res[0].volumeKey;
    })
  }

  setOrderDetails(orderNumber){
    console.log(orderNumber);
    this.orderSer.getOrderByNumber(orderNumber).subscribe(res=>{
      let costumer = res[0].costumer;
      this.scheduleLine.costumer = costumer;
    })
  }

  deleteSchedule(id, itemN){
    this.scheduleService.deleteMkpSchedule(id).subscribe(res=>{
      this.toastSrv.error("Item " + itemN , "Deleted")
      this.scheduleData=this.scheduleData.filter(elem=>elem._id!=id);
    })
  }
}
