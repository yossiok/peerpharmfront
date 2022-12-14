import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { PeerPharmRputs } from "../peerpharm.routing";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "src/app/services/users.service";
import { ToastrService } from "ngx-toastr";
import { InventoryService } from "src/app/services/inventory.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-adminpanel",
  templateUrl: "./adminpanel.component.html",
  styleUrls: ["./adminpanel.component.scss"],
})
export class AdminpanelComponent implements OnInit {
  routes: any[];
  users: any[];
  screens: any[];
  whareHouses: any[];
  EditRowId: any;
  adminPanelAllowed: boolean;
  adminPanelView: boolean;
  passForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
    newpass: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
    firstname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    dep: new FormControl("", [Validators.required, Validators.minLength(2)]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  get username() {
    return this.passForm.get("username");
  }
  get newpass() {
    return this.passForm.get("newpass");
  }
  get firstname() {
    return this.passForm.get("firstname");
  }

  get lastname() {
    return this.passForm.get("lastname");
  }

  get dep() {
    return this.passForm.get("dep");
  }

  get email() {
    return this.passForm.get("email");
  }

  @ViewChild("screenValue") screenValue: ElementRef;

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.edit("");
  }

  constructor(
    private toastService: ToastrService,
    private inventoryService: InventoryService,
    private userService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let user = this.authService.loggedInUser;
    if (user.screenPermission == "1" || user.screenPermission == "2") {
      this.adminPanelView = true;
    } else {
      this.adminPanelView = false;
      console.log(user.screenPermission);
    }

    if (user.authorization.includes("adminPanel")) {
      this.adminPanelAllowed = true;
    } else {
      this.adminPanelAllowed = false;
    }

    this.getAllWhareHouses();
    this.userService.getAllScreens().subscribe((data) => {
      this.routes = [...data];
    });
    this.getAllUsers();
  }

  getAllUsers() {
    this.whareHouses;
    this.userService.getAllUsers().subscribe((users) => {
      // FAILED: trying to get wharehouses names but names doesnt match IDs.... ????
      users.forEach((user) => {
        if (user.allowedWH.length > 0) {
          for (let i = 0; i < user.allowedWH.length; i++) {
            for (let whareHouseObj of this.whareHouses) {
              if (whareHouseObj._id == user.allowedWH[i]) {
                user.allowedWH[i] = whareHouseObj.name;
              }
            }
          }
        }
      });
      this.users = users;
    });
  }

  getAllWhareHouses() {
    this.inventoryService.getWhareHousesList().subscribe((whareHouses) => {
      this.whareHouses = whareHouses;
    });
  }

  edit(id) {
    if (!this.adminPanelAllowed) return;
    if (id != "") {
      this.EditRowId = id;
    } else {
      this.EditRowId = "";
    }
  }

  setUserPermissionLvl(ev, id) {
    var permLevel = ev.target.value;
    this.userService.setUserPermission(permLevel, id).subscribe((user) => {
      if (user) {
        var oldUser = this.users.find((u) => u._id == user._id);
        oldUser.screenPermission = user.screenPermission;
        this.toastService.success("?????????? ?????????? ???????????? ???????????? !");
        this.edit("");
      }
    });
  }

  savePermission(name) {
    if (this.screenValue.nativeElement.value != "") {
      this.userService
        .savePermissionToScreen({
          name: name,
          permission: this.screenValue.nativeElement.value,
        })
        .subscribe((data) => {
          if (data) {
            var screen = this.routes.find((s) => s.name == data.name);

            this.toastService.success("???????????? ?????????? ????????????");
          }
        });
    } else {
      this.toastService.error("?????? ???? ???????? ???????? ???????????? ??????");
    }
  }

  resetPassword(user) {
    confirm("?????? ???????? ?????????? ??????????, ?????? ?????????????");
    console.log(user);
    let pass = this.passForm.controls.newpass.value;
    if (pass.length >= 6 && pass.length <= 30) {
      this.userService.getPassword(user).subscribe((data) => {
        console.log(data);
        if (data && !data.msg) {
          this.userService.resetPassword(user, pass).subscribe((data) => {
            console.log(data);
            if (data && !data.msg) {
              this.passForm.reset();
              this.toastService.success("???????????? ???????????? ???????????? !");
              return;
            } else {
              this.toastService.error(
                "???????????? ???? ????????????, ?????????? ???????????? ??????????,???? ???????????? ?????????? ????????????."
              );
              return;
            }
          });
        } else {
          this.toastService.error(
            "???????????? ???? ????????????, ???? ?????????? ?????????? ???? ?????????? ?????????? ????????????"
          );
          console.log("Failed to reset");
          console.log(data.msg);
        }
      });
    } else {
      this.toastService.error(
        "  ???????????? ?????????? ?????????? 6 ?????????? ?????????? ?????? ???????? ?? 30 ??????????."
      );
      return;
    }
  }

  addNewUser(data) {
    console.log(data);
    const { username, newpass, firstname, lastname, dep, email } = data;
    if (
      username.trim().length > 2 &&
      newpass.trim().length > 5 &&
      firstname.trim().length > 2 &&
      lastname.trim().length > 2 &&
      dep.trim().length > 2
    ) {
      data.password = newpass;
      delete data.newpass;
      console.log(data);
      this.userService.addNewUser(data).subscribe(
        (response) => {
          if (response) {
            console.log(response);
            this.toastService.success("?????????? ?????? ???????? ????????????");
            this.passForm.reset();
          }
        },
        (err) => {
          console.log(err.status);

          if (err.status == 401)
            this.toastService.error("???? ???????????? ?????? ???????? ????????????");
          this.toastService.error("???????????? ???? ????????????");
        }
      );
    } else {
      alert("?????????????? ?????????????? ???? ????????????, ???????? ???????? ????????.");
    }
  }

  resetForm() {
    this.passForm.reset();
  }
}
