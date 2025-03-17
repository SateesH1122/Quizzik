import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  userid: number = 0;
  role: string = '';
  username: string = '';
  email: string = '';
  getUser() {
    return {
      userid: this.userid,
      role: this.role,
      username: this.username,
      email: this.email
    }
  }
  setUser(userid: number, role: string, username: string, email: string) {
    this.userid = userid;
    this.role = role;
    this.username = username;
    this.email = email;
  }

}
