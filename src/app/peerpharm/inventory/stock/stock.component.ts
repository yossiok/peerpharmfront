import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  resCmpt: any;
  openModal: boolean = false;
  components: any[];
  componentsAmount: any[];
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService) { }

  ngOnInit() {
    this.getAllComponents();

  }


  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(components => {
      this.components = components;
      setTimeout( ()=> {
        this.inventoryService.getComponentsAmounts().subscribe(res => {
          this.componentsAmount = res;
          console.log(res);
          this.components.forEach(cmpt => {
         //   console.log(cmpt);
            let result = this.componentsAmount.find(elem => elem._id == cmpt.componentN)
            if(result!=undefined){
              console.log(result._id + " , " + cmpt.componentN);
              cmpt.amount = result.total;
            }
          })
        });

      }, 3000);

    });
  }

  openData(cmptNumber) {
    this.openModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber)
  }

  showDialog() {

  }
}
