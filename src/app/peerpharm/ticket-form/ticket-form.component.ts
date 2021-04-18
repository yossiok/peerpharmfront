import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from 'src/app/services/tickets.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {

  constructor(
    private ticketsService: TicketsService,
    private toastSrv: ToastrService,
    private fb: FormBuilder,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    // TICKET FORM INIT \\
    this.ticketForm = this.fb.group({
      username: ['', Validators.required],
      ticketTitle: ['', Validators.required],
      screen: ['', Validators.required],
      severity: ['', Validators.required],
      urgency: ['', Validators.required],
      description: ['', Validators.required],
      comments: [''],
      screenshot: [null]
    });
    this.userService.getAllScreens().subscribe(data => {
      this.tfScreens = data.map(d => d.name);
    });
    // END TICKET FORM INIT \\

    // TICKETS TABLE INIT \\
    this.ticketsService.getAllTickets().subscribe(data => {
      this.tickets = data.map(d => d);
      console.log(this.tickets);
    })
    // END TICKETS TABLE INIT \\
  }


  /* **** TICKET FORM AREA **** */
  // TICKET FORM VARIABLES \\
  ticketForm: FormGroup;
  tfScreens: Array<String>;
  tfSeverities: Array<String> = [
    'Very Severe - Might damage finance\\materials',
    'Severe - Might damage materials',
    'Interrupts Work - UI isn\'t understood',
    'Cosmetic',
  ];
  tfUrgencies: Array<String> = [
    'Very Urgent - Interrupts Work',
    'Urgent - Demands an immediate solution',
    'Slightly Urgent - Demands a solution soon',
    'Not Urgent',
    'Cosmetic',
  ];
  tfFileBase64: String;
  // END TICKET FORM VARIABLES \\

  // TICKET FORM FUNCTIONS \\
  onTicketFormSubmit() {
    if (this.ticketForm.valid) {
      const ticketFormData = {
        ...this.ticketForm.value,
        screenshot: this.tfFileBase64,
        ticketOpenedDate: new Date().toLocaleString('en-IL')
      };

      this.ticketsService.addNewTicket(ticketFormData).subscribe((res) => {
        console.log(res);
        alert('טופס נפתח בהצלחה');
        this.ticketForm.reset();
      });
    } else {
      //this.toastSrv.error("Form is incomplete !");
      const errorFields = [];
      let errorMessage = "";
      Object.entries(this.ticketForm.controls).forEach(control => {
        control[1].valid ? null : errorFields.push(control[0]);
      });
      errorMessage = errorFields.map(field => `</br>${field} is REQUIRED</br>`).join('');
      console.log(this.ticketForm);
      this.toastSrv.error(errorMessage, 'Error(s) in Form: ', { enableHtml: true });
    }
  }

  onTicketFormReset() {
    this.ticketForm.reset();
  }

  async validateFileInput(fileEvent: any) {
    const file = fileEvent.target.files[0];
    if (file && !file.type.includes('image')) {
      fileEvent.target.value = null;
      this.toastSrv.error('Please select an IMAGE file only');
    } else {
      const fileBase64 = await this.convertFileToBase64(file)
      this.tfFileBase64 = fileBase64.toString();
    }
  }

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }
  // END TICKET FORM FUNCTIONS \\
  /* **** END TICKET FORM AREA **** */

  /* **** TICKETS TABLE AREA **** */
  // TICKET TABLE VARIABLES \\
  tickets: Array<any>;
  // END TICKET TABLE VARIABLES \\
  /* **** END TICKETS TABLE AREA **** */
}
