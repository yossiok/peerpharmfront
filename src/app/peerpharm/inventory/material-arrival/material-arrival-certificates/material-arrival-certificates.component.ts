import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { InventoryService } from "src/app/services/inventory.service";
import { MaterialArrivalCertif } from "../MaterialArrivalCertif";

@Component({
    selector: "app-material-arrival-certificates",
    templateUrl: "./material-arrival-certificates.component.html",
    // styleUrls: ["./material-arrival-certificates.component.scss"]

})
export class MatrialArrivalsCetificatesComponent implements OnInit {

    @Output() certToPrint: EventEmitter<MaterialArrivalCertif> = new EventEmitter<MaterialArrivalCertif>()

    certificates: MaterialArrivalCertif[]

    constructor(
        private invServ: InventoryService
    ) { }

    ngOnInit() {
        this.getAllCerts()
    }

    getAllCerts() {
        this.invServ.getAllArrivalsCertificates().subscribe(data => {
            this.certificates = data.reverse()
            console.log('all certifs: ', data)
        })
    }

    print(cert) {
        this.certToPrint.emit(cert)
    }

}