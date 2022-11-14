import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-comax-items-index",
  templateUrl: "./comax-items-index.component.html",
  styleUrls: ["./comax-items-index.component.scss"],
})
export class ComaxItemsIndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    try {
      console.log("Ng on init");
    } catch (error) {
      console.log(error);
    }
  }
}
