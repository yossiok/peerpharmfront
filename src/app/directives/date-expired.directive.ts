import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appDateExpired]'
})
export class DateExpiredDirective {

  @Input() checkExpired

  constructor(el: ElementRef) { 
 
    if(JSON.stringify(this.checkExpired) < JSON.stringify(new Date) ){
      el.nativeElement.style.color = "red";
    }
      
    }


}
