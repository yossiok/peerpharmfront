import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
  

@Component({
  selector: 'app-costumers-list',
  templateUrl: './costumers-list.component.html',
  styleUrls: ['./costumers-list.component.css']
})
export class CostumersListComponent implements OnInit {
  closeResult: string;
  costumers:any[];
  costumer={
    costumerId:'',
    costumerName:'',
    fax:'',
    invoice :'',
    delivery :'',
    country:'',
    contact:''
  }

  constructor(private modalService: NgbModal, private costumersService:CostumersService) {}
  
  
  open(content) {
    this.costumer={costumerId:'',
    costumerName:'',
    fax:'',
    invoice :'',
    delivery :'',
    country:'',
    contact:''}
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
      
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(content, i){
    console.log(this.costumers[i]);
    this.costumer = this.costumers[i];
    this.modalService.open(content).result.then((result)=>{
      
    })
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {  
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getCostumers(){
    this.costumersService.getAllCostumers().subscribe(res=>this.costumers=res);
  }

  addNewCostumer(){
    this.costumersService.addorUpdateCostumer(this.costumer).subscribe(res=>{
      console.log(res)
      this.costumers.push(res);
    })
  }
  ngOnInit() {
    this.getCostumers();
  }

}
