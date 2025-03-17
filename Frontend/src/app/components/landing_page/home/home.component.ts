import { Component } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
@Component({
  selector: 'app-home',
  imports: [SignupComponent, CommonModule, LoginComponent, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoginMode = true; // Initially show Signup component

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
