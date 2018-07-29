import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  resCmpt:any;
  openModal: boolean = false;
  components: any[];
  constructor(private route: ActivatedRoute, private inventoryService: InventoryService) { }

  ngOnInit() {
    this.getAllComponents();
  }


  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(components => {
      this.components = components
      //console.log(this.components)
    });
  }

  openData(cmptNumber) {
    this.openModal=true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber)
  }
}
