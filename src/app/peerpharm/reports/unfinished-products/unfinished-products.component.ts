import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../taskboard/models/UserInfo';
import { FormsService } from 'src/app/services/forms.service';
import { xor } from 'lodash';

@Component({
  selector: 'app-unfinished-products',
  templateUrl: './unfinished-products.component.html',
  styleUrls: ['./unfinished-products.component.scss']
})
export class UnfinishedProductsComponent implements OnInit {

  unfinishedProducts:any[]=[];
  unfinishedProducts2:any[]=[];
 
  
  constructor( private formsService:FormsService) { }

  ngOnInit() {
  //this.getUserInfo();
  this.formsService.getAllUnfinished().subscribe(data=>
  {
    data=data.filter(x=>x.remarks!="עובר לאריזה אישית" && x.qaStatus!="עובר לאריזה אישית"&& (typeof x.tifulApprovedBy == 'undefined' ) );

   this.unfinishedProducts=data;
  });



    //this.getUserInfo();
    this.formsService.getAllUnfinished2().subscribe(data=>
      {
        data=data.filter(x=> (typeof x.tifulApprovedBy == 'undefined' ) );
     this.unfinishedProducts2=data;
      });



  }



  
  closeForm(ev,form)
    {
      ;
      if(confirm('האם אתה בטוח שברצונך לאשר את הטופס?'))
      {
        this.formsService.closeForm(form._id).subscribe(data=>
          {
            alert('הטופס אושר');
            location.reload();
          })
      }

    }

    closeFormPallets(ev, form)
    {
      ;
      if(confirm('האם אתה בטוח שברצונך לאשר את משטחי הטופס ? ?'))
      {
        this.formsService.closeFormPallets(form.formDetailsId).subscribe(data=>
          {
            alert('המשטחים אושרו');
            location.reload();
          })
      }

    }



 

}
