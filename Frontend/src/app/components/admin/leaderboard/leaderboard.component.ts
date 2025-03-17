import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { FooterComponent } from "../../landing_page/footer/footer.component";


interface LeaderboardEntry {
  attemptID: number;
  userID: number;
  quizID: number;
  score: number;
  username: string;
}

interface Quiz {
  quizID: number;
  title: string;
  description: string;
  userID: number;
  createdAt: string;
}
@Component({
  selector: 'app-leaderboard',
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  quizzes: any[] = [];
  selectedQuiz: number = 0;
  leaderboardEntries: any[] = [];
  userID: number = 0;
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }

  ngOnInit(): void {
    this.fetchQuizzes();
    if (this.quizzes.length > 0) {
      this.selectedQuiz = this.quizzes[0].quizID;
    }
    this.getLeaderboard();
  }

  fetchQuizzes() {
    this.userID = this.userservice.getUser().userid;
    console.log('Fetching quizzes for user');
    this.http.get<Quiz[]>(`https://localhost:44367/api/Quizzes/User/${this.userID}`).subscribe(
      (res: Quiz[]) => {
        console.log('Fetched quizzes', res);
        this.quizzes = res;
      },
      (error) => {
        console.error('Error fetching quizzes', error);
      }
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  getLeaderboard() {
    console.log(this.selectedQuiz);
    if (this.selectedQuiz > 0) {
      console.log('Fetching leaderboard entries for quiz', this.selectedQuiz);
      this.http.get<LeaderboardEntry[]>(`https://localhost:44367/api/Leaderboards/Quiz/${this.selectedQuiz}`).subscribe(
        (res: LeaderboardEntry[]) => {
          console.log('Fetched leaderboard entries', res);
          this.leaderboardEntries = res;
        },
        (error) => {
          console.error('Error fetching leaderboard entries', error);
        }
      );
    }
  }
}
