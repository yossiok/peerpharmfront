import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../../services/items.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadFileService } from '../../../services/helpers/upload-file.service';

@Component({
  selector: 'app-item-documents',
  templateUrl: './item-documents.component.html',
  styleUrls: ['./item-documents.component.css']
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

  
  item: any = {};
  constructor(private itemsService: ItemsService, private route: ActivatedRoute, private uploadService: UploadFileService) { }

  ngOnInit() {
    this.getItemData();
  }

  getItemData() {
    const number = this.route.snapshot.paramMap.get('itemNumber');
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
    if (src == 'wordLabel') {
      let docObj = {
        itemNumber: number,
        wordLabelChangeText: txt,
        plateNotifaction: "notifiy",
        labelNotifaction: "notifiy",
      }
      console.log(docObj);
      this.itemsService.updateDocuments(docObj).subscribe(res => console.log(res));
    }
  }

  dismiss(src) {
    if (src == 'plate' || src == 'label') { this.plateText = false; this.labelText = false; }
    const number = this.route.snapshot.paramMap.get('itemNumber');
    let typeTochange = src + "Notifaction";
    let docObj = {
      itemNumber: number,
      [typeTochange]: 'dismiss'
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

      }
    });

    this.selectedFiles = undefined;
  }
}
