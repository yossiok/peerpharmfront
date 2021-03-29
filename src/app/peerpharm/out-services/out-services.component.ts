import { Component, OnInit } from '@angular/core';
import { OutServiceService } from 'src/app/services/out-service.service';
import { OutService } from './OutService';

@Component({
  selector: 'app-out-services',
  templateUrl: './out-services.component.html',
  styleUrls: ['./out-services.component.scss']
})
export class OutServicesComponent implements OnInit {

  services: OutService[]

  constructor(private outServiceService: OutServiceService) { }

  ngOnInit(): void {
    this.getAllServices()
  }

  getAllServices(): void {
    this.outServiceService.getAllServices().subscribe(services => {
      this.services = services
    })
  }



}
