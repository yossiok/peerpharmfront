import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-historylogs',
  templateUrl: './historylogs.component.html',
  styleUrls: ['./historylogs.component.css']
})
export class HistorylogsComponent implements OnInit {
logs:any[]=[];
  constructor(private logsService:LogsService) { }

  ngOnInit() {
    this.logsService.getAll().subscribe(data=>
      {
        this.logs=data;
      })
  }

}
