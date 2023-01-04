import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-global-search",
  templateUrl: "./global-search.component.html",
  styleUrls: ["./global-search.component.scss"],
})
export class GlobalSearchComponent implements OnInit {
  searchTerm: string = "";
  @ViewChild('searchInput', {static: false}) inputEl: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  doSearch = () => {
    if (!this.searchTerm){
      this.inputEl.nativeElement.focus();
      return;
    }
    location.href = "/#/peerpharm/search?search=" + this.searchTerm;
  };

  doClear = () => {
    this.searchTerm = "";
    this.inputEl.nativeElement.focus();

  }
}
