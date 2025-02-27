import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ExpenseService } from '../../services/expense.service';

// PrimeNG Imports
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    ToolbarModule
  ],
  templateUrl: './expense-tracker.component.html'
})

export class ExpenseTrackerComponent implements OnInit {
  // Forms for each section
  monthlyForm: FormGroup;
  categoryForm: FormGroup;
  customForm: FormGroup;

  // Results data
  monthlyExpenses: any[] = [];
  categoryExpenses: any[] = [];
  customResults: any[] = [];

  // Loading states
  loadingMonthly = false;
  loadingCategory = false;
  loadingCustom = false;

  // Categories dropdown
  categories: any[] = [
    { name: 'Groceries', code: 'GROC' },
    { name: 'Utilities', code: 'UTIL' },
    { name: 'Rent/Mortgage', code: 'HOME' },
    { name: 'Transportation', code: 'TRAN' },
    { name: 'Entertainment', code: 'ENT' },
    { name: 'Medical', code: 'MED' },
    { name: 'Other', code: 'OTHER' }
  ];

  // Columns for display
  monthlyColumns: any[];
  categoryColumns: any[];
  customColumns: any[];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private messageService: MessageService
  ) {
    this.monthlyForm = this.fb.group({
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.customForm = this.fb.group({
      minAmount: ['', Validators.required],
      maxAmount: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    
    this.monthlyColumns = [
      { field: 'date', header: 'Date' },
      { field: 'category', header: 'Category' },
      { field: 'description', header: 'Description' },
      { field: 'amount', header: 'Amount' }
    ];

    this.categoryColumns = [
      { field: 'date', header: 'Date' },
      { field: 'description', header: 'Description' },
      { field: 'amount', header: 'Amount' },
      { field: 'payment_method', header: 'Payment Method' }
    ];

    this.customColumns = [
      { field: 'date', header: 'Date' },
      { field: 'category', header: 'Category' },
      { field: 'description', header: 'Description' },
      { field: 'amount', header: 'Amount' },
      { field: 'payment_method', header: 'Payment Method' }
    ];
  }

  ngOnInit() {
    // Initialize any additional properties if needed
  }

  getMonthlyExpenses() {
    if (this.monthlyForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loadingMonthly = true;
    const { month, year } = this.monthlyForm.value;
    
    this.expenseService.getMonthlyExpenses(month, year).subscribe({
      next: (data) => {
        this.monthlyExpenses = data;
        this.loadingMonthly = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load monthly expenses'
        });
        this.loadingMonthly = false;
        console.error('Error loading monthly expenses', error);
      }
    });
  }

  getCategoryExpenses() {
    if (this.categoryForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loadingCategory = true;
    const { category, startDate, endDate } = this.categoryForm.value;
    
    this.expenseService.getCategoryExpenses(
      category.code,
      this.formatDate(startDate),
      this.formatDate(endDate)
    ).subscribe({
      next: (data) => {
        this.categoryExpenses = data;
        this.loadingCategory = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load category expenses'
        });
        this.loadingCategory = false;
        console.error('Error loading category expenses', error);
      }
    });
  }

  getCustomExpenses() {
    if (this.customForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loadingCustom = true;
    const { minAmount, maxAmount, startDate, endDate } = this.customForm.value;
    
    this.expenseService.getCustomExpenses(
      minAmount,
      maxAmount,
      this.formatDate(startDate),
      this.formatDate(endDate)
    ).subscribe({
      next: (data) => {
        this.customResults = data;
        this.loadingCustom = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load custom report'
        });
        this.loadingCustom = false;
        console.error('Error loading custom expenses', error);
      }
    });
  }

  exportToExcel(data: any[], filename: string) {
    this.expenseService.exportToExcel(data, filename);
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
