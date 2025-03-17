// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { UserService } from '../../../services/user.service';

// interface Question {
//   correctAnswer: string;
//   text: string;
//   options: string[];
//   difficulty: 'low' | 'medium' | 'hard';
// }

// @Component({
//   selector: 'app-quiz-attempt',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './attempt-quiz.component.html',
//   styleUrls: ['./attempt-quiz.component.css']
// })
// export class QuizAttemptComponent implements OnInit {
//   quizId: string = '';
//   quizFound: boolean = false;
//   showQuizAttempt: boolean = false;
//   quizCompleted: boolean = false;
//   quizTitle: string = '';
//   questions: Question[] = [];
//   currentQuestionIndex: number = 0;
//   currentQuestion: Question = { text: '', options: [], difficulty: 'low', correctAnswer: '' };
//   userAnswers: { [key: number]: number } = {};
//   timeLeft: number = 0;
//   timer: any;
//   score: number = 0;
//   userID: number = 8; // Assuming a fixed user ID for this example
//   quizSearched: boolean = false;
//   hasAttemptedQuiz: boolean = false;
//   attemptedQuizzes: any[] = [];

//   constructor(private http: HttpClient, private userservice: UserService) { }

//   ngOnInit(): void {
//     this.fetchAttemptedQuizzes();
//   }
//   fetchAttemptedQuizzes() {
//     this.userID = this.userservice.getUser().userid;
//     this.http.get<any[]>(`https://localhost:44367/api/QuizAttempts/UserAttempts/${this.userID}`).subscribe(
//       (res: any[]) => {
//         console.log(res);
//         this.attemptedQuizzes = res.map((attempt: any) => ({
//           quizID: attempt.quizID,
//           scorePercent: attempt.PercentageScore,
//           title: attempt.quizTitle,
//           description: attempt.quizDescription,
//         }));
//       },
//       (error) => {
//         console.error('Error fetching attempted quizzes', error);
//       }
//     );
//   }

//   fetchQuiz() {
//     this.quizSearched = true;
//     console.log('Entered Quiz ID:', this.quizId);
//     this.hasAttemptedQuiz = this.attemptedQuizzes.some(quiz => quiz.quizID === Number(this.quizId));
//     console.log('Has attempted quiz:', this.hasAttemptedQuiz);
//     if (this.hasAttemptedQuiz) {
//       this.quizFound = false;
//       return;
//     }
//     this.http.get(`https://localhost:44367/api/QuizAttempts/WithOptions/${this.quizId}`).subscribe(
//       (res: any) => {
//         console.log('API Response:', res);
//         if (res && Object.keys(res).length > 0) {

//           this.quizTitle = 'Sample Quiz'; // You can set this based on the response if needed
//           this.questions = Object.values(res).map((question: any) => ({
//             text: question.questionText,
//             options: Object.values(question.options),
//             difficulty: 'low', // Set difficulty based on your criteria
//             correctAnswer: question.correctAnswer
//           }));
//           this.quizFound = true;
//         } else {
//           this.quizFound = false;
//         }
//       },
//       (error) => {
//         console.error('Error fetching quiz data', error);
//         this.quizFound = false;
//       }
//     );
//   }

//   startQuiz() {
//     this.showQuizAttempt = true;
//     this.currentQuestionIndex = 0;
//     this.currentQuestion = this.questions[this.currentQuestionIndex];
//     this.setTimer();
//   }

//   setTimer() {
//     if (this.currentQuestion.difficulty === 'low') {
//       this.timeLeft = 5;
//     } else if (this.currentQuestion.difficulty === 'medium') {
//       this.timeLeft = 20;
//     } else if (this.currentQuestion.difficulty === 'hard') {
//       this.timeLeft = 30;
//     }
//     this.timer = setInterval(() => {
//       this.timeLeft--;
//       if (this.timeLeft <= 0) {
//         clearInterval(this.timer);
//         this.nextQuestion();
//       }
//     }, 1000);
//   }

//   onNextClick() {
//     if (this.userAnswers[this.currentQuestionIndex]) {
//       this.nextQuestion();
//     } else {
//       // Display a message or handle the case where no option is selected
//       alert('Please select an option before proceeding to the next question.');
//     }
//   }

//   nextQuestion() {
//     if (this.userAnswers[this.currentQuestionIndex] || this.timeLeft <= 0) {
//       clearInterval(this.timer);
//       if (this.currentQuestionIndex < this.questions.length - 1) {
//         this.currentQuestionIndex++;
//         this.currentQuestion = this.questions[this.currentQuestionIndex];
//         this.setTimer();
//       } else {
//         this.submitQuiz();
//       }
//     }
//   }

