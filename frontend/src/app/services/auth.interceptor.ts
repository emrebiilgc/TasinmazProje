import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400 && error.status <= 599) {
          const logPayload = {
            userId: null,
            operation: 'Frontend HTTP Hatası',
            detail: `Status: ${error.status}, Message: ${error.message || 'Bilinmeyen hata'}`,
            status: false
          };
          this.http.post('https://localhost:7040/api/Log', logPayload).subscribe({
            error: () => {

            }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
