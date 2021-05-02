import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { OutServiceService } from 'src/app/services/out-service.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
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
  sendingForm: boolean = false;

  addOutservice: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    openedAt: new FormControl(null, Validators.required),
    suplierNumber: new FormControl('', Validators.required),
    suplierName: new FormControl('', Validators.required),
    contactName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phoneNum: new FormControl('', Validators.required),
    cellularNum: new FormControl(''),
    faxNum: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    status: new FormControl('open'),
    date: new FormControl(null, Validators.required),
    userName: new FormControl(this.authService.loggedInUser.userName, Validators.required),
    userEmail: new FormControl(this.authService.loggedInUser.userEmail, Validators.required)
  })

  addServiceType: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService,
    private outServiceService: OutServiceService,
    private supplierService: SuppliersService,
    private toastr: ToastrService) { }

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
    this.sendingForm = true
    this.outServiceService.addService(<OutService>this.addOutservice.value).subscribe(response => {
      this.sendingForm = false;
      if (response.status == 1) this.toastr.success(response.msg)
      else this.toastr.error(response.msg)
    })
  }
  
  addServiceTypeToDB() {
    this.sendingForm = true
    this.outServiceService.addServiceType(<ServiceType>this.addServiceType.value).subscribe(addedType => {
      this.sendingForm = false;
      console.log('addedService: ', addedType)
    })
  }

  fillSupplierDetails(event) {
    let supplierNumber = event.target.value
    this.supplierService.getSuppliersByNumber(supplierNumber).subscribe(response => {
      let sup = { ...response[0] }
      this.addOutservice.controls.suplierNumber.setValue(sup.suplierNumber)
      this.addOutservice.controls.suplierName.setValue(sup.suplierName)
      this.addOutservice.controls.contactName.setValue(sup.contactName)
      this.addOutservice.controls.email.setValue(sup.email)
      this.addOutservice.controls.phoneNum.setValue(sup.phoneNum)
      this.addOutservice.controls.cellularNum.setValue(sup.cellularNum)
      this.addOutservice.controls.faxNum.setValue(sup.faxNum)
      this.addOutservice.controls.address.setValue(sup.address)
      this.addOutservice.controls.city.setValue(sup.city)
      this.addOutservice.controls.country.setValue(sup.country)
      })
  }

}
