import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ItemsService } from '../../../services/items.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-itemdetais',
  templateUrl: './itemdetais.component.html',
  styleUrls: ['./itemdetais.component.css']
})
export class ItemdetaisComponent implements OnInit {
  newItem:FormGroup;
  item: any = {};
  itemShown= {
    itemNumber:'',
    name: '',
    subName: '',
    discriptionK: '',
    proRemarks: '' ,
    impRemarks: '' ,
    
    updateDate: '',
    nameOfupdating:'31232',
    versionNumber:'',
    
    stickerNumber: '',
    stickerTypeK: '',
    boxNumber: '',
    boxTypeK: '',
    barcodeK: '',
    StickerLanguageK: '',
    volumeKey:'',
    netWeightK: '',
    grossUnitWeightK:'',
    
    licsensNumber:'',
    licsensDate:'',
    country:'',
    
    netCtnWeightK: '',
    grossCtnWeightK:'' ,
    
    cartonNumber: '' ,
    PcsCarton: '',
    pumpDirection:'' ,
    paletteType: '' , 
    st1layerCarton:  '', 
    totalCartonPalette: '' ,
    
    cbm:''  ,
    motherP: '' ,
    itemType: '' ,
    
    item1w: '',
    item1s: '' ,
    item2w: '' ,
    item2s: '' ,
    item3w: '' ,
    item3s: '' ,
    item4w: '' ,
    item4s: '' ,
    itemStickerW: '',
    itemStickerS: '',
    itemBoxS : '' ,
    itemBoxW : ''  ,
    itemCtnW : '',
    itemCtnS : '' , 
    
    bottleNumber:'',
    capNumber:'',
    pumpNumber:'',
    sealNumber: '' ,
    
    bottleTube: '',
    capTube: '' ,
    pumpTube:'',
    sealTube:'',
    
    extraText1: '' ,
    extraText2: '' ,
    
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
    sealImage: '' ,
    
  }
  constructor(private route: ActivatedRoute, private itemsService: ItemsService, private fb: FormBuilder) { 
    
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

    });
  }

  ngOnInit() {
    this.getItemData();
  }

  getItemData() {
    const number = this.route.snapshot.paramMap.get('itemNumber');
    if (number) {
      this.itemsService.getItemData(number).subscribe(res => {
        console.log(res);
        this.item = res[0];
        this.itemShown= res[0];
      });
    }
  }

  writeItemData(){
    console.log(this.itemShown)
    this.itemsService.addorUpdateItem(this.itemShown).subscribe(res=>console.log(res));
  }
}
