import { Component, OnInit } from '@angular/core';
import { OutServiceService } from 'src/app/services/out-service.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { OutService } from './OutService';

const defaultService = {
  serviceOrder: 0,
  description: '',
  type: '',
  openedAt: new Date(),
  suplierNumber: 0,
  suplierName: '',
  contactName: '',
  email: '',
  phoneNum: 0,
  cellularNum: 0,
  faxNum: 0,
  address: '',
  city: '',
  country: '',
  status: '',
  date: new Date(),
  userName: '',
  userEmail: ''
}

@Component({
  selector: 'app-out-services',
  templateUrl: './out-services.component.html',
  styleUrls: ['./out-services.component.scss']
})
export class OutServicesComponent implements OnInit {

  services: OutService[]
  service: OutService
  orderDetailsModal: boolean;

  constructor(
    private outServiceService: OutServiceService,
    private supplierService: SuppliersService
  ) { }

  ngOnInit(): void {
    this.getAllServices()
  }

  getAllServices(): void {
    this.outServiceService.getAllServices().subscribe(services => {
      
      this.services = services
    })
  }

  openService(service) {
    
    this.service = service
    this.orderDetailsModal = true
    console.log(service)
  }

  closeService() {
    this.orderDetailsModal = false;
    this.service = defaultService
  }



}
