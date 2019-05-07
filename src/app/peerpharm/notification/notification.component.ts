import { Component, OnInit, EventEmitter } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidatorFn
} from "@angular/forms";
import { take } from "rxjs/operators";
import * as moment from "moment";
import { UserInfo } from "./../taskboard/models/UserInfo";
import { UsersService } from "./../../services/users.service";
import { AuthService } from "./../../services/auth.service";
import { NotificationService } from "./../../services/notification.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"]
})
export class NotificationComponent implements OnInit {
  allUsers: UserInfo[];
  loggedInUser: UserInfo;
  noteForm: FormGroup;
  sendControl: any;
  receiveUserArr: any[] = new Array();
  noteCreated: any;
  allCheck = false;
  selectedUserIds: string[] = null;
  newNotification: any;
  recievedNote: any = null;
  newNoteId: string;
  editNote: any;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.GetUserInfo();

    this.notificationService.newMessageRecivedEventEmitter.subscribe(data => {
      this.recievedNote = data;
      //   console.log(this.recievedNote, "Notifications");

      // 5b48b2c9abc088119cd73604 sima Id
      if (this.recievedNote) {
        this.selectedUserIds = this.recievedNote.sendUsers;
        this.SendNotesById();
      }
    });

    this.noteCreated = new Date();
    this.noteCreated = moment(this.noteCreated).format("YYYY-MM-DD");

    this.initNoteForm();
    this.GetUserAllData();
  }

  initNoteForm() {
    this.noteForm = this.formBuilder.group({
      noteCreated: new FormControl(this.noteCreated, [Validators.required]),
      userId: new FormControl("", [Validators.required]),
      noteContent: new FormControl("", [Validators.required]),
      sendUsers: new FormArray([], this.MinSelectedCheckboxes(1)), // checks double checkbox - WHY???
      recievedUsers: new FormControl("", [Validators.required])
    });

    this.sendControl = <FormArray>this.noteForm.get("sendUsers");
   // this.receiveControl = <FormArray>this.noteForm.get("recievedUsers");
  }

  MinSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  GetUserAllData() {
    this.usersService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      const initArr = this.allUsers.map(c => new FormControl(false));
      initArr.forEach((element, index) => {
        this.sendControl.push(initArr[index]);
      });
    });
  }

  SendNotesById() {
    if (this.selectedUserIds.includes(this.loggedInUser._id)) {
      this.toastrService
        .success(
          this.recievedNote.noteContent,
          "Message From: " +
            this.loggedInUser.firstName +
            " " +
            this.loggedInUser.lastName,
          {
            closeButton: true,
            timeOut: 0,
            extendedTimeOut: 0
          }
        )
        .onHidden.pipe(take(1))
        .subscribe(() => this.toasterClickedHandler());
    }
  }

  toasterClickedHandler() {
    this.receiveUserArr.push(this.loggedInUser._id);
    this.editNote = {
      noteId: this.newNoteId,
      noteCreated: this.newNotification.noteCreated,
      userId: this.newNotification.userId,
      noteContent: this.newNotification.noteContent,
      sendUsers: this.newNotification.sendUsers,
      recievedUsers: this.receiveUserArr
    };
    this.notificationService.editNotification(this.editNote).subscribe(res => {
      console.log(res);
    });
  }

  GetUserInfo() {
    this.authService.userEventEmitter.subscribe(user => {
      this.loggedInUser = user;
    });
    if (this.loggedInUser == null) {
      this.authService.getLoggedInUser().subscribe();
    }
  }

  allUserSelect() {
    if (this.allCheck) {
      this.allCheck = false;
    } else {
      this.allCheck = true;
    }
  }

  onSubmit(): void {
    
    event.preventDefault();

    if (!this.allCheck) {
      this.selectedUserIds = this.noteForm.value.sendUsers
        .map((v, i) => (v ? this.allUsers[i]._id : null))
        .filter(v => v !== null);

      for (let index = 0; index < this.sendControl.controls.length; index++) {
        if (!this.sendControl.controls[index].value) {
          this.sendControl.removeAt(index);
          index--;
        }
      }
    } else {
      // this.noteForm.value.sendUsers= this.allUsers.map(user=> user._id);
      // console.log('this.noteForm.value.sendUsers',this.noteForm.value.sendUsers);
      // this.selectedUserIds = this.noteForm.value.sendUsers.filter(usr=> usr!=null);
      // this.selectedUserIds.push(this.loggedInUser._id)
      // console.log('this.selectedUserIds',this.selectedUserIds);

      this.selectedUserIds = this.noteForm.value.sendUsers
        .map((v, i) => (v ? null : this.allUsers[i]._id))
        .filter(v => v !== null);
    }

    this.noteForm.controls["sendUsers"].setValue(this.selectedUserIds);
    this.noteForm.controls["userId"].setValue(this.loggedInUser._id);
    this.newNotification = this.noteForm.value;

    this.notificationService.joinNotes(this.newNotification.sendUsers);
    this.notificationService.sendMsg(this.newNotification);

    this.notificationService
      .addNotification(
        this.newNotification.noteCreated,
        this.newNotification.userId,
        this.newNotification.noteContent,
        this.newNotification.sendUsers,
        this.newNotification.recievedUsers
      )
      .subscribe(data => {
        this.newNoteId = data._id;
        console.log("added " + data);
      });
  }
}
