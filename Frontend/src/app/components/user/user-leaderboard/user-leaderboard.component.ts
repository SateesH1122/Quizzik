import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { FooterComponent } from "../../landing_page/footer/footer.component";
import { UserService } from '../../../services/user.service';

interface LeaderboardEntry {
  attemptID: number;
  userID: number;
  quizID: number;
  score: number;
  username: string;
}

interface QuizAttempt {
  quizID: number;
  title: string;
  description: string;
  scorePercent: number;
}

@Component({
  selector: 'app-user-leaderboard',
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './user-leaderboard.component.html',
  styleUrl: './user-leaderboard.component.css'
})
export class UserLeaderboardComponent {
  attemptedQuizzes: any[] = [];
  selectedQuiz: number = 0;
  leaderboardEntries: any[] = [];
  userID: number = 0;
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }

  ngOnInit(): void {
    this.fetchAttemptedQuizzes();
    this.getLeaderboard();
  }
  fetchAttemptedQuizzes() {
    this.userID = this.userservice.getUser().userid;
    this.http.get<any[]>(`https://localhost:44367/api/QuizAttempts/UserAttempts/${this.userID}`).subscribe(
      (res: any[]) => {
        console.log(res); // Check the console for the API response
        this.attemptedQuizzes = res.map((attempt: any) => ({
          quizID: attempt.quizID,
          scorePercent: attempt.PercentageScore,
          title: attempt.quizTitle,
          description: attempt.quizDescription,
        }));
      },
      (error) => {
        console.error('Error fetching attempted quizzes', error);
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
