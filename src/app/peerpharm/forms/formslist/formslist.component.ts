import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';

@Component({
  selector: 'app-formslist',
  templateUrl: './formslist.component.html',
  styleUrls: ['./formslist.component.css']
})
export class FormslistComponent implements OnInit {
  
  forms:any[];
  constructor(private formsService:FormsService) {}

  ngOnInit() {
    this.getForms();
  }

  getForms(){
    this.formsService.getAllForms().subscribe(res=>{
      console.log(res) ;
      debugger;
       this.forms=res});
  }
}
