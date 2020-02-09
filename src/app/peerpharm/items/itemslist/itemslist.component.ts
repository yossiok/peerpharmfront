import { Component, OnInit } from '@angular/core';
import {ItemsService} from '../../../services/items.service'
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {ExcelService} from '../../../services/excel.service';



@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {
  excelToUpload:any;
  itemsCopy:any=[];
  hasMoreItemsToload:boolean=true;
  subscription: any;
 

  items:any[]=[];
  constructor(private itemsService:ItemsService, private toastSrv: ToastrService,  private excelService:ExcelService) { }

  ngOnInit() {
    this.getAllItems();
  }
  exportToExcel(){
    this.itemsService.getItemsWithoutBoxOrStickerFields().subscribe(data=>{
      this.excelService.exportAsExcelFile(data , "items without boxNumber or StickerNumber");

    });
  }

  onDestroy(){
    this.subscription.unsubscribe();
  }

  sendExcelToData(ev) { 
    
  if(confirm("האם אתה בטוח שבחרת בקובץ הנכון ?") == true) {
    var reader = new FileReader();

    reader.readAsDataURL(ev.target.files[0]); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      
    var excelToSend = event.target["result"]
   // excelToSend = excelToSend.replace("data:application/pdf;base64,","");
    this.itemsService.sendExcel({data:excelToSend}).subscribe(data=>{

    })
    }
  
  }
  }

  getAllItems(){
    
    this.subscription = this.itemsService.startNewItemObservable().subscribe((items) => {
      // 
    items.map(item=>{
        item.itemFullName = item.name + " "  +item.subName + " "  +item.discriptionK
        item.licsensDate  = moment(item.licsensDate).format("DD/MM/YYYY");
        if(item.StickerLanguageK != null) {
          item.StickerLanguageK=item.StickerLanguageK.split("/").join(" ");
        }
        
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
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      let tempArr=[];
      this.itemsCopy.filter(x=>{
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
            if(x.itemFullName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.items= tempArr;
         
    }else{
      this.items=this.itemsCopy.slice();
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
    // if(myevent.target.type=="checkbox"){
    //   QuotaVal= myevent.target.nextSibling.nextElementSibling.valueAsNumber ;
    //   if(QuotaVal==NaN) QuotaVal=null;
    //   hasLimition= myevent.target.checked;
    // } else 
    if (licsensNumber!=null && licsensNumber!=undefined && licsensNumber!="" && myevent.target.value>-1){
      QuotaVal= parseInt(myevent.target.value);
      if(myevent.target.value!="" ){
        hasLimition= true;
      }else{
        hasLimition= false;
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
          let itemNumArr=[];
          this.items.filter(item=> {
            if(item.licsensNumber==licsensNumber){
              item.licenceItemsQuotaLimit=QuotaVal;
              item.licenceHasItemsQuotaLimition=hasLimition;
              item.licenceCurrItemsQnt=res.n;
              itemNumArr.push(item.itemNumber)
            }
           });
           this.toastSrv.success("License limitation updated in items number: "+ itemNumArr.join());

        } 
      });
    } else if(myevent.target.value<0) {
      this.toastSrv.error("License items limitation must be bigger than 1");
      myevent.target.value="";
    }else{
      this.toastSrv.error("No license number in item number: "+ itemNumber);
      myevent.target.value="";
    }



  }

// EXCEL EXPORT ---------------------------------------------------------------
  getCurrListToExcel(){
    this.exportAsXLSX(this.items);
  }
  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, 'items');
 }
// ----------------------------------------------------------------------------
}
