import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
    private pricingService: PricingService,
    private toastr: ToastrService
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

  deleteBidding(biddingNumber) {
    if(confirm(`Delete Bidding ${biddingNumber} ?`))
    this.pricingService.deletePricing(biddingNumber).subscribe(data => {
      if(data.ok == 1) {
        let biddingIndex = this.biddings.findIndex(bidding => bidding.number == biddingNumber)
        this.biddings.splice(biddingIndex, 1)
        this.showBiddingDetails = false;
        this.toastr.success('Bidding Deleted')
      } 
      else this.toastr.error('Something Went Wrong.')
    })
  }

  

}
