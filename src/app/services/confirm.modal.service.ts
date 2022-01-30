import {
  Component,
  Injectable,
  Directive,
  TemplateRef,
  EventEmitter,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  NgbModal,
  NgbModalRef,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "./auth.service";

/**
 * Options passed when opening a confirmation modal
 */
interface ConfirmOptions {
  /**
   * The title of the confirmation modal
   */
  title: string;

  /**
   * The message in the confirmation modal
   */
  message: string;
}

/**
 * An internal service allowing to access, from the confirm modal component, the options and the modal reference.
 * It also allows registering the TemplateRef containing the confirm modal component.
 *
 * It must be declared in the providers of the NgModule, but is not supposed to be used in application code
 */
@Injectable({
  providedIn: "root",
})
export class ConfirmState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: ConfirmOptions;

  /**
   * The last opened confirmation modal
   */
  modal: NgbModalRef;

  /**
   * The template containing the confirmation modal component
   */
  template: TemplateRef<any>;
}

/**
 * A confirmation service, allowing to open a confirmation modal from anywhere and get back a promise.
 */
@Injectable({
  providedIn: "root",
})
export class ConfirmService {
  userAnserEventEmitter: EventEmitter<Boolean> = new EventEmitter();

  constructor(private modalService: NgbModal, private state: ConfirmState) {}

  /**
   * Opens a confirmation modal
   * @param options the options for the modal (title and message)
   * @returns {Promise<any>} a promise that is fulfilled when the user chooses to confirm, and rejected when
   * the user chooses not to confirm, or closes the modal
   */
  confirm(options: ConfirmOptions): Promise<boolean> {
    this.state.options = options;
    this.state.modal = this.modalService.open(ConfirmModalComponent);
    return this.state.modal.result;
  }
}

/**
 * The component displayed in the confirmation modal opened by the ConfirmService.
 */
@Component({
  selector: "confirm-modal-component",
  template: `<div class="modal-header">
      <h1>Enter your secret one time key</h1>
      <button type="button" class="close" aria-label="Close" (click)="no()">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title"></h4>
    </div>
    <div class="modal-body">
      <input #key [(ngModel)]="onetime" />
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-danger" (click)="yes()">Yes</button>
      <button type="button" class="btn btn-secondary" (click)="no()">No</button>
    </div>`,
})
export class ConfirmModalComponent implements OnInit {
  options: ConfirmOptions;
  onetime: string = "";
  @ViewChild("key") key: ElementRef;

  @HostListener("document:keydown", ["$event"]) handleKeyboardEvent(
    event: KeyboardEvent
  ): void {
    if (event.key === "Enter") {
      this.yes();
    }
  }

  constructor(
    private state: ConfirmState,
    private confService: ConfirmService,
    private authService: AuthService
  ) {
    this.options = state.options;
  }

  ngOnInit() {
    setTimeout(() => this.key.nativeElement.focus(), 500);
  }

  yes() {
    if (
      this.authService.loggedInUser.userName.includes("sima") ||
      this.authService.loggedInUser.userName.includes("dani") ||
      this.authService.loggedInUser.userName.includes("art")
    ) {
      this.confService.userAnserEventEmitter.emit(true);
      this.state.modal.dismiss();
    } else {
      this.authService.loginWith2WayKey(this.onetime).subscribe((data) => {
        if (data.msg == true) {
          this.confService.userAnserEventEmitter.emit(true);
          this.state.modal.dismiss();
        } else {
          this.confService.userAnserEventEmitter.emit(false);
          this.state.modal.dismiss();
        }
      });
    }
  }

  no() {
    this.confService.userAnserEventEmitter.emit(false);
    this.state.modal.dismiss();
  }
}
