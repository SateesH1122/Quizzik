import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  @Output() switchToLogin = new EventEmitter<void>();

  constructor(private http: HttpClient) {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]),
      role: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user = this.signupForm.value;
      user.email = user.email.toLowerCase();

      this.http.post('https://localhost:44367/api/Users/Register', user).subscribe(
        (response) => {

          console.log('User registered successfully', response);
          alert('Registration successful!\nPlease login to continue.');
          this.switchToLogin.emit();
        },
        error => {
          alert('Registration failed. Email already exists.');
          //console.error('Error registering user', error);
        }
      );
    }
  }

  goToLogin() {
    this.switchToLogin.emit();
  }
}