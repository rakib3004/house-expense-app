import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5000/api';  // Replace with your API URL

  constructor(private http: HttpClient) { }

  getMonthlyExpenses(month: number, year: number): Observable<any[]> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    
    return this.http.get<any[]>(`${this.apiUrl}/monthly-expenses`, { params });
  }

  getCategoryExpenses(category: string, startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('start_date', startDate)
      .set('end_date', endDate);
    
    return this.http.get<any[]>(`${this.apiUrl}/category-expenses`, { params });
  }

  getCustomExpenses(minAmount: number, maxAmount: number, startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('min_amount', minAmount.toString())
      .set('max_amount', maxAmount.toString())
      .set('start_date', startDate)
      .set('end_date', endDate);
    
    return this.http.get<any[]>(`${this.apiUrl}/custom-expenses`, { params });
  }

  exportToExcel(data: any[], filename: string): void {
    // Basic client-side Excel export
    if (!data || data.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Get headers from first row
    const headers = Object.keys(data[0]);
    csvContent += headers.join(",") + "\n";
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Handle special characters and wrap in quotes if needed
        const cell = item[header]?.toString() || '';
        return cell.includes(',') || cell.includes('"') || cell.includes('\n') 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell;
      });
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
