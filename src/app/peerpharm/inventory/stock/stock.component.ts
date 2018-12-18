import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service'
import { ActivatedRoute } from '@angular/router'
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
 // resCmpt: any;
  resCmpt:any = {
    componentN:'',
    componentName:'',
    componentNs:'',
    suplierN: '',
    suplierName: '',
    componentType:'',
    componentCategory:'',
    img: '',
    importFrom: '',
    lastModified:'',
    minimumStock:'',
    needPrint:'',
    packageType: '',
    packageWeight: '',
    remarks: '',
  }
  buttonColor: string = 'white';
  buttonColor2: string = '#B8ECF1';
  buttonColor3: string = '#B8ECF1';
  openModal: boolean = false;
  openAmountsModal: boolean = false;
  openModalHeader:string;
  components: any[];
  componentsUnFiltered:any[];
  componentsAmount: any[];
  tempHiddenImgSrc:any;
  procurmentQnt:Number;
  amountsModalData:any;
  // currentFileUpload: File; //for img upload creating new component

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private uploadService: UploadFileService) { }

  ngOnInit() {
    this.getAllComponents();

  }

  setType(type, elem) {
    console.log("hi " + type);
    console.log("hi " + elem.style);
    switch (type) {
      case 'component':
        this.buttonColor = "white";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'material':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "white";
        this.buttonColor3 = "#B8ECF1";
        break;
      case 'product':
        this.buttonColor = "#B8ECF1";
        this.buttonColor2 = "#B8ECF1";
        this.buttonColor3 = "white";
        break;
    }
 
    this.components=this.componentsUnFiltered.filter(x=> x.itemType==type);
  }




  getAllComponents() {
    this.inventoryService.getAllComponents().subscribe(components => {

      this.componentsUnFiltered=   components.splice(0);
      this.components = components;
      //why are we using set time out and not async await??
      setTimeout( ()=> {
        
        this.inventoryService.getComponentsAmounts().subscribe(res => {
          this.componentsAmount = res;
          console.log(res);
          this.componentsUnFiltered.forEach(cmpt => {
         //  adding amounts to all components
            let result = this.componentsAmount.find(elem => elem._id == cmpt.componentN)
            if(result!=undefined){
              console.log(result._id + " , " + cmpt.componentN);
              cmpt.amount = result.total;
            }
          });
          this.components=this.componentsUnFiltered.filter(x=> x.itemType=="component");

        });

      }, 1000);

    });
    console.log(this.components);
    debugger;
  }

  openData(cmptNumber) {
    this.openModalHeader="פריט במלאי  "+ cmptNumber;
    this.openModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber)
  }
  openAmountsData(cmptNumber) {
    this.openModalHeader="פריט במלאי  "+ cmptNumber;
    this.openAmountsModal = true;
    console.log(this.components.find(cmpt => cmpt.componentN == cmptNumber));
    this.resCmpt = this.components.find(cmpt => cmpt.componentN == cmptNumber);
  }

  newCmpt(){
    this.resCmpt = {
      componentN:'',
      componentName:'',
      componentNs:'',
      suplierN: '',
      suplierName: '',
      componentType:'',
      componentCategory:'',
      img: '',
      importFrom: '',
      lastModified:'',
      minimumStock:'',
      needPrint:'',
      packageType: '',
      packageWeight: '',
      remarks: '',
    }


    this.openModalHeader="יצירת פריט חדש";
    this.openModal = true;
  }

  writeNewComponent(){
    console.log(this.resCmpt);
     this.inventoryService.addNewCmpt(this.resCmpt).subscribe(res=>{
       console.log("res from front: "+res)
       if(res=="itemExist"){
        alert("לא ניתן ליצור פריט חדש- מספר "+this.resCmpt.componentN+" פריט כבר קיים במלאי");
      }
   })

  }




  uploadImg(fileInputEvent){
    let file  = fileInputEvent.target.files[0];
    console.log(file);
 
    this.uploadService.uploadFileToS3Storage(file).subscribe(data=>{
      if(data.partialText)
      {
      // this.tempHiddenImgSrc=data.partialText;
      this.resCmpt.img = data.partialText;
      console.log(" this.resCmpt.img "+  this.resCmpt.img);
      }
 
    })
}
getCmptAmounts(cmptN){
  this.openAmountsData(cmptN);
  this.inventoryService.getAmountOnShelfs(cmptN).subscribe(res=>{
    debugger;
    console.log("getCmptAmounts"+res);
  });
}
inputProcurment(event: any) { // without type info
  this.procurmentQnt = event.target.value ;
  debugger;
}
updateProcurment(componentId,componentNum,status){
  debugger
  if(status=="false"){
    this.procurmentQnt=null;
  }
  let objToUpdate={
    _id:componentId,
    componentN:componentNum,
    procurementSent:status,//האם בוצעה הזמנת רכש
    procurementAmount:this.procurmentQnt,//כמות בהזמנת רכש
  } 
  this.inventoryService.updateComptProcurement(objToUpdate).subscribe(res=>{
    if(res.ok!=0){

    }
    console.log("res updateComptProcurement: "+res);
    debugger;
  });
}

  
  upload(src) {

    // const number = this.route.snapshot.paramMap.get('itemNumber');
    // this.progress.percentage = 0;
    // this.currentFileUpload = this.selectedFiles.item(0);
    // this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
    //   console.log(event);

    //   if (event.type === HttpEventType.UploadProgress) {
    //     this.progress.percentage = Math.round(100 * event.loaded / event.total);
    //   } else if (event instanceof HttpResponse) {
    //     console.log('File is completely uploaded!');
    //     console.log(event.body);        
    //   }
    // });

    // this.selectedFiles = undefined;
  }





  showDialog() {
  }
  
}
