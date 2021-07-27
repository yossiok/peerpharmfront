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
  editBidding: boolean = false

  constructor(
    private pricingService: PricingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBiddings()
  }

  getAllBiddings() {
    this.pricingService.getAllPricings().subscribe(biddings => {
      this.biddings = biddings;
      this.showBiddingDetails = false
    })
  }

  openBidding(bidding) {
    this.chosenBidding = bidding;
    this.showBiddingDetails = true;
  }

  closeBidding() {
    this.showBiddingDetails = false;
    this.chosenBidding = {}
  }

  deleteBidding(biddingNumber) {
    if (confirm(`Delete Bidding ${biddingNumber} ?`))
      this.pricingService.deletePricing(biddingNumber).subscribe(data => {
        if (data.ok == 1) {
          this.getAllBiddings()
          this.toastr.success('Bidding Deleted')
        }
        else this.toastr.error('Something Went Wrong.')
      })
  }

  saveBidding() {

  }

  setClass() {
    if(this.editBidding) return 'fa-arrow-left'
    else return 'fa-pencil-alt'
  }



}
