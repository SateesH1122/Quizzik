import { Routes } from '@angular/router';
import { CreateQuizComponent } from './components/admin/create-quiz/create-quiz.component';
import { LandingPageComponent } from './components/landing_page/landing-page/landing-page.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LeaderboardComponent } from './components/admin/leaderboard/leaderboard.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { QuizAttemptComponent } from './components/user/attempt-quiz/attempt-quiz.component';
import { UserLeaderboardComponent } from './components/user/user-leaderboard/user-leaderboard.component';
import { DeleteQuizComponent } from './components/admin/delete-quiz/delete-quiz.component';
import { AboutComponent } from './components/landing_page/about/about.component';
import { ContactComponent } from './components/landing_page/contact/contact.component';
import { HomeComponent } from './components/landing_page/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './components/user/profile/profile.component';
export const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create-quiz', component: CreateQuizComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'attempt-quiz', component: QuizAttemptComponent, canActivate: [AuthGuard] },
  { path: 'user-leaderboard', component: UserLeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'delete-quiz', component: DeleteQuizComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];
// { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },