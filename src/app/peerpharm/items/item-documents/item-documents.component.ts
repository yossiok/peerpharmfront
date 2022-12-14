import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../../services/items.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../../../services/helpers/upload-file.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-item-documents',
  templateUrl: './item-documents.component.html',
  styleUrls: ['./item-documents.component.scss']
})
export class ItemDocumentsComponent implements OnInit {
  msdsFile: boolean = false;
  licenceFile: boolean = false;
  plateFile: boolean = false;
  labelFile: boolean = false;
  wordlabelFile: boolean = false;
  coaFile: boolean = false;

  labelText: boolean = false;
  plateText: boolean = false;

  labelStatus:string = '';
  plateStatus:string = '';

  item: any = {};
  itemDocLock;
  constructor(private itemsService: ItemsService, private route: ActivatedRoute, private uploadService: UploadFileService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getItemData();
  }

  getItemData() {
    const number = this.route.snapshot.paramMap.get('itemNumber');
    document.title = "Item " +number;
    if (number) {
      this.itemsService.getItemData(number).subscribe(res => {
        this.item = res[0];
        console.log("A#!@ " + this.item);
      });
    }
  }

  notifyDialog(src) {
    if (src == 'plate') { this.plateText = true; this.labelText = false; }
    else if (src == 'label') { this.plateText = false; this.labelText = true; }
  }

  notify(src, txt) {
    console.log(src, txt);
    const number = this.route.snapshot.paramMap.get('itemNumber');
    let docObj={};
    if (src == 'wordLabel') {
      docObj = {
        itemNumber: number,
        wordLabelChangeText: txt,
        plateNotifaction: "notifiy",
        labelNotifaction: "notifiy",
      }
    }
    if (src == 'label') {
      docObj = {
        itemNumber: number,
        labelStatus: txt,
        plateNotifaction: "clear",
        labelNotifaction: "clear"
      }
      this.labelText=false;
    }
    if (src == 'plate') {
      docObj = {
        itemNumber: number,
        plateStatus: txt,
        plateNotifaction: "clear",
        labelNotifaction: "clear"
      }
      this.plateText=false;
    }
    console.log(docObj);
    this.itemsService.updateDocuments(docObj).subscribe(res => console.log(res));
  }

dismiss(src) {
  if (src == 'plate' || src == 'label') { this.plateText = false; this.labelText = false; }
  const number = this.route.snapshot.paramMap.get('itemNumber');
  let typeTochange = src + "Notifaction";
  let docObj = {
    itemNumber: number,
    [typeTochange]: 'clear'
  }
  this.itemsService.updateDocuments(docObj).subscribe(res => console.log(res));
}
selectedFiles: FileList;
currentFileUpload: File;
progress: { percentage: number } = { percentage: 0 };
docPath;

selectFile(event, src) {
  switch (src) {
    case 'msds':
      this.msdsFile = true;
      break;
    case 'licence':
      this.licenceFile = true;
      break;
    case 'plate':
      this.plateFile = true;
      break;
    case 'label':
      this.labelFile = true;
      break;
    case 'wordlabel':
      this.wordlabelFile = true;
      break;
    case 'coa':
      this.coaFile = true;
      break;
    default:
      break;
  }
  console.log(event.target.value);
  let path = event.target.value;
  let indexFileName = path.lastIndexOf("\\") + 1;
  console.log(indexFileName);
  let fileName = path.substring(indexFileName, 999);
  this.docPath = fileName;
  console.log(fileName);
  //get one file of target (input type file) upload event
  this.selectedFiles = event.target.files;
}

upload(src) {

  const number = this.route.snapshot.paramMap.get('itemNumber');
  this.progress.percentage = 0;
  this.currentFileUpload = this.selectedFiles.item(0);
  this.uploadService.pushFileToStorage(this.currentFileUpload, src, number).subscribe(event => {
    console.log(event);

    if (event.type === HttpEventType.UploadProgress) {
      this.progress.percentage = Math.round(100 * event.loaded / event.total);
    } else if (event instanceof HttpResponse) {
      console.log('File is completely uploaded!');
      console.log(event.body);
      this.showSuccess();
      //dismiss 'upload' button
      switch (src) {
        case 'msds':
          this.msdsFile = false;
          break;
        case 'licence':
          this.licenceFile = false;
          break;
        case 'plate':
          this.plateFile = false;
          break;
        case 'label':
          this.labelFile = false;
          break;
        case 'wordlabel':
          this.wordlabelFile = false;
          break;
        case 'coa':
          this.coaFile = false;
          break;
        default:
          break;
      }
    }
  });

  this.selectedFiles = undefined;
}


showSuccess() {
  this.toastr.info('Hello world!', 'Toastr fun!');
}

    }
