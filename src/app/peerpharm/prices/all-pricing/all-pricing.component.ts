import { Component, OnInit } from '@angular/core';
import { PricingService } from 'src/app/services/pricing.service';

@Component({
  selector: 'app-all-pricing',
  templateUrl: './all-pricing.component.html',
  styleUrls: ['./all-pricing.component.scss']
})
export class AllPricingComponent implements OnInit {
  biddings: any[] = [];
  chosenBidding: any = {}
  showBiddingDetails: boolean = false

  constructor(
    private pricingService: PricingService
  ) { }

  ngOnInit(): void {
    this.pricingService.getAllPricings().subscribe(biddings => {
      this.biddings = biddings;
    })
  }

  openBidding(bidding){
    this.chosenBidding = bidding;
    this.showBiddingDetails = true;
  }

  closeBidding(){
    this.showBiddingDetails = false;
    this.chosenBidding = {}
  }

  

}
