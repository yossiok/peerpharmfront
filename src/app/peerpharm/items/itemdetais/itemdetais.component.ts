import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router'
import { ItemsService } from '../../../services/items.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFileService } from 'src/app/services/helpers/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import * as moment from 'moment';

@Component({
  selector: 'app-itemdetais',
  templateUrl: './itemdetais.component.html',
  styleUrls: ['./itemdetais.component.css']
})
export class ItemdetaisComponent implements OnInit {

  @ViewChild('rows') rows: ElementRef;
  @ViewChild('colums') colums: ElementRef;
  @ViewChild('container')
  private container: ElementRef;
  mainDivArr: any = [];
  dataDiv: any = [];
  newItem: FormGroup;
  item: any = {};
  itemCopy:any = {};

  user: UserInfo;
  userName=""
  itemShown = {
    itemNumber: '',
    name: '',
    subName: '',
    discriptionK: '',
    proRemarks: '',
    impRemarks: '',

    updateDate:'',
    nameOfupdating: '',
    versionNumber: '',

    stickerNumber: '',
    stickerTypeK: '',
    boxNumber: '',
    boxTypeK: '',
    barcodeK: '',
    StickerLanguageK: '',
    volumeKey: '',
    netWeightK: '',
    grossUnitWeightK: '',

    licsensNumber: '',
    licsensDate: '',
    country: '',

    netCtnWeightK: '',
    grossCtnWeightK: '',

    cartonNumber: '',
    PcsCarton: '',
    pumpDirection: '',
    paletteType: '',
    st1layerCarton: '',
    totalCartonPalette: '',

    cbm: '',
    motherP: '',
    itemType: '',

    item1w: '',
    item1s: '',
    item2w: '',
    item2s: '',
    item3w: '',
    item3s: '',
    item4w: '',
    item4s: '',
    itemStickerW: '',
    itemStickerS: '',
    itemBoxS: '',
    itemBoxW: '',
    itemCtnW: '',
    itemCtnS: '',

    bottleNumber: '',
    capNumber: '',
    pumpNumber: '',
    sealNumber: '',

    bottleTube: '',
    capTube: '',
    pumpTube: '',
    sealTube: '',

    extraText1: '',
    extraText2: '',

    bottleImage: '',
    capImage: '',
    pumpImage: '',
    laserImage1: '',
    laserImage2: '',
    imgMain1: '',
    imgMain2: '',
    imgMain3: '',

    extraImage1: '',
    extraImage2: '',
    sealImage: '',
    
    pallet: '',
    pallet1x: '',
    pallet1y: '',
    pallet2: '',
    pallet2x: '',
    pallet2y: '',
    pallet3: '',
    pallet3x: '',
    pallet3y: '',

    goddetShape: '',

    msdsFileLink: '',
    licenceFileLink: '',
    plateFileLink: '',
    labelFileLink: '',
    wordLabelFileLink: '',
    coaFileLink: '',

  }


  constructor(private route: ActivatedRoute, private itemsService: ItemsService, private fb: FormBuilder, private renderer: Renderer2,
    private uploadService: UploadFileService, private toastr: ToastrService, private authService: AuthService) {
    this.itemCopy = Object.assign({}, this.itemShown);
    this.newItem = fb.group({
      itemNumber: [null, Validators.required],
      name: [null, Validators.required],
      subName: [null, Validators.required],
      discriptionK: [null, Validators.required],
      proRemarks: [null, Validators.required],
      impRemarks: [null, Validators.required],

      updateDate: [null, Validators.required],
      nameOfupdating: [null, Validators.required],
      versionNumber: [null, Validators.required],

      stickerNumber: [null, Validators.required],
      stickerTypeK: [null, Validators.required],
      boxNumber: [null, Validators.required],
      boxTypeK: [null, Validators.required],
      barcodeK: [null, Validators.required],
      StickerLanguageK: [null, Validators.required],
      volumeKey: [null, Validators.required],
      netWeightK: [null, Validators.required],
      grossUnitWeightK: [null, Validators.required],

      licsensNumber: [null, Validators.required],
      licsensDate: [null, Validators.required],
      country: [null, Validators.required],

      netCtnWeightK: [null, Validators.required],
      grossCtnWeightK: [null, Validators.required],

      cartonNumber: [null, Validators.required],
      PcsCarton: [null, Validators.required],
      pumpDirection: [null, Validators.required],
      paletteType: [null, Validators.required],
      st1layerCarton: [null, Validators.required],
      totalCartonPalette: [null, Validators.required],

      cbm: [null, Validators.required],
      motherP: [null, Validators.required],
      itemType: [null, Validators.required],

      item1w: [null, Validators.required],
      item1s: [null, Validators.required],
      item2s: [null, Validators.required],
      item2w: [null, Validators.required],
      item3s: [null, Validators.required],
      item3w: [null, Validators.required],
      item4s: [null, Validators.required],
      item4w: [null, Validators.required],
      itemStickerW: [null, Validators.required],
      itemStickerS: [null, Validators.required],
      itemBoxS: [null, Validators.required],
      itemBoxW: [null, Validators.required],
      itemCtnW: [null, Validators.required],
      itemCtnS: [null, Validators.required],

      bottleNumber: [null, Validators.required],
      capNumber: [null, Validators.required],
      pumpNumber: [null, Validators.required],
      sealNumber: [null, Validators.required],

      bottleTube: [null, Validators.required],
      capTube: [null, Validators.required],
      pumpTube: [null, Validators.required],
      sealTube: [null, Validators.required],

      extraText1: [null, Validators.required],
      extraText2: [null, Validators.required],

      bottleImage: [null, Validators.required],
      capImage: [null, Validators.required],
      pumpImage: [null, Validators.required],
      laserImage1: [null, Validators.required],
      laserImage2: [null, Validators.required],
      imgMain1: [null, Validators.required],
      imgMain2: [null, Validators.required],
      imgMain3: [null, Validators.required],

      extraImage1: [null, Validators.required],
      extraImage2: [null, Validators.required],
      sealImage: [null, Validators.required],

      pallet: [null, Validators.required],
      pallet1x: [null, Validators.required],
      pallet1y: [null, Validators.required],
      pallet2: [null, Validators.required],
      pallet2x: [null, Validators.required],
      pallet2y: [null, Validators.required],
      pallet3: [null, Validators.required],
      pallet3x:[null, Validators.required],
      pallet3y: [null, Validators.required],
    });
  }

