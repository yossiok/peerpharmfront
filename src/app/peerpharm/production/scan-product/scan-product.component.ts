import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scan-product',
  templateUrl: './scan-product.component.html',
  styleUrls: ['./scan-product.component.css']
})
export class ScanProductComponent implements OnInit {

  displayItem: Boolean;
  showTable: Boolean = false;
  showUpdateAll: Boolean = false;
  materialArrivals:any[]
  EditRowId:any = "";
  positionForAll:String;
  
  @ViewChild('materialPosition') materialPosition: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  constructor(private router:Router,private inventorySrv:InventoryService,private toastSrv:ToastrService ) { }

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
      this.showUpdateAll = true;
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

  updatePositionToAll(ev){
  debugger;

    var position = this.positionForAll
    
    if(position == '' || position == null || position == undefined){
      this.toastSrv.error('שדה זה אינו יכול להישאר ריק')
    } else {
      var materialNumber = this.materialArrivals[0].internalNumber

      this.inventorySrv.updateAllPositions(materialNumber,position).subscribe(data=>{
        if(data.msg = 'ok'){
          this.toastSrv.success('כל הפריטים עודכנו בהצלחה !')
          
          this.inventorySrv.getMaterialArrivalByNumber(materialNumber).subscribe(data=>{
            debugger;
            if(data){
              this.materialArrivals = data
              this.showTable = true;
              this.positionForAll = '';
            }
        
            })
        }
      })
    }
 
  }

}