//   submitQuiz() {
//     clearInterval(this.timer);
//     this.showQuizAttempt = false;
//     this.quizCompleted = true;
//     this.quizFound = false;

//     const submissionDTO = {
//       userID: this.userID,
//       quizID: parseInt(this.quizId),
//       answers: this.userAnswers
//     };

//     this.http.post('https://localhost:44367/api/QuizAttempts/Submit', submissionDTO).subscribe(
//       (res: any) => {
//         console.log('Quiz Submission Response:', res);
//         this.score = res.score;
//       },
//       (error) => {
//         console.error('Error submitting quiz', error);
//       }
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { FooterComponent } from "../../landing_page/footer/footer.component";
import { UserService } from '../../../services/user.service';

interface Question {
  correctAnswer: string;
  text: string;
  options: string[];
  difficulty: 'low' | 'medium' | 'hard';
}

@Component({
  selector: 'app-quiz-attempt',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './attempt-quiz.component.html',
  styleUrls: ['./attempt-quiz.component.css']
})
export class QuizAttemptComponent implements OnInit {
  quizId: any = '';
  quizFound: boolean = false;
  showQuizAttempt: boolean = false;
  quizCompleted: boolean = false;
  quizTitle: string = '';
  quizDescription: string = '';
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question = { text: '', options: [], difficulty: 'low', correctAnswer: '' };
  userAnswers: { [key: number]: string } = {};
  timeLeft: number = 0;
  timer: any;
  score: number = 0;
  userID: number = 0;
  quizSearched: boolean = false;
  hasAttemptedQuiz: boolean = false;
  attemptedQuizzes: any[] = [];

  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }

  ngOnInit(): void {
    // Initial setup if needed
    this.fetchAttemptedQuizzes();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
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

  fetchQuiz() {
    this.quizSearched = true;
    console.log('Entered Quiz ID:', this.quizId);
    this.hasAttemptedQuiz = this.attemptedQuizzes.some(quiz => quiz.quizID === Number(this.quizId));
    console.log('Has attempted quiz:', this.hasAttemptedQuiz);
    if (this.hasAttemptedQuiz) {
      this.quizFound = false;
      return;
    }
    this.http.get(`https://localhost:44367/api/QuizAttempts/WithOptions/${this.quizId}`).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res && res.length > 0) {
          const firstQuestion = res[0];
          this.quizTitle = firstQuestion.quizTitle;
          this.quizDescription = firstQuestion.quizDescription;
          this.questions = res.map((question: any) => ({
            text: question.questionText,
            options: Object.values(question.options),
            difficulty: question.difficultyLevel,
            correctAnswer: question.correctAnswer
          }));
          this.quizFound = true;
        } else {
          this.quizFound = false;
        }
      },
      (error) => {
        console.error('Error fetching quiz data', error);
        this.quizFound = false;
      }
    );
  }

  startQuiz() {
    if (this.hasAttemptedQuiz) {
      alert('You have already attempted the quiz.');
      return;
    }
    this.showQuizAttempt = true;
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.setTimer();
  }

  setTimer() {
    if (this.currentQuestion.difficulty === 'low') {
      this.timeLeft = 20;
    } else if (this.currentQuestion.difficulty === 'medium') {
      this.timeLeft = 30;
    } else if (this.currentQuestion.difficulty === 'hard') {
      this.timeLeft = 40;
    }
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.nextQuestion();
      }
    }, 1000);
  }

  onNextClick() {
    if (this.userAnswers[this.currentQuestionIndex]) {
      this.nextQuestion();
    } else {
      // Display a message or handle the case where no option is selected
      alert('Please select an option before proceeding to the next question.');
    }
  }

  nextQuestion() {
    if (this.userAnswers[this.currentQuestionIndex] || this.timeLeft <= 0) {
      clearInterval(this.timer);

      // Check if the selected answer is correct
      console.log(this.userAnswers);
      if (this.userAnswers[this.currentQuestionIndex] === this.questions[this.currentQuestionIndex].correctAnswer) {
        this.score++;
      }

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.setTimer();
      } else {
        this.submitQuiz();
      }
    }
  }


  submitQuiz() {
    clearInterval(this.timer);
    this.showQuizAttempt = false;
    this.quizCompleted = true;
    this.quizFound = false;

    const quizAttempt = {
      UserID: this.userID, // Assuming you have userId property
      QuizID: this.quizId, // Assuming you have quizId property
      Score: this.score
    };

    this.http.post('https://localhost:44367/api/QuizAttempts', quizAttempt).subscribe(response => {
      console.log('Quiz attempt saved successfully', response);
    }, error => {
      console.error('Error saving quiz attempt', error);
    });
  }
}