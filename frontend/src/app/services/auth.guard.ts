import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getRole() ?? '';

    if (!isLoggedIn) {
      this.router.navigate(['/not-found']);
      return false;
    }

    const expectedRoles = next.data['roles'] as Array<string> | undefined;
    if (expectedRoles && !expectedRoles.includes(userRole)) {
      this.router.navigate(['/not-found']);
      return false;
    }

    return true;
  }
}
