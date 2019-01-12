import { Component, OnInit } from '@angular/core';
import {ItemsService} from '../../../services/items.service'
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {
  itemsCopy:any=[];
  hasMoreItemsToload:boolean=true;
  subscription: any;
 

  items:any[]=[];
  constructor(private itemsService:ItemsService) { }

  ngOnInit() {
    this.getAllItems();
  }

  onDestroy(){
    this.subscription.unsubscribe();
  }


  getAllItems(){
    
    this.subscription = this.itemsService.startNewItemObservable().subscribe((items) => {
      // debugger;
    items.map(item=>{
        item.itemFullName = item.name + " "  +item.subName + " "  +item.discriptionK
        item.licsensDate  = moment(item.licsensDate).format("DD/MM/YYYY");
      })
      this.items.push(...items); 
      if(items.length<500)
      {
        this.hasMoreItemsToload=false;
      }
      this.itemsCopy=this.items.slice();
    } );
  
  }

  changeText(ev)
  {
    let word= ev.target.value;
    if(word=="")
    {
      this.items=this.itemsCopy.slice();
    }
    else
    { 
      this.items= this.items.filter(x=>x.itemFullName.toLowerCase().includes(word.toLowerCase())); 
    }
  }

  updateLicenseQuotaLimitation(myevent, itemNumber, licsensNumber,licenceCurrItemsQnt,licenceExprationDate, licenceFileLink,licenceLastUpdateDate, licenceLastUpdateUser, licenceNotifaction){
    console.log(myevent);
    let QuotaVal;
    let hasLimition;
    if(licenceFileLink==undefined) licenceFileLink="";
    if(licenceLastUpdateUser==undefined) licenceLastUpdateUser="";
    if(licenceLastUpdateDate==undefined) licenceLastUpdateDate="";
    if(licenceNotifaction==undefined) licenceNotifaction="";


    if(myevent.target.type=="checkbox"){
      QuotaVal= myevent.target.nextSibling.nextElementSibling.valueAsNumber ;
      if(QuotaVal==NaN) QuotaVal=null;
      hasLimition= myevent.target.checked;
    } else if (myevent.target.type=="number"){
     hasLimition= myevent.target.previousElementSibling.checked;
     QuotaVal= parseInt(myevent.target.value);
    }

    let docObj = {
      licsensNumber:licsensNumber,
      // itemNumber:itemNumber,
      licenceItemsQuotaLimit: QuotaVal,
      licenceHasItemsQuotaLimition: hasLimition,
      licenceCurrItemsQnt:licenceCurrItemsQnt,
    }
  this.itemsService.updateLicenseLimition(docObj).subscribe(res => {
      if(res.nModified>0){
        this.items.filter(item=> {
          if(item.licsensNumber==licsensNumber){
            item.licenceItemsQuotaLimit=QuotaVal;
            item.licenceHasItemsQuotaLimition=hasLimition;
            item.licenceCurrItemsQnt=res.n;
          }
         });
      } 

    });

  }

}
