import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'https://localhost:7040/api/Log'; // senin API adresin

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
