import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from "./components/landing_page/landing-page/landing-page.component";
import { DashboardComponent } from "./components/admin/dashboard/dashboard.component";
import { CreateQuizComponent } from "./components/admin/create-quiz/create-quiz.component";
import { LeaderboardComponent } from "./components/admin/leaderboard/leaderboard.component";
import { UserDashboardComponent } from "./components/user/user-dashboard/user-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingPageComponent, DashboardComponent, CreateQuizComponent, LeaderboardComponent, UserDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
