import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ],
})
export class LoaderComponent implements OnInit {
  public loading;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.loadingSubject.subscribe(loading=>{
      this.loading = loading;
    })
  }

  getMessage(){
    return "Please wait..."
  }
}
