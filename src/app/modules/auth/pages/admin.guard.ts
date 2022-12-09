import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from '@app/core'
import { Router } from '@angular/router'
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  username: string
  constructor(private authService: AuthService, private router: Router) {
    this.username = localStorage.getItem('auth-user')
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!localStorage.getItem('auth-user')) {
      this.router.navigateByUrl('/auth')
      return false
    }
    return true
  }
}
