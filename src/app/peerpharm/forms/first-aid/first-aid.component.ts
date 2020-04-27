import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-first-aid',
  templateUrl: './first-aid.component.html',
  styleUrls: ['./first-aid.component.css']
})
export class FirstAidComponent implements OnInit {

  firstAid = {
    roomType:"",
    remarks:'',
    date:'',
    isChecked:''
  }

  allFirstAids:any[]

  constructor(private formsService: FormsService,private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllFirstAids();
  }


  saveFirstAid(){


    this.formsService.saveFirstAidCheck(this.firstAid).subscribe(data=>{
      if(data) {
        this.toastr.success('נשמר בהצלחה!')
        this.getAllFirstAids();
      }
      
    })

  }

  getAllFirstAids(){
    this.formsService.getAllFirstAids().subscribe(data=>{
      debugger;
      for (let i = 0; i < data.length; i++) {
        if(data[i].roomType == 'offices'){
          data[i].roomType = "מזכירות"
        }
        if(data[i].roomType == 'qaRoomMaterial'){
          data[i].roomType = "חדר בקר איכות חוג"
        }
        if(data[i].roomType == 'qaRoomFilling'){
          data[i].roomType = "חדר בקר איכות מילוי"
        }
        if(data[i].roomType == 'managerFillingRoom'){
          data[i].roomType = "חדר מנהל מילוי"
        }
        if(data[i].roomType == 'inventoryStorage'){
          data[i].roomType = "מחסן מלאי"
        }
        if(data[i].roomType == 'oldFillingHall'){
          data[i].roomType = "אולם בישול ישן"
        }
        
      }
      this.allFirstAids = data;
    })
  }
}
