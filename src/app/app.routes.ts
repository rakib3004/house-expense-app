import { Routes } from '@angular/router';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';

export const routes: Routes = [
  { path: '', component: ExpenseTrackerComponent },
  { path: '**', redirectTo: '' }
];