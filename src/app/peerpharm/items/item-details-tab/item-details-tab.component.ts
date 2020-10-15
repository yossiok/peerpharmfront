import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-details-tab',
  templateUrl: './item-details-tab.component.html',
  styleUrls: ['./item-details-tab.component.scss']
})
export class ItemDetailsTabComponent implements OnInit {

  constructor( private route: ActivatedRoute) { }

  ngOnInit() {
    const number = this.route.snapshot.paramMap.get('itemNumber');
    document.title = "Item " +number;
  }

}
