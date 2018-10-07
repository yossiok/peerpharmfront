import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../../services/items.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-documents',
  templateUrl: './item-documents.component.html',
  styleUrls: ['./item-documents.component.css']
})
export class ItemDocumentsComponent implements OnInit {

  labelText: boolean = false;
  plateText: boolean = false;
  constructor(private itemsService: ItemsService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  notifyDialog(src) {
    if (src == 'plate') { this.plateText = true; this.labelText = false; }
    else if (src == 'label') { this.plateText = false; this.labelText = true; }
  }
  notify(src, txt) {
    console.log(src, txt);
    const number = this.route.snapshot.paramMap.get('itemNumber');
    if (src == 'wordLabel') {
      let docObj = {
        itemNumber: number,
        wordLabelChangeText: txt,
        plateNotifaction: "notifiy",
        labelNotifaction: "notifiy",
      }
      console.log(docObj);
      this.itemsService.updateDocuments(docObj).subscribe(res => console.log(res));
    }
  }

  dismiss(src) {
    if (src == 'plate' || src == 'label') { this.plateText = false; this.labelText = false; }
    const number = this.route.snapshot.paramMap.get('itemNumber');
    let typeTochange = src + "Notifaction";
    let docObj = {
      itemNumber: number,
      [typeTochange]: 'dismiss'
    }
    this.itemsService.updateDocuments(docObj).subscribe(res => console.log(res));
  }

}
