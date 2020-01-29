import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-qa-pallets',
  templateUrl: './qa-pallets.component.html',
  styleUrls: ['./qa-pallets.component.css']
})
export class QaPalletsComponent implements OnInit {

 allReadyPallets:any[]
 allReadyPalletsCopy:any[]
 selectedArr:any[] = [];
 showProductsBeforeDelivery:boolean = false;

  constructor(private formService:FormsService) { }

  ngOnInit() {
    this.getAllReadyPallets();
  }


  getAllReadyPallets(){
  debugger;
    this.formService.getAllReadyPallets().subscribe(data=>{
      this.allReadyPallets = data;
      this.allReadyPalletsCopy = data;

    })

  }

  isSelected(ev,pallet){
    debugger
    if(ev.target.checked == true) {
    var isSelected = this.selectedArr
    isSelected.push(pallet);
    this.selectedArr = isSelected
    }

    if(ev.target.checked == false){
      var isSelected = this.selectedArr
      var tempArr = isSelected.filter(x=>x.itemNumber != pallet.itemNumber )
      this.selectedArr = tempArr
    }
    
 
  }

  filterByCustomer(ev){
    let customerName = ev.target.value;

    if(customerName != "") {
      let tempArray = this.allReadyPalletsCopy.filter(pallet => pallet.customerName.includes(customerName));
      this.allReadyPallets = tempArray

    } else { 
      this.allReadyPallets = this.allReadyPalletsCopy;
    }
  }

  openData(){
    debugger;
    this.showProductsBeforeDelivery = true;
  }
}
