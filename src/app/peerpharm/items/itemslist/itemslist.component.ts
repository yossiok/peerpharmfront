import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ItemsService } from "../../../services/items.service";
import * as moment from "moment";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ExcelService } from "../../../services/excel.service";
import { AuthService } from "src/app/services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReturnStatement } from "@angular/compiler";

@Component({
  selector: "app-itemslist",
  templateUrl: "./itemslist.component.html",
  styleUrls: ["./itemslist.component.scss"],
})
export class ItemslistComponent implements OnInit {
  @ViewChild("itemLicenseNum") itemLicenseNum: ElementRef;
  @ViewChild("itemLicenseDate") itemLicenseDate: ElementRef;

  items: any[] = [];
  itemsCopy: any = [];
  excelToUpload: any;
  subscription: any;
  EditRowId: String = "";
  hasMoreItemsToload: boolean = true;
  showCurtain: boolean = false;
  complete: boolean = false;
  filtering: boolean = false;
  getAllProducts: boolean = false;

  searchMenu: FormGroup = new FormGroup({
    itemNumber: new FormControl(""),
    itemName: new FormControl(""),
    componentN: new FormControl(""),
    minVolume: new FormControl(null, Validators.min(0)),
    maxVolume: new FormControl(null, Validators.min(1)),
    barcode: new FormControl(""),
    customerName: new FormControl(""),
  });

  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    console.log(event);

