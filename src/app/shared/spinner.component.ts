import {
  Component,
  Input,
  OnDestroy,
  Inject,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-spinner',
  template: `<div class="modal-backdrop fade show" style="z-index: 1111111;" *ngIf="isSpinnerVisible">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
    </div>`,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit, OnDestroy {
  public isSpinnerVisible = true;

  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private loaderService: LoaderService
  ) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );
  }

  ngOnInit(): void{
    this.loaderService.loadingSubject.subscribe(loading=>{
      this.isSpinnerVisible = loading;
    })
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
