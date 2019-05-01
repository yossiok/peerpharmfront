import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-arrival',
  templateUrl: './material-arrival.component.html',
  styleUrls: ['./material-arrival.component.css']
})
export class MaterialArrivalComponent implements OnInit {

  today: Date = new Date();
  constructor() { }

  ngOnInit() {
  }

}
