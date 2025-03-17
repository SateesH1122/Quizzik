import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from "../../landing_page/navbar/navbar.component";
import { FooterComponent } from "../../landing_page/footer/footer.component";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: 'mcq' | 'truefalse';
  options: Option[];
  correctAnswer: string;
  difficulty: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-create-quiz',
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.css']
})
export class CreateQuizComponent {
  // showModal = true;
  userId: number = 0;
  quizTitle: string = '';
  quizDescription: string = '';
  questions: Question[] = [];
  qtypetf: boolean = false;

  constructor(private router: Router, private http: HttpClient, private userservice: UserService) { }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  addQuestion() {
    this.questions.push({
      text: 'Question',
      type: 'mcq',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(option => ({ text: option, isCorrect: false })),
      correctAnswer: '',
      difficulty: 'low'
    });
  }

  // (change)="updateOptions(i) add this to the select tag in the html file
  updateOptions(index: number) {
    if (this.questions[index].type === 'truefalse') {
      this.qtypetf = true;
      this.questions[index].options = [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false }
      ];
    } else {
      this.qtypetf = false;
      this.questions[index].options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(option => ({ text: option, isCorrect: false }));
    }
  }

  addOption(questionIndex: number) {
    this.questions[questionIndex].options.push({ text: 'Option', isCorrect: false });
  }

  deleteOption(questionIndex: number, optionIndex: number) {
    // this.questions[questionIndex].options.splice(optionIndex, 1);
    const question = this.questions[questionIndex];
    if (question.options.length > 2) {
      question.options.splice(optionIndex, 1);
    } else {
      alert('MCQ questions must have at least two options.');
    }
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].correctAnswer = this.questions[questionIndex].options[optionIndex].text;
    this.questions[questionIndex].options.forEach((option, index) => {
      option.isCorrect = index === optionIndex;
    });
  }
  areAllQuestionsValid(): boolean {
    for (let question of this.questions) {
      if (!question.options.some(option => option.isCorrect)) {
        return false;
      }
    }
    return true;
  }

  saveQuiz() {
    if (this.quizTitle === '' || this.quizDescription === '') {
      alert('Please fill in all fields');
      return;
    }
    if (this.quizDescription.length < 30) {
      alert('Quiz description must be more than 30 characters.');
      return;
    }
    if (this.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    if (!this.areAllQuestionsValid()) {
      alert('Please select a correct answer for every question');
      return;
    }
    this.userId = this.userservice.getUser().userid;
    const quizDTO = {
      title: this.quizTitle,
      description: this.quizDescription,
      userID: this.userId,
      createdAt: new Date()
    };

    // Save the quiz
    this.http.post('https://localhost:44367/api/Quizzes', quizDTO).subscribe(
      (quizRes: any) => {
        console.log('Quiz Saved:', quizRes);

        // Save each question
        this.questions.forEach((question, index) => {
          const questionDTO = {
            quizID: quizRes.quizID,
            questionText: question.text,
            questionType: question.type,
            difficultyLevel: question.difficulty
          };

          this.http.post('https://localhost:44367/api/Questions', questionDTO).subscribe(
            (questionRes: any) => {
              console.log('Question Saved:', questionRes);

              // Save each option
              question.options.forEach((option, optionIndex) => {
                const optionDTO = {
                  questionID: questionRes.questionID,
                  optionText: option.text,
                  isCorrect: option.isCorrect
                };

                this.http.post('https://localhost:44367/api/Options', optionDTO).subscribe(
                  (optionRes: any) => {
                    console.log('Option Saved:', optionRes);
                  },
                  (optionError) => {
                    console.error('Error saving option', optionError);
                  }
                );
              });
            },
            (questionError) => {
              console.error('Error saving question', questionError);
            }
          );
        });

        this.navigateTo('dashboard')
      },
      (quizError) => {
        console.error('Error saving quiz', quizError);
      }
    );
  }
}