import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scan-product',
  templateUrl: './scan-product.component.html',
  styleUrls: ['./scan-product.component.css']
})
export class ScanProductComponent implements OnInit {
  displayItem: Boolean;
  constructor(private router:Router ) { }

  ngOnInit() {
  }
  searchMaterial(ev){
    let inputValue= ev.target.value;
    if(inputValue.length==24){
      
      location.href="http://localhost:4200/#/peerpharm/inventory/scanMaterialView?id="+inputValue;
      // this.router.navigate(["http://localhost:4200/#/peerpharm/inventory/scanMaterialView?id="+inputValue]);
    }
  }


}
