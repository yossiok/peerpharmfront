import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {


  newProjectModal:Boolean = false;
  EditRowId:String = '';
  allProjects:any[]=[]
  bottleAlloAmount:Number;
  bottleAmount:Number
  itemComponents:any[]=[];



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
  @ViewChild('projecItemApproval') projecItemApproval: ElementRef;


  newProject = {
    manager:'',
    customer:'',
    brand:'',
    serie:'',
    productName:'',
    remarks:'',
    itemNumber:'',
    compConfirm:false,
    batchConfirm:'',
    pricing:'',
    customerOrderNumber:'',
    peerpharmOrderNumber:'',
    fatherProduct:'',
    sentToLicense:'',
    licenseReceived:'',
    graphic:false,
    materialOrder:'',
    componentOrder:'',
    compArrivals:'',
    materialArrivals:'',
    expectedCustomerDelivery:'',
    production:'',
    deliveryCoordination:'',
  }
  constructor(private invService:InventoryService,private orderService:OrdersService,private itemService:ItemsService,private toastSrv:ToastrService,private scheduleService:ScheduleService) { }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.edit('');
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'Enter') {
      this.saveEdit(this.EditRowId)
    }
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
      this.newProject.compConfirm = false;
      this.newProject.graphic = false;
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
      if(element == '' || element == false || element == undefined){
      return 'red'
    } else {
      return 'green'
    }
  }



  getItemDetails(ev,id){
    debugger;
    if(ev.target.value != ''){
      this.itemService.getItemData(ev.target.value).subscribe(data=>{
        debugger;
        if(data[0].bottleNumber != '' && data[0].bottleNumber != '---'){
        this.itemComponents.push(data[0].bottleNumber)
        }
        if(data[0].capNumber != '' && data[0].capNumber != '---'){
        this.itemComponents.push(data[0].capNumber)
        }
        if(data[0].boxNumber != '' && data[0].boxNumber != '---'){
        this.itemComponents.push(data[0].boxNumber)
        }
        if(data[0].sealNumber != '' && data[0].sealNumber != '---'){
        this.itemComponents.push(data[0].sealNumber)
        }
        if(data[0].pumpNumber != '' && data[0].pumpNumber != '---'){
        this.itemComponents.push(data[0].pumpNumber)
        }
        if(this.itemComponents.length > 0){
          this.projectCompConfirm.nativeElement.checked = true
       
        }
        if(data[0].batchN != '' || data[0].batchN != '---'){
          this.projectBatchConfirm.nativeElement.value = data[0].batchN
        }
        if(data[0].motherP != '' || data[0].motherP != '---'){
        this.projectfatherProd.nativeElement.value = data[0].motherP
        }
     
      })

      this.saveEdit(id);
    }
   
  }

  getOrderDetails(ev,project){
    debugger;
    if(ev.target.value != ''){
      this.orderService.getOrderByNumber(ev.target.value).subscribe(data=>{
        if(data){
          this.projectCustumerOrder.nativeElement.value = data[0].customerOrderNum
          this.orderService.getAmountsForProject(ev.target.value,project._id,project.itemNumber).subscribe(data=>{
            debugger;
            
            var allEqual = data.every( v => v.hasEnoughAmount === true )
            if(allEqual == true){
              this.projectCompOrder.nativeElement.value = 'true'
              this.projectCompArrivals.nativeElement.value = 'true'
              this.saveEdit(project._id)
            } else {
              this.projectCompOrder.nativeElement.value = ''
              this.projectCompArrivals.nativeElement.value = ''
              
            }
          })
        }
    
      })
     
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
    compConfirm:this.projectCompConfirm.nativeElement.checked,
    batchConfirm:this.projectBatchConfirm.nativeElement.value,
    pricing:this.projectPricing.nativeElement.value,
    customerOrderNumber:this.projectCustumerOrder.nativeElement.value,
    peerpharmOrderNumber:this.projectPeerOrder.nativeElement.value,
    fatherProduct:this.projectfatherProd.nativeElement.value,
    sentToLisence:this.projectSentToLic.nativeElement.value,
    lisenceRecieved:this.projectLicRecieved.nativeElement.value,
    graphic:this.projectGraphic.nativeElement.checked,
    materialOrder:this.projectMatOrder.nativeElement.value,
    componentOrder:this.projectCompOrder.nativeElement.value,
    compArrivals:this.projectCompArrivals.nativeElement.value,
    materialArrivals:this.projectMatArrivals.nativeElement.value,
    expectedCustomerDelivery:this.projectExpDel.nativeElement.value,
    production:this.projectProduction.nativeElement.value,
    deliveryCoordination:this.projectDelCoor.nativeElement.value,
    components:this.itemComponents,
    id:id,
    }
    debugger;
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
