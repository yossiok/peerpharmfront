import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  @Input() showModal: boolean;
  @Input() forcereload: boolean;
  
  @Input() title: String;
  @Input() body: String;
  @Output() close = new EventEmitter<void>();
  @ViewChild('alertModal', { static: true }) alertModal: ElementRef;

  constructor() { }

  ngOnInit() {

  }

  onClose() {
    this.close.emit();
    if(this.forcereload)
    {
      location.reload();
    }
  }
}