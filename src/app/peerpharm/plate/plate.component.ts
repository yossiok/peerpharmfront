import { Component, OnInit } from '@angular/core';
import { PlateService } from '../../services/plate.service'
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../../services/helpers/upload-file.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.css']
})
export class PlateComponent implements OnInit {
  today:Date=new Date();
  filterPlatesNuumber:string='';
  filterPlatesName:string='';
  filterPlatesNameWordArr:Array<any>;
  showPlateData;
  imgPath;
  plates: any[];
  platesUfiltered: any[];
  plate= {
    _id:"",
    palletNumber: '',
    palletItemName: '',
    palletItemBrand: '',
    palletImg: '',
    palletRemarks: '',
    lastUpdate: this.today,
    lastUpdateUser: '',
    tempRemarks:''
  };

  constructor(private plateService: PlateService, private uploadService: UploadFileService, private toastSrv:ToastrService) { }

  ngOnInit() {
    this.getAllPlates();
    this.showPlateData.lastUpdate= moment(this.plate.lastUpdate).format("DD-MM-YYYY");

  }

  getAllPlates() {
    this.plateService.getPlates().subscribe(res => {
      this.plates = res;
      this.platesUfiltered = res;
      this.filterPlatesNuumber='';
      this.filterPlatesName='';
      console.log(res);
    });
  }


  showPlate(plate) {
    console.log(this.plates.find(res => res == plate));
    this.showPlateData = this.plates.find(res => res == plate);
    //formating the date 
    debugger
    this.showPlateData.lastUpdate= moment(this.showPlateData.lastUpdate).format("DD-MM-YYYY");
    // console.log("this.showPlateData:"+this.showPlateData);
    this.plate= this.showPlateData;
  }

  async updatePallet(src) {
    this.plate.lastUpdate=this.today;
    debugger
    console.log(this.plate);
    if(src=="new") {
      this.plateService.addNewPlate(this.plate).subscribe(res=>{
      debugger
      if(res.existPlate){
        this.toastSrv.error("Plate Numer: "+this.plate.palletNumber+" already exsit in system!");
      }else{
        this.toastSrv.success("Plate Numer: "+this.plate.palletNumber+" Created!");
        console.log(res);
      }
      this.showPlate(this.plate);
    });}
    if(src=="update"){
      this.plateService.updatePlate(this.plate).subscribe(res=>{
        if(res.n!=0){
          this.toastSrv.success("Plate Numer: "+this.plate.palletNumber+" updated!");
        } else{
          this.toastSrv.error("Plate Numer: "+this.plate.palletNumber+" update faild");
        }
        this.showPlate(this.plate);
      });
    } 
    if(src=="destroy") {
      if (confirm("Delete Plate?")) {
        let plateOjb={
          _id:this.plate._id,
          tempRemarks: "delete"
        }
        this.plateService.updatePlate(plateOjb).subscribe(res=>{
          if(res.n!=0){
            this.toastSrv.success("Plate Numer: "+this.plate.palletNumber+" updated!");
          } else{
            this.toastSrv.error("Plate Numer: "+this.plate.palletNumber+" update faild");
          }
          this.showPlate(this.plate);
        });
      }
    }
  }

  resetForm(){
    this.plate= {
      _id:"",
      palletNumber: '',
      palletItemName: '',
      palletItemBrand: '',
      palletImg: '',
      palletRemarks: '',
      lastUpdate: this.today,
      lastUpdateUser: '',
      tempRemarks:''
    };
    this.showPlateData.palletImg='';
  }
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  
  selectFile(event) {
    console.log(event.target.value);
    let path = event.target.value;
    let indexFileName = path.lastIndexOf("\\")+1;
    console.log(indexFileName);
    let fileName = path.substring(indexFileName, 999);
    this.imgPath=fileName;
    console.log(fileName);
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload,"", "").subscribe(event => {
      console.log(event);
      
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.plate.palletImg=''+event.body; //save the url to the image
      }
    });
    this.showSuccess();
    this.selectedFiles = undefined;
  }


  showSuccess(){
    this.toastSrv.success("Plate Added", "Good Luck")
  }

  searchPlateByNumber(filterPlatesNuumber){
    console.log(filterPlatesNuumber);
    this.plateService.getPlatesByNumber(filterPlatesNuumber).subscribe(res => {
      this.plates = res;
      console.log(res);
   });
   if(filterPlatesNuumber==''){
      this.filterPlatesNuumber='';
   }
  }

  searchPlateByName(filterPlatesName){
    this.filterPlatesNameWordArr = this.filterPlatesName.split(" ");
    this.filterPlatesNameWordArr= this.filterPlatesNameWordArr.filter(x=>x!="");
    if(this.filterPlatesNameWordArr.length>0){
      let tempArr=[];

      this.platesUfiltered.filter(plt=>{
        var check=false;
        var matchAllArr=0;
        this.filterPlatesNameWordArr.forEach(w => {
            if(plt.palletItemName.toLowerCase().includes(w.toLowerCase()) 
                ||  plt.palletItemBrand.toLowerCase().includes(w.toLowerCase())){
              matchAllArr++
            }
            (matchAllArr==this.filterPlatesNameWordArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(plt) && check) tempArr.push(plt);
      });
        //  this.components= tempArr;
         this.plates = tempArr;
    }

  }


}
