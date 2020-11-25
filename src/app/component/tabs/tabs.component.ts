import { Component } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbd-pagination',
  templateUrl: './tabs.component.html'
})
export class NgbdtabsBasicComponent {
  public beforeChange($event: NgbNavChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }
}
