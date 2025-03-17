import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLoggedIn: boolean = false;
  userName: string = '';
  role: string = '';
  userProfileImage: string = '';
  userID: number = 0;

  constructor(private router: Router, private userservice: UserService, private http: HttpClient) {
    if (userservice.getUser().userid != 0) {
      this.isLoggedIn = true; // Change this based on actual login state
      this.userName = userservice.getUser().username; // Replace with actual username
      this.role = userservice.getUser().role;
    }
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  deleteAccount() {
    if (window.confirm('Are you sure you want to delete your account?')) {
      this.userID = this.userservice.getUser().userid;
      console.log('Deleting user with ID ', this.userID);
      this.http.delete(`https://localhost:44367/api/Users/${this.userID}`).subscribe(response => {
        console.log('User deleted successfully', response);
        this.logout();
      }, error => {
        console.error('Error deleting user', error);
      });
    }
  }
  logout() {
    this.isLoggedIn = false;
    this.userservice.setUser(0, '', '', '');
    this.navigateTo('');
  }

  contactus() {
    if (this.isLoggedIn) {
      this.navigateTo('contact');
    }
    else {
      alert('Please login to access this feature');
      this.navigateTo('');
    }
  }
}