    this.edit("");
  }
  constructor(
    private itemsService: ItemsService,
    private toastSrv: ToastrService,
    private excelService: ExcelService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.getAllItems();
  }

  getAllItemsNew() {
    let conf = confirm(
      "פעולה זו מעמיסה על המערכת, ממומלץ להשתמש בשדות החיפוש. האם להמשיך?"
    );
    if (!conf) return;
    this.complete = false;
    this.getAllProducts = true;
    this.searchMenu.reset();
    this.filtering = true;
    this.items = [];
    this.itemsCopy = [];

    this.itemsService.getAllproductsNew().subscribe((data) => {
      console.log(data);
      if (data.msg) {
        this.toastSrv.error(data.msg);
        return;
      } else if (data && data.length > 0) {
        data.map((item) => {
          // item.itemFullName =
          //   item.name + " " + item.subName + " " + item.discriptionK;
          // item.licsensDate = moment(item.licsensDate).format("DD/MM/YYYY");
          if (item.StickerLanguageK != null) {
            item.StickerLanguageK = item.StickerLanguageK.split("/").join(" ");
          }
        });
        this.items = data;
        this.itemsCopy = data;
        this.filtering = false;
        this.complete = true;
      }
    });
  }
  // using skip and limit
  getAllItems() {
    this.complete = false;
    this.getAllProducts = true;
    this.searchMenu.reset();
    this.filtering = false;
    this.items = [];
    this.itemsCopy = [];
    this.subscription = this.itemsService.startNewItemObservable().subscribe(
      (items) => {
        // map items
        this.filtering = true;
        items.map((item) => {
          // item.itemFullName =
          //   item.name + " " + item.subName + " " + item.discriptionK;
          // item.licsensDate = moment(item.licsensDate).format("DD/MM/YYYY");
          if (item.StickerLanguageK != null) {
            item.StickerLanguageK = item.StickerLanguageK.split("/").join(" ");
          }
        });
        items.sort(function (a, b) {
          return a.itemNumber - b.itemNumber;
        });
        this.items.push(...items);
        if (items.length < 1500) {
          this.hasMoreItemsToload = false;
        }
        this.itemsCopy = this.items.slice();
        console.log(this.items.length);
        setTimeout(() => (this.filtering = false), 500);
      },
      null,
      () => {
        this.complete = true;
        console.log(this.items.length);
      }
    );
  }
  search() {
    console.log(this.searchMenu.value);
    let fields = false;
    for (let key in this.searchMenu.value) {
      fields = this.searchMenu.value[key] ? true : fields;
    }
    if (!fields) {
      alert("יש להכניס לפחות ערך אחחד בשדות החיפוש");
      return;
    }

    this.complete = false;
    this.getAllProducts = true;
    this.filtering = true;
    this.items = [];
    this.itemsService
      .getProductsByQuery(this.searchMenu.value)
      .subscribe((items) => {
        if (items && items.msg) {
          this.toastSrv.error(items.msg);
          this.filtering = false;
          return;
        } else if (items && items.length > 0) {
          console.log(items);

          items.map((item) => {
            // item.itemFullName = item.lognName;
            // item.name + " " + item.subName + " " + item.discriptionK;
            item.licensDate =
              item.licensDate == "Invalid date"
                ? item.licensDate
                : new Date(item.licensDate);
            // item.licsensDate = moment(item.licsensDate).format("DD/MM/YYYY");
            if (item.StickerLanguageK != null) {
              item.StickerLanguageK =
                item.StickerLanguageK.split("/").join(" ");
            }
          });
          items.sort(function (a, b) {
            return a.itemNumber - b.itemNumber;
          });
          this.items = items;
          this.itemsCopy = items;
          this.complete = true;
          this.getAllProducts = true;
          this.filtering = false;
        } else {
          this.toastSrv.error("לא נמצאו נתונים המתאימים לחיפוש");
          this.filtering = false;
          return;
        }
      });
  }

  clearFields() {
    this.searchMenu.reset();
  }
  resetResults() {
    this.searchMenu.reset();
    this.complete = false;
    this.getAllProducts = false;
    this.filtering = true;
    this.items = [];
  }

  checkPermission() {
    return this.authService.loggedInUser.screenPermission == "5";
  }

  exportToExcel() {
    this.itemsService.getItemsWithoutBoxOrStickerFields().subscribe((data) => {
      this.excelService.exportAsExcelFile(
        data,
        "items without boxNumber or StickerNumber"
      );
    });
  }

  saveEdit(id) {
    var obj = {
      licenseNumber: this.itemLicenseNum.nativeElement.value,
      licenseDate: this.itemLicenseDate.nativeElement.value,
      itemId: id,
    };

    this.itemsService.updateItemDetails(obj).subscribe((data) => {
      data;
      if (data) {
        var item = this.items.find((i) => i._id == data._id);
        item.licsensNumber = data.licsensNumber;
        item.licsensDate = data.licsensDate;
        this.edit("");
        this.toastSrv.success("Item Updated Successfuly");
        this.getAllItems();
      }
    });
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }

  sendExcelToData(ev) {
    if (confirm("האם אתה בטוח שבחרת בקובץ הנכון ?") == true) {
      this.showCurtain = true;
      var reader = new FileReader();

      reader.readAsDataURL(ev.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed

        var excelToSend = event.target["result"];
        // excelToSend = excelToSend.replace("data:application/pdf;base64,","");
        this.itemsService.sendExcel({ data: excelToSend }).subscribe((data) => {
          this.showCurtain = false;
          alert(data.msg);
        });
      };
    }
  }

  filterByNumber(ev) {
    this.filtering = true;
    let numName = ev.target.value;
    if (numName == "") this.items = this.itemsCopy;
    numName = numName.toLowerCase();
    this.items = this.itemsCopy
      .filter((i) => {
        if (
          (i.itemNumber && i.itemNumber.includes(numName)) ||
          (i.longName && i.longName.toLowerCase().includes(numName))
        )
          return i;
      })
      .sort((a, b) => a.itemNumber.length - b.itemNumber.length);
    this.filtering = false;
    // setTimeout(() => (this.filtering = false), 500);
  }

  filterByComponent(ev) {
    if (!ev.target.value || ev.target.value.length < 4) {
      return;
    }

    this.filtering = true;
    let compNumber = ev.target.value;
    if (ev.target.value == "") this.items = this.itemsCopy;
    this.items = this.itemsCopy.filter(
      (i) =>
        i.sealNumber == compNumber ||
        i.bottleNumber == compNumber ||
        i.capNumber == compNumber ||
        i.tubeNumber == compNumber ||
        i.cartonNumber == compNumber ||
        i.stickerNumber == compNumber ||
        i.boxNumber == compNumber ||
        i.pumpNumber == compNumber
    );
    setTimeout(() => (this.filtering = false), 500);
  }

  filterByStatus(ev) {
    this.filtering = true;
    var status = ev.target.value;
    if (status != "all") {
      this.items = this.itemsCopy.filter((i) => i.status == status);
    } else {
      this.items = this.itemsCopy;
    }
    setTimeout(() => (this.filtering = false), 500);
  }

  filterByLanguage(ev) {
    this.filtering = true;
    var language = ev.target.value;
    if (language != "all") {
      this.items = this.itemsCopy.filter((i) => i.StickerLanguageK == language);
    } else {
      this.items = this.itemsCopy;
    }
    setTimeout(() => (this.filtering = false), 500);
  }

  // changeText(ev) {
  //   let word = ev.target.value;
  //   let wordsArr = word.split(" ");
  //   wordsArr = wordsArr.filter(x => x != "");
  //   if (wordsArr.length > 0) {
  //     let tempArr = [];
  //     this.itemsCopy.filter(x => {
  //       var check = false;
  //       var matchAllArr = 0;
  //       wordsArr.forEach(w => {
  //         if (x.itemFullName.toLowerCase().includes(w.toLowerCase())) {
  //           matchAllArr++
  //         }
  //         (matchAllArr == wordsArr.length) ? check = true : check = false;
  //       });

  //       if (!tempArr.includes(x) && check) tempArr.push(x);
  //     });
  //     this.items = tempArr;

  //   } else {
  //     this.items = this.itemsCopy.slice();
  //   }
  // }

  updateLicenseQuotaLimitation(
    myevent,
    itemNumber,
    licsensNumber,
    licenceCurrItemsQnt,
    licenceExprationDate,
    licenceFileLink,
    licenceLastUpdateDate,
    licenceLastUpdateUser,
    licenceNotifaction
  ) {
    console.log(myevent);
    let QuotaVal;
    let hasLimition;
    if (licenceFileLink == undefined) licenceFileLink = "";
    if (licenceLastUpdateUser == undefined) licenceLastUpdateUser = "";
    if (licenceLastUpdateDate == undefined) licenceLastUpdateDate = "";
    if (licenceNotifaction == undefined) licenceNotifaction = "";
    // if(myevent.target.type=="checkbox"){
    //   QuotaVal= myevent.target.nextSibling.nextElementSibling.valueAsNumber ;
    //   if(QuotaVal==NaN) QuotaVal=null;
    //   hasLimition= myevent.target.checked;
    // } else
    if (
      licsensNumber != null &&
      licsensNumber != undefined &&
      licsensNumber != "" &&
      myevent.target.value > -1
    ) {
      QuotaVal = parseInt(myevent.target.value);
      if (myevent.target.value != "") {
        hasLimition = true;
      } else {
        hasLimition = false;
      }
      let docObj = {
        licsensNumber: licsensNumber,
        // itemNumber:itemNumber,
        licenceItemsQuotaLimit: QuotaVal,
        licenceHasItemsQuotaLimition: hasLimition,
        licenceCurrItemsQnt: licenceCurrItemsQnt,
      };
      this.itemsService.updateLicenseLimition(docObj).subscribe((res) => {
        if (res.nModified > 0) {
          let itemNumArr = [];
          this.items.filter((item) => {
            if (item.licsensNumber == licsensNumber) {
              item.licenceItemsQuotaLimit = QuotaVal;
              item.licenceHasItemsQuotaLimition = hasLimition;
              item.licenceCurrItemsQnt = res.n;
              itemNumArr.push(item.itemNumber);
            }
          });
          this.toastSrv.success(
            "License limitation updated in items number: " + itemNumArr.join()
          );
        }
      });
    } else if (myevent.target.value < 0) {
      this.toastSrv.error("License items limitation must be bigger than 1");
      myevent.target.value = "";
    } else {
      this.toastSrv.error("No license number in item number: " + itemNumber);
      myevent.target.value = "";
    }
  }

  edit(id) {
    if (id != "") {
      this.EditRowId = id;
    } else {
      this.EditRowId = "";
    }
  }

  // EXCEL EXPORT ---------------------------------------------------------------
  getCurrListToExcel() {
    this.exportAsXLSX(this.items);
  }
  exportAsXLSX(data) {
    this.excelService.exportAsExcelFile(data, "items");
  }
  // ----------------------------------------------------------------------------
}
