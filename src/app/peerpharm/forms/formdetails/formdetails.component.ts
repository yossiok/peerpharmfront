import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formdetails',
  templateUrl: './formdetails.component.html',
  styleUrls: ['./formdetails.component.css']
})
export class FormdetailsComponent implements OnInit {

  form:any= {};
  constructor(private formsService: FormsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getFormData();
  }

  getFormData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formsService.getFormData(id).subscribe(res => {
        console.log(res);
        this.form = res[0];
        console.log(this.form);

      })
    }
  }
}
