import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <h1 class="text-3xl mb-3">Household Expense Tracker</h1>
      <router-outlet></router-outlet>
    </div>
    <p-toast></p-toast>
  `,
  styles: []
})
export class AppComponent {
  title = 'household-expense-tracker';
}