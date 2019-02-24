import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidatorFn
} from "@angular/forms";
import * as moment from "moment";
import { UserInfo } from "./../taskboard/models/UserInfo";
import { UsersService } from "./../../services/users.service";
import { AuthService } from "./../../services/auth.service";
import { NotificationService } from "./../../services/notification.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"]
})
export class NotificationComponent implements OnInit {
  allUsers: UserInfo[];
  loggedInUser: UserInfo;
  noteForm: FormGroup;
  noteCreated: any;
  allCheck = false;
  selectedUserIds: any[];
  MOCK_selectedUserIds: string[];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.MOCK_selectedUserIds = ['5b48b2c9abc088119cd73605',
    '5b48b2c9abc088119cd73604', '5b48b2c9abc088119cd73607'];
    this.noteCreated = new Date();
    this.noteCreated = moment(this.noteCreated).format("YYYY-MM-DD");

    this.initNoteForm();
    this.GetUserAllData();
    this.GetLoggedInUser();
  }

  initNoteForm() {
    this.noteForm = this.formBuilder.group({
      noteCreated: new FormControl(this.noteCreated, [Validators.required]),
      userId: new FormControl("", [Validators.required]),
      noteContent: new FormControl("", [Validators.required]),
      sendUsers: new FormArray([], this.MinSelectedCheckboxes(1)),
      recievedUsers: new FormControl("", [Validators.required])
    });
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
      const control = <FormArray>this.noteForm.controls.sendUsers;
      initArr.forEach((element, index) => {
        control.push(initArr[index]);
      });
    });
  }

  GetLoggedInUser() {
    this.authService.userEventEmitter.subscribe(user => {
      this.loggedInUser = user;
      if(this.MOCK_selectedUserIds.includes(this.loggedInUser._id)) {
        this.toastrService.success("Guten Morgen",
        "You have recieved new notification from: ", {
          timeOut: 0,
          extendedTimeOut: 0
        }
        );
      }
    });
  }

  allUserSelect() {
    if (this.allCheck) {
      this.allCheck = false;
    } else {
      this.allCheck = true;
    }
    console.log(this.allCheck);
  }

  // onSubmit(): void {
  //   event.preventDefault();
  //   if (!this.allCheck) {
  //      this.selectedUserIds = this.noteForm.value.sendUsers
  //       .map((v, i) => (v ? this.allUsers[i]._id : null))
  //       .filter(v => v !== null);

  //     for (
  //       let index = 0;
  //       index < this.noteForm.controls.sendUsers.controls.length;
  //       index++
  //     ) {
  //       if (!this.noteForm.controls.sendUsers.controls[index].value) {
  //         this.noteForm.controls.sendUsers.removeAt(index);
  //         index--;
  //       }
  //     }
  //   }
  //   else {
  //     this.selectedUserIds = this.noteForm.value.sendUsers
  //     .map((v, i) => (v ? null : this.allUsers[i]._id))
  //     .filter(v => v !== null);
  //   }

  //   this.noteForm.controls["sendUsers"].setValue(this.selectedUserIds);
  //   this.noteForm.controls["userId"].setValue(this.loggedInUser._id);

  //   const newNotification = this.noteForm.value;
  //   // console.log(newNotification);

  // //  debugger;
  //   this.notificationService.joinNotes(newNotification.sendUsers);
  //   this.notificationService.sendMsg(newNotification);

  //   this.notificationService
  //     .addNotification(
  //       newNotification.noteCreated,
  //       newNotification.userId,
  //       newNotification.noteContent,
  //       newNotification.sendUsers,
  //       newNotification.recievedUsers
  //     )
  //     .subscribe(data => console.log("added " + data));

  // }
}
