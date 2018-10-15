import { Component, OnInit } from '@angular/core';
import { PlateService } from '../../services/plate.service'
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../../services/helpers/upload-file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.css']
})
export class PlateComponent implements OnInit {
  showPlateData;
  imgPath;
  plates: any[];
  plate= {
    palletNumber: '',
    palletItemName: '',
    palletItemBrand: '',
    palletImg: '',
    palletRemarks: '',
    lastUpdate: '',
    lastUpdateUser: ''
  };
  constructor(private plateService: PlateService, private uploadService: UploadFileService, private toastSrv:ToastrService) { }

  ngOnInit() {
    this.getAllPlates();
  }

  getAllPlates() {
    this.plateService.getPlates().subscribe(res => {
      this.plates = res;
      console.log(res);
    });
  }


  showPlate(plate) {
    console.log(this.plates.find(res => res == plate));
    this.showPlateData = this.plates.find(res => res == plate);
    this.plate= this.showPlateData;
  }

  addNewPallet() {
    console.log(this.plate);
    this.plateService.addNewPlate(this.plate).subscribe(res=>console.log(res));
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
}
