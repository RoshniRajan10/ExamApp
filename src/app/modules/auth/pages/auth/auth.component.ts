import { Component, OnInit, Renderer2 } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService, ToastMessageService, AuthModel } from '@app/core'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  public authForm: FormGroup
  public isAuthLoading = false
  loginForm: FormGroup
  isSubmit: boolean
  isloggedIn: string
  constructor(
    private renderer: Renderer2,
    private toastr: ToastMessageService,
    public formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.isloggedIn = 'True'
    this.setLoginForm()
  }

  ngOnInit(): void {}

  setLoginForm() {
    this.loginForm = this.formbuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    })
  }

  login() {
    localStorage.setItem('username', this.loginForm.value.email)
    const isValid = this.validateLogin()
    if (isValid) {
      this.isSubmit = true
      const authCredentials = this.getCredentials()
      this.authService.authenticate(authCredentials).then((data) => {
        if(data){
          localStorage.setItem('auth-user', JSON.stringify(data))
          this.router.navigateByUrl('/dashboard')
        } else {
          this.onAuthError();
        }
      })
    }
  }

  getCredentials(): AuthModel {
    const {
      controls: {
        email: { value: emailAddress },
        password: { value: password },
      },
    } = this.loginForm
    const authCredential: AuthModel = { emailAddress, password }
    return authCredential
  }

  validateLogin() {
    const { valid, invalid } = this.loginForm
    if (invalid) {
      this.setToastError('Plese Enter Credentials')
      return false
    }
    return true
  }

  onAuthError() {
    this.isSubmit = false;
    this.loginForm.reset();
    this.setToastError('Plese Enter valid Credentials')
  }

  setToastError(errorMessage) {
    this.toastr.show(errorMessage)
  }
}
