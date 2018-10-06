import { Component, OnInit } from '@angular/core';
import { PlateService } from '../../services/plate.service'

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.css']
})
export class PlateComponent implements OnInit {
  showPlateData;
  plates: any[];
  plate: {
    palletNumber: '',
    palletItemName:'' ,
    palletItemBrand:'' ,
    palletImg:'' ,
    palleRemarks:'' ,
    lastUpdate: '',
  };
  constructor(private plateService: PlateService) { }

  ngOnInit() {
    this.getAllPlates();
  }

  getAllPlates() {
    this.plateService.getPlates().subscribe(res => {
      this.plates = res;
      console.log(res);
    });
  }


  showPlate(plate) {
    console.log(this.plates.find(res => res == plate));
    this.showPlateData = this.plates.find(res => res == plate);
  }

  addNewPallet() {

  }
}
