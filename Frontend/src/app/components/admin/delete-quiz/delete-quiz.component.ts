import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { FooterComponent } from "../../landing_page/footer/footer.component";


interface Quiz {
  quizID: number;
  title: string;
  description: string;
  userID: number;
  createdAt: string;
}
@Component({
  selector: 'app-delete-quiz',
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './delete-quiz.component.html',
  styleUrl: './delete-quiz.component.css'
})
export class DeleteQuizComponent {


  quizzes: any[] = [];
  selectedQuiz: number = 0;
  userID: number = 0;
  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }

  ngOnInit(): void {
    this.fetchQuizzes();
    if (this.quizzes.length > 0) {
      this.selectedQuiz = this.quizzes[0].quizID;
    }

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

  deletequiz() {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      console.log('Deleting the quiz with ID ', this.selectedQuiz);
      this.http.delete(`https://localhost:44367/api/Quizzes/${this.selectedQuiz}`).subscribe(
        (res) => {
          this.fetchQuizzes();
          console.log('Quiz deleted successfully');
          alert('Quiz deleted successfully');
          console.log('Remaining quizzes', this.quizzes);
        },
        (error) => {
          console.error('Error fetching quizzes', error);
        }
      );
    } else {
      console.log('Quiz deletion cancelled');
    }
  }
}

