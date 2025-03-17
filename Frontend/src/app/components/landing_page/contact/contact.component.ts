// import { Component } from '@angular/core';
// import { NavbarComponent } from "../navbar/navbar.component";
// import { FooterComponent } from "../footer/footer.component";

// @Component({
//   selector: 'app-contact',
//   imports: [NavbarComponent, FooterComponent],
//   templateUrl: './contact.component.html',
//   styleUrl: './contact.component.css'
// })
// export class ContactComponent {

// }

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  email: string = '';
  username: string = '';
  constructor(private userservice: UserService) { }
  ngOnInit(): void {
    this.email = this.userservice.getUser().email;
    this.username = this.userservice.getUser().username;
  }
  public sendEmail(e: Event) {
    e.preventDefault();

    emailjs.sendForm('service_mknr2ay', 'template_5bw74wb', e.target as HTMLFormElement, '_KqmKltuKVn1sIqWX')
      .then((result: EmailJSResponseStatus) => {
        alert('Email sent successfully!');
      }, (error) => {
        alert('Failed to send email. Please try again later.');
      });
  }
}