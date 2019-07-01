import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CostumersService } from '../../../services/costumers.service';
import { ToastrService } from 'ngx-toastr';
import { SuppliersService } from 'src/app/services/suppliers.service';


@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})



export class SuppliersComponent implements OnInit {
  closeResult: string;
  suppliers: any[];
  suppliersCopy: any[];

  supplier = {
    suplierNumber: '',
    suplierName: '',
    address: '',
    city: '',
    phoneNum: '',
    cellularNum: '',
    faxNum: '',
    lastUpdated: '',
    country:'',
    email:'',
    contactName:'',
    currency:'',
    remarks:''
  }

  private container: ElementRef;
  @ViewChild('container') set content(content: ElementRef) {
    this.container = this.content;
  }



  constructor(private modalService: NgbModal, private supplierService: SuppliersService, private renderer: Renderer2, private toastSrv: ToastrService) { }

  open(content) {
    debugger
    this.supplier = {
      suplierNumber: '',
      suplierName: '',
      address: '',
      city: '',
      phoneNum: '',
      cellularNum: '',
      faxNum: '',
      lastUpdated: '',
      country:'',
      email:'',
      contactName:'',
      currency:'',
      remarks:''
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      debugger
      console.log(result);

      if (result == 'Saved') {
        this.saveSupplier();
      }
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(content, i) {
    debugger
    console.log(this.suppliers[i]);
    this.supplier = this.supplier[i];
    this.modalService.open(content).result.then((result) => {
      console.log(result);
      if (result == 'Saved') {
        this.saveSupplier();
      }
    })
  }



  getSuppliers() {
    this.supplierService.getAllSuppliers().subscribe(res => {
      this.suppliers = res
      this.suppliersCopy = res
      console.log(this.suppliers);

    });
  }

  saveSupplier() {
    debugger
    if(this.supplier.suplierName != "" && this.supplier.suplierNumber != "" && this.supplier.lastUpdated != "") {
    this.supplierService.addorUpdateSupplier(this.supplier).subscribe(res => {
      console.log(res);
      // if (res == "updated") this.toastSrv.info(this.supplier.suplierName, "Changes Saved");
      // else if (res.includes("Saved")) {
      
        this.toastSrv.success(this.supplier.suplierName, "New Costumer Saved");
        this.suppliers.push(this.supplier);
        
      
      // else this.toastSrv.error("Failed" , res);
    })
  } else { 
    this.toastSrv.error("Please fill all the missing fields");
  }
  }

  private getDismissReason(reason: any): string {
    debugger
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  changeText(ev)
  {
    
    let word= ev.target.value;
    let wordsArr= word.split(" ");
    wordsArr= wordsArr.filter(x=>x!="");
    if(wordsArr.length>0){
      
      let tempArr=[];
      this.suppliers.filter(x=>{
        
        var check=false;
        var matchAllArr=0;
        wordsArr.forEach(w => {
         
            if(x.suplierName.toLowerCase().includes(w.toLowerCase()) ){
              matchAllArr++
            }
            (matchAllArr==wordsArr.length)? check=true : check=false ; 
        }); 

        if(!tempArr.includes(x) && check) tempArr.push(x);
      });
         this.suppliers= tempArr;
         
    }else{
      
      this.suppliers=this.suppliersCopy.slice();
    }
  }


  ngOnInit() {
    debugger
    this.getSuppliers();
    
  }
}
