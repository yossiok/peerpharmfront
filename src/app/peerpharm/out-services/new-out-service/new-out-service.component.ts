import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OutServiceService } from 'src/app/services/out-service.service';
import { UsersService } from 'src/app/services/users.service';
import { OutService } from '../OutService';
import { ServiceType } from '../ServiceType';

@Component({
  selector: 'app-new-out-service',
  templateUrl: './new-out-service.component.html',
  styleUrls: ['./new-out-service.component.scss']
})
export class NewOutServiceComponent implements OnInit {

  serviceTypes: ServiceType[]
  supplierNames: any[]

  addOutservice: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    openedAt: new FormControl(new Date(), Validators.required),
    supplierName: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    userName: new FormControl(this.authService.loggedInUser.userName),
    userEmail: new FormControl(this.authService.loggedInUser.userEmail)
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

  constructor(private authService: AuthService, private outServiceService: OutServiceService) { }

  ngOnInit(): void {
    this.getAllServiceTypes()
  }

  getAllServiceTypes() {
    this.outServiceService.getAllTypes().subscribe(types => {
      this.serviceTypes = types
    })
  }

  addOutServiceToDB() {
    this.outServiceService.addService(<OutService>this.addOutservice.value).subscribe( addedService => {
      console.log('addedService: ',addedService)
    })
  }

}
