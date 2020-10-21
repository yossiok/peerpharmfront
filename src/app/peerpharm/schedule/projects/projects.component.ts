import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { OrdersService } from 'src/app/services/orders.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { CostumersService } from 'src/app/services/costumers.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {


  newProjectModal:Boolean = false;
  addNewItemModal:Boolean = false;
  currProjectId:any;
  EditRowId:String = '';
  allProjects:any[]=[]
  allProjectsCopy:any[]=[]
  allCostumers:any[]
  managers:any[]
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
    items:[],

    dateCreated:this.formatDate(new Date())
  }

  newItem = {
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
    projectId:'',
  }
  constructor(private costumerSrv:CostumersService,private invService:InventoryService,private orderService:OrdersService,private itemService:ItemsService,private toastSrv:ToastrService,private scheduleService:ScheduleService) { }

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
    this.getAllCostumers();
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  edit(id){
    debugger;
 
    if(id != ''){
      this.EditRowId = id
    } else {
      this.EditRowId = ''
    }
  }

  filterByManager(ev){
    if(ev.target.value == 'all'){
    this.allProjects = this.allProjectsCopy
    } else {
      this.allProjects = this.allProjectsCopy.filter(p=>p.manager == ev.target.value);
    }
   

  }

  openNewItemModal(id){
    this.addNewItemModal = true;
    this.currProjectId = id
    
  }

  addNewItem(){
    debugger;
    this.newItem.projectId = this.currProjectId
    this.scheduleService.addNewItemToProject(this.newItem).subscribe(data=>{
    if(data){
     let project = this.allProjects.find(p=>p._id == this.currProjectId);
     if(project){
       project.items = data.items
       this.addNewItemModal = false;
     }
    }
    })
    
  }

  addNewProject(){
    
    if(this.newProject.manager != ''){
      this.scheduleService.addNewProject(this.newProject).subscribe(data=>{
        this.toastSrv.success('פרויקט נוסף בהצלחה !')
        this.newProjectModal = false;
        this.getAllProjects();
        this. resetFields();
      debugger;
      })
    } else{
    this.toastSrv.error('חובה למלא שם מנהל')
    }
  }

  getAllCostumers(){
    this.costumerSrv.getAllCostumers().subscribe(data=>{
      this.allCostumers = data;
    })
  }



  resetFields(){
    this.newProject.manager = ''
    this.newProject.customer = ''
    this.newProject.brand = ''
    this.newProject.serie = ''
  }

  getAllProjects(){
    this.scheduleService.getAllProjects().subscribe(data=>{
      let tempArr = []
      data.forEach(project => {
      tempArr.push(project.manager);
      
      });
      this.managers = [...new Set(tempArr)];
      debugger;
      this.allProjects = data
      this.allProjectsCopy = data
    })
  }

  doneOrNot(element){
      if(element == '' || element == false || element == undefined){
      return 'red'
    } else {
      return 'green'
    }
  }



  getItemDetails(ev){
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

     
    }
   
  }

  getOrderDetails(ev,project){
    debugger;
    if(ev.target.value != ''){
      this.orderService.getOrderByNumber(ev.target.value).subscribe(data=>{
        if(data){
          this.projectCustumerOrder.nativeElement.value = data[0].customerOrderNum
          this.orderService.getAmountsForProject(ev.target.value,project._id).subscribe(data=>{
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
    debugger;
    let objectToUpdate = {
    productName:this.projectProduct.nativeElement.value,
    remarks:this.projectRemarks.nativeElement.value,
    itemNumber:this.projectItemNumber.nativeElement.value,
    compConfirm:this.projectCompConfirm.nativeElement.checked,
    batchConfirm:this.projectBatchConfirm.nativeElement.value,
    pricing:this.projectPricing.nativeElement.value,
    customerOrderNumber:this.projectCustumerOrder.nativeElement.value,
    peerpharmOrderNumber:this.projectPeerOrder.nativeElement.value,
    fatherProduct:this.projectfatherProd.nativeElement.value,
    sentToLicense:this.projectSentToLic.nativeElement.value,
    licenseReceived:this.projectLicRecieved.nativeElement.value,
    graphic:this.projectGraphic.nativeElement.checked,
    materialOrder:this.projectMatOrder.nativeElement.value,
    componentOrder:this.projectCompOrder.nativeElement.value,
    compArrivals:this.projectCompArrivals.nativeElement.value,
    materialArrivals:this.projectMatArrivals.nativeElement.value,
    expectedCustomerDelivery:this.projectExpDel.nativeElement.value,
    production:this.projectProduction.nativeElement.value,
    deliveryCoordination:this.projectDelCoor.nativeElement.value,
    id:id,
    }
    debugger;
    this.scheduleService.updateProject(objectToUpdate).subscribe(data=>{
    if(data){
      this.toastSrv.success('פרויקט עודכן בהצלחה !');
      this.getAllProjects();
      this.edit('');
      


    }
    })
  }

  
}
