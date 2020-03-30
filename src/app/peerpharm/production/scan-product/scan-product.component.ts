import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-scan-product',
  templateUrl: './scan-product.component.html',
  styleUrls: ['./scan-product.component.css']
})
export class ScanProductComponent implements OnInit {

  displayItem: Boolean;
  showTable: Boolean = false;
  materialArrivals:any[]
  EditRowId:any = "";
  
  @ViewChild('materialPosition') materialPosition: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor(private router:Router,private inventorySrv:InventoryService ) { }

  ngOnInit() {
  }
  searchMaterial(ev){
    let inputValue= ev.target.value;
    if(inputValue.length==24){
      
      location.href="http://localhost:4200/#/peerpharm/inventory/scanMaterialView?id="+inputValue;
      debugger
      location.href="http://www.peerpharmsystem.com/#/peerpharm/inventory/scanMaterialView?id="+inputValue;
      // this.router.navigate(["http://localhost:4200/#/peerpharm/inventory/scanMaterialView?id="+inputValue]);
    }
  }


  searchMaterialByNumber(ev){
    debugger;
    var materialNumber = ev.target.value;

    this.inventorySrv.getMaterialArrivalByNumber(materialNumber).subscribe(data=>{
    debugger;
    if(data){
      this.materialArrivals = data
      this.showTable = true;
    }

    })
  }

  edit(id) {
 
    if(id!=''){
      this.EditRowId = id;
    } else{
      this.EditRowId = '';
    }
  }

  updatePosition(id){

    var position = this.materialPosition.nativeElement.value;
  this.inventorySrv.updateMaterialPosition(id,position).subscribe(data=>{
    debugger;

    this.materialArrivals
    if(data){
    var materialArrival = this.materialArrivals.find(m=>m._id == data._id);
    materialArrival.position = data.position
    this.edit('')
    }

  })
  }

}
