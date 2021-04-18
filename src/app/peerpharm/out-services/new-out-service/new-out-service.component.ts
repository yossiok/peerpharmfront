import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OutServiceService } from 'src/app/services/out-service.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { UsersService } from 'src/app/services/users.service';
import { OutService } from '../OutService';
import { ServiceType } from '../ServiceType';

interface supNameAndId {
  _id: string;
  suplierName: string;
}

@Component({
  selector: 'app-new-out-service',
  templateUrl: './new-out-service.component.html',
  styleUrls: ['./new-out-service.component.scss']
})

export class NewOutServiceComponent implements OnInit {

  serviceTypes: ServiceType[]
  suppliers: supNameAndId[]

  addOutservice: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    openedAt: new FormControl(new Date(), Validators.required),
    supplierName: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    userName: new FormControl(this.authService.loggedInUser.userName),
    userEmail: new FormControl(this.authService.loggedInUser.userEmail)
  })

  addServiceType: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  })

  addSupplier: FormGroup = new FormGroup({
    suplierNumber: new FormControl('', Validators.required),
    suplierName: new FormControl('', Validators.required),
    contactName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneNum: new FormControl('', Validators.required),
    cellularNum: new FormControl('', Validators.required),
    faxNum: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService, 
    private outServiceService: OutServiceService,
    private supplierService: SuppliersService) { }

  ngOnInit(): void {
    this.getAllServiceTypes()
    this.getAllSuppliers()
  }

  getAllServiceTypes() {
    this.outServiceService.getAllTypes().subscribe(types => {
      this.serviceTypes = types
    })
  }

  getAllSuppliers() {
    this.supplierService.getAllNamesAndIds().subscribe(namesAndIds => {
      this.suppliers = namesAndIds
    })
  }

  addOutServiceToDB() {
    this.outServiceService.addService(<OutService>this.addOutservice.value).subscribe( addedService => {
      console.log('addedService: ',addedService)
    })
  }

  addServiceTypeToDB() {
    this.outServiceService.addServiceType(<ServiceType>this.addServiceType.value).subscribe( addedType => {
      console.log('addedService: ',addedType)
    })
  }

}
