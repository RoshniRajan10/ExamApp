import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>()
  public searchForm: FormGroup
  username: string

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('auth-user')
    this.searchForm = new FormGroup({
      search: new FormControl(null),
    })
  }

  logout() {
    if (localStorage.getItem('auth-user')) {
      this.angularFireAuth.auth.signOut()
      localStorage.removeItem('auth-user')
      this.router.navigateByUrl('/auth')
    }
  }
}
