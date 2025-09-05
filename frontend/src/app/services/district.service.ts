import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DistrictService {
  constructor(private http: HttpClient) {}

  getDistricts(cityId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7040/api/District?cityId=${cityId}`);
  }
}
