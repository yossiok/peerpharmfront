import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  allOrderItems = [];
  allItems = [];
  constructor(private route: ActivatedRoute, private searchService: SearchService) { }



  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      let searchterm = data.search;
      this.searchService.searchByText(searchterm).subscribe(data => {
        console.log(data);
        this.allItems = data.allItems.map(x => {
          let y = { toText: "" , itemNumber:x.itemNumber };
          for (const key in x) {
            if (x[key] && x[key] != null && typeof x[key]=='string') {
              var regEx = new RegExp(searchterm, "ig");
             let txt = x[key].replace(regEx,`<span  ><b >${searchterm}</b></span>`);
             if(txt&&txt.includes(searchterm))
              y[key] = txt;
            }
          } 
          y.toText = JSON.stringify(y);
          return y;
        }) 

        this.allOrderItems = data.allOrderItems.map(x => {
          let y = { toText: "" , itemNumber:x.itemNumber, orderNumber:x.orderNumber};

         
          for (const key in x) {
            if (x[key] && x[key] != null && typeof x[key]=='string') {
              var regEx = new RegExp(searchterm, "ig");
             let txt = x[key].replace(regEx,`<span  ><b >${searchterm}</b></span>`);
             if(txt&&txt.includes(searchterm))
              y[key] =txt;
            }
          }
         
          y.toText = JSON.stringify(y);
          return y;
        }) 

      })
    });

  }

}
