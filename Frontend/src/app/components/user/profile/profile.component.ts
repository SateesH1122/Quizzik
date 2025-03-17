import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../landing_page/footer/footer.component";
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'

})
export class ProfileComponent implements OnInit {
  userId: number = 0; // Assuming a fixed user ID for this example
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }

  ngOnInit(): void {
    this.userId = this.userservice.getUser().userid;
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.http.get<any>(`https://localhost:44367/api/Users/${this.userId}`).subscribe(
      (res: any) => {
        this.username = res.username;
        this.email = res.email;
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  updateProfile() {
    const updateData = {
      userID: this.userId,
      username: this.username,
      email: this.email,
      role: this.userservice.getUser().role,
      password: this.password,
      createdAt: new Date().toISOString()
    };

    if (this.password === '' || this.username === '') {
      alert('Please fill in the required fields');
      return;
    }


    this.http.put(`https://localhost:44367/api/Users/${this.userId}`, updateData).subscribe(
      (res) => {
        console.log('Profile updated successfully', res);
        alert('Profile updated successfully');
        this.userservice.setUser(this.userId, this.userservice.getUser().role, this.username, this.email);
        this.fetchUserProfile();
      },
      (error) => {
        console.error('Error updating profile', error);
        alert('Error updating profile');
      }
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}