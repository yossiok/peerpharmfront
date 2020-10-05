import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {


  newProjectModal:Boolean = false;
  EditRowId:String = '';
  allProjects:any[]= []

  newProject = {
    manager:'',
    customer:'',
    brand:'',
    serie:'',
    productName:'',
    remarks:'',
    itemNumber:'',
    compConfirm:'',
    batchConfirm:'',
    pricing:'',
    customerOrderNumber:'',
    peerpharmOrderNumber:'',
    fatherProduct:'',
    sentToLisence:'',
    lisenceRecieved:'',
    graphic:'',
    materialOrder:'',
    componentOrder:'',
    compArrivals:'',
    materialArrivals:'',
    expectedCustomerDelivery:'',
    production:'',
    deliveryCoordination:'',
  }

  @ViewChild('projectCustomer') projectCustomer: ElementRef;
  @ViewChild('projectBrand') projectBrand: ElementRef;
  @ViewChild('projectSerie') projectSerie: ElementRef;
  @ViewChild('projectProduct') projectProduct: ElementRef;
  @ViewChild('projectRemarks') projectRemarks: ElementRef;
  @ViewChild('projectItemNumber') projectItemNumber: ElementRef;
  @ViewChild('projectCompConfirm') projectCompConfirm: ElementRef;
  @ViewChild('projectBatchConfirm') projectBatchConfirm: ElementRef;
  @ViewChild('projectPricing') projectPricing: ElementRef;
  @ViewChild('projectCustumerOrder') projectCustumerOrder: ElementRef;
  @ViewChild('projectPeerOrder') projectPeerOrder: ElementRef;
  @ViewChild('projectfatherProd') projectfatherProd: ElementRef;
  @ViewChild('projectSentToLic') projectSentToLic: ElementRef;
  @ViewChild('projectLicRecieved') projectLicRecieved: ElementRef;
  @ViewChild('projectMatOrder') projectMatOrder: ElementRef;
  @ViewChild('projectGraphic') projectGraphic: ElementRef;
  @ViewChild('projectMatArrivals') projectMatArrivals: ElementRef;
  @ViewChild('projectCompOrder') projectCompOrder: ElementRef;
  @ViewChild('projectCompArrivals') projectCompArrivals: ElementRef;
  @ViewChild('projectExpDel') projectExpDel: ElementRef;
  @ViewChild('projectProduction') projectProduction: ElementRef;
  @ViewChild('projectDelCoor') projectDelCoor: ElementRef;



  constructor(private toastSrv:ToastrService,private scheduleService:ScheduleService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  ngOnInit() {
    this.getAllProjects();
  }


  edit(id){
    if(id != ''){
      this.EditRowId = id
    } else {
      this.EditRowId = ''
    }
  }

  addNewProject(){
    
    if(this.newProject.manager != ''){
      this.scheduleService.addNewProject(this.newProject).subscribe(data=>{
        this.toastSrv.success('פרויקט נוסף בהצלחה !')
        this.newProjectModal = false;
        this.getAllProjects();
      debugger;
      })
    } else{
    this.toastSrv.error('חובה למלא שם מנהל')
    }
  }

  getAllProjects(){
    this.scheduleService.getAllProjects().subscribe(data=> this.allProjects = data)
  }

  doneOrNot(element){
    
    if(element != ''){
      return 'green'
    } else {
      return 'red'
    }
  }


  saveEdit(id){
    let objectToUpdate = {
    customer:this.projectCustomer.nativeElement.value,
    brand:this.projectBrand.nativeElement.value,
    serie:this.projectSerie.nativeElement.value,
    productName:this.projectProduct.nativeElement.value,
    remarks:this.projectRemarks.nativeElement.value,
    itemNumber:this.projectItemNumber.nativeElement.value,
    compConfirm:this.projectCompConfirm.nativeElement.value,
    batchConfirm:this.projectBatchConfirm.nativeElement.value,
    pricing:this.projectPricing.nativeElement.value,
    customerOrderNumber:this.projectCustumerOrder.nativeElement.value,
    peerpharmOrderNumber:this.projectPeerOrder.nativeElement.value,
    fatherProduct:this.projectfatherProd.nativeElement.value,
    sentToLisence:this.projectSentToLic.nativeElement.value,
    lisenceRecieved:this.projectLicRecieved.nativeElement.value,
    graphic:this.projectGraphic.nativeElement.value,
    materialOrder:this.projectMatOrder.nativeElement.value,
    componentOrder:this.projectCompOrder.nativeElement.value,
    compArrivals:this.projectCompArrivals.nativeElement.value,
    materialArrivals:this.projectMatArrivals.nativeElement.value,
    expectedCustomerDelivery:this.projectExpDel.nativeElement.value,
    production:this.projectProduction.nativeElement.value,
    deliveryCoordination:this.projectDelCoor.nativeElement.value,
    id:id,
    }

    this.scheduleService.updateProject(objectToUpdate).subscribe(data=>{
    if(data){
      this.toastSrv.success('פרויקט עודכן בהצלחה !');
      this.edit('');
      let project = this.allProjects.find(p=>p._id == id);
      project.customer = data.customer
      project.brand = data.brand
      project.serie = data.serie
      project.productName = data.productName
      project.remarks = data.remarks
      project.itemNumber = data.itemNumber
      project.compConfirm = data.compConfirm
      project.batchConfirm = data.batchConfirm
      project.pricing = data.pricing
      project.customerOrderNumber = data.customerOrderNumber
      project.peerpharmOrderNumber = data.peerpharmOrderNumber
      project.fatherProduct = data.fatherProduct
      project.sentToLisence = data.sentToLisence
      project.lisenceRecieved = data.lisenceRecieved
      project.graphic = data.graphic
      project.materialOrder = data.materialOrder
      project.componentOrder = data.componentOrder
      project.compArrivals = data.compArrivals
      project.materialArrivals = data.materialArrivals
      project.expectedCustomerDelivery = data.expectedCustomerDelivery
      project.production = data.production
      project.deliveryCoordination = data.deliveryCoordination
    }
    })
  }

  
}