  showGoddet() {
    // this.container.nativeElement.removeChild();


    const childElements = this.container.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.container.nativeElement, child);
    }

    const r = this.rows.nativeElement.value;
    const c = this.colums.nativeElement.value;

    for (let i = 0; i < r; i++) {
      const rowDiv = this.renderer.createElement('div');
      this.renderer.setStyle(rowDiv, 'display', 'block');
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 1; j <= c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement('div');
        const text = this.renderer.createText('[' + cell + ']');
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        /*this.renderer.setStyle(columnDiv, 'color', 'blue');*/
        this.renderer.listen(columnDiv, 'click', () => {
          let color;
          let setColor = prompt("Enter Color", "");
          if (setColor == null || setColor == "") {
            color = "N/A";
          } else {
            color = setColor;
          }
          console.log(color);
          console.log(cell);
          columnDiv.innerHTML = color;
        });
        this.renderer.appendChild(this.container.nativeElement, columnDiv);
      }
    }
  }

  getGoddetData() {
    let div = this.container.nativeElement;
    this.mainDivArr = [];
    let divArr = [];
    for (let innerDiv of div.getElementsByTagName('div')) {
      if (innerDiv.innerHTML) {
        divArr.push(innerDiv.innerHTML);
      }
      else {
        this.mainDivArr.push(divArr);
        divArr = [];
      }
    }
    this.mainDivArr.push(divArr);
    this.mainDivArr.shift();
    console.log(this.mainDivArr);
    this.itemShown['goddet'] = this.mainDivArr;
  }

  showGoddetData() {
    const r = this.dataDiv.length;
    const c = this.dataDiv[0].length;
    for (let i = 0; i < r; i++) {
      const rowDiv = this.renderer.createElement('div');
      this.renderer.setStyle(rowDiv, 'display', 'block');
      this.renderer.appendChild(this.container.nativeElement, rowDiv);
      for (let j = 0; j < c; j++) {
        let cell = j + c * i;
        const columnDiv = this.renderer.createElement('div');
        const text = this.renderer.createText(this.dataDiv[i][j]);
        this.renderer.appendChild(columnDiv, text);
        this, this.renderer.setAttribute(columnDiv, "class", "cellDiv");
        if (this.itemShown.goddetShape == 'sqaure' || this.itemShown.goddetShape == 'rectangle') {
          this.renderer.setStyle(columnDiv, 'border-radius', '0px');
          if (this.itemShown.goddetShape == 'rectangle') {
            this.renderer.setStyle(columnDiv, 'height', '83px');
            this.renderer.setStyle(columnDiv, 'width', '47px');
            this.renderer.setStyle(columnDiv, 'text-align', 'left');
            this.renderer.setStyle(columnDiv, 'padding', '0px');
          }
        }
        this.renderer.listen(columnDiv, 'click', () => {
          let color;
          let setColor = prompt("Enter Color", "");
          if (setColor == null || setColor == "") {
            color = "N/A";
          } else {
            color = setColor;
          }
          console.log(color);
          console.log(cell);
          columnDiv.innerHTML = color;
        });
        this.renderer.appendChild(this.container.nativeElement, columnDiv);
      }
    }
  }
  ngOnInit() {
    this.getUserInfo();
    this.getItemData();
    //  this.showGoddetData();
  }

  getItemData() {
    const number = this.route.snapshot.paramMap.get('itemNumber');
    if (number) {
      this.itemsService.getItemData(number).subscribe(res => {
        console.log(res);
        
        this.item = res[0];
        this.itemShown = res[0];
        this.itemShown.updateDate = moment(this.itemShown.updateDate).format("YYYY-MM-DD");
        this.itemShown.licsensDate  = moment(this.itemShown.licsensDate).format("YYYY-MM-DD");
        this.dataDiv = res[0].goddet;
        this.showGoddetData();
      });
    }
  }
  search(event, item) {
    if (event.key === "Enter") {
      this.searchForItem(item)
    }
  }
  searchForItem(item) {
    this.itemsService.getItemData(item).subscribe(res => {
      console.log(res.length)
      if(res.length==0){
        this.toastr.error(item, "Item Not found");
        this.itemShown = Object.assign({}, this.itemCopy);
        this.dataDiv = ["", ""];
        this.showGoddet();
      }
      else{
        this.item = res[0];
        this.itemShown = res[0];
        this.itemShown.updateDate = moment(this.itemShown.updateDate).format("YYYY-MM-DD");
        this.itemShown.licsensDate  = moment(this.itemShown.licsensDate).format("YYYY-MM-DD");
        console.log(res[0]);
        this.dataDiv = res[0].goddet;
        this.showGoddetData();
      }
    })
  }

  writeItemData() {
    console.log(this.itemShown)
    if (confirm("Save changes?")){
      this.itemShown.nameOfupdating = this.user.userName;
      this.getGoddetData();
      this.itemShown.updateDate
      this.itemsService.addorUpdateItem(this.itemShown).subscribe(res =>{

        console.log(res)
        this.toastr.success("Saved", "Changes Saves");
        
      }) ;

    }
  }


  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  docPath;
  bottleFile: boolean = false;
  pumpFile: boolean = false;
  sealFile: boolean = false;
  capFile: boolean = false;


  extra1File: boolean = false;
  extra2File: boolean = false;
  laser1File: boolean = false;
  laser2File: boolean = false;

  main1File: boolean = false;
  main2File: boolean = false;
  main3File: boolean = false;

  labelText: boolean = false;
  plateText: boolean = false;



  selectFile(event, src) {
    switch (src) {
      case 'bottle':
        this.bottleFile = true;
        break;
      case 'pump':
        this.pumpFile = true;
        break;
      case 'seal':
        this.sealFile = true;
        break;
      case 'cap':
        this.capFile = true;
        break;
      case 'extra1':
        this.extra1File = true;
        break;
      case 'extra2':
        this.extra2File = true;
        break;
      case 'laser1':
        this.laser1File = true;
        break;
      case 'laser2':
        this.laser2File = true;
        break;
      case 'main1':
        this.main1File = true;
        break;
      case 'main2':
        this.main2File = true;
        break;
      case 'main3':
        this.main3File = true;
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
        this.showSuccess();
        switch (src) {
          case 'bottle':
            this.bottleFile = false;
            this.item.bottleImage = '' + event.body;
            this.itemShown.bottleImage = '' + event.body;
            break;
          case 'cap':
            this.capFile = false;
            this.item.capImage = '' + event.body;
            this.itemShown.capImage = '' + event.body;
            break;
          case 'pump':
            this.pumpFile = false;
            this.item.pumpImage = '' + event.body;
            this.itemShown.pumpImage = '' + event.body;
            break;
          case 'seal':
            this.sealFile = false;
            this.item.sealImage = '' + event.body;
            this.itemShown.sealImage = '' + event.body;
            break;
          case 'extra1':
            this.extra1File = false;
            this.item.extraImage1 = '' + event.body;
            this.itemShown.extraImage1 = '' + event.body;
            break;
          case 'extra2':
            this.extra2File = false;
            this.item.extraImage2 = '' + event.body;
            this.itemShown.extraImage2 = '' + event.body;
            break;
          case 'laser1':
            this.laser1File = false;
            this.item.laserImage1 = '' + event.body;
            this.itemShown.laserImage1 = '' + event.body;
            break;
          case 'laser2':
            this.laser2File = false;
            this.item.laserImage2 = '' + event.body;
            this.itemShown.laserImage2 = '' + event.body;
            break;
          case 'main1':
            this.main1File = false;
            this.item.imgMain1 = '' + event.body;
            this.itemShown.imgMain1 = '' + event.body;
            break;
          case 'main2':
            this.main2File = false;
            this.item.imgMain2 = '' + event.body;
            this.itemShown.imgMain2 = '' + event.body;
            break;
          case 'main3':
            this.main3File = false;
            this.item.imgMain3 = '' + event.body;
            this.itemShown.imgMain3 = '' + event.body;
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

  getUserInfo() {
    debugger
      this.authService.userEventEmitter.subscribe(user => {
      this.user=user.loggedInUser;
    })
    debugger
    if (!this.authService.loggedInUser) {
      this.authService.userEventEmitter.subscribe(user => {
        if (user.userName) {
          this.user = user;
        }
      });
    }
    else {
      this.user = this.authService.loggedInUser;
    }

  }
}
