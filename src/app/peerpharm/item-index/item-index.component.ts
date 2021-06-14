import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-item-index',
  templateUrl: './item-index.component.html',
  styleUrls: ['./item-index.component.scss']
})
export class ItemIndexComponent implements OnInit {

  itemMovementForm: FormGroup = new FormGroup({
    itemType: new FormControl('all', Validators.required),
    itemNumbers: new FormControl([''], Validators.required),
    componentType: new FormControl('skip'),
    fromDate: new FormControl(new Date()),
    toDate: new FormControl(null),
    movementType: new FormControl('in', Validators.required),
    // price: new FormControl(null),
    // priceDir: new FormControl('higherThan'),
    amount: new FormControl(null),
    amountDir: new FormControl('higherThan')

  })

  constructor(
    private inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
  }

  setItemNumber(i, e) {
    this.itemMovementForm.value.itemNumbers[i] = e.target.value
  }

  fetchMovements() {
    this.inventoryService.getComplexItemMovements(this.itemMovementForm.value).subscribe(data => {
      console.log(data)
    })
  }

}
