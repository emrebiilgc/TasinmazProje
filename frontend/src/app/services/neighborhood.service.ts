import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NeighborhoodService {
  constructor(private http: HttpClient) {}

  getNeighborhoods(districtId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7040/api/Neighborhood?districtId=${districtId}`);
  }
}
