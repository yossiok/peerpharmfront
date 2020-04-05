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
    offices:'',
    qaRoomMaterial:'',
    qaRoomFilling:'',
    managerFillingRoom:'',
    inventoryStorage:'',
    oldFillingHall:'',
    remarks:'',
    date:''
  }

  constructor(private formsService: FormsService,private toastr: ToastrService) { }

  ngOnInit() {
  }


  saveFirstAid(){


    this.formsService.saveFirstAidCheck(this.firstAid).subscribe(data=>{
      if(data) {
        this.toastr.success('נשמר בהצלחה!')
      }
      
    })

  }
}
