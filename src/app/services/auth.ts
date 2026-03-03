import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL matches the backend routes exactly
  private apiUrl = 'http://localhost:3000/api/admin'; 

  constructor() { }

  register(adminData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, adminData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}